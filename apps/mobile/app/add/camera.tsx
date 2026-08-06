import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { estimateMeal, getDish, type MealComponent } from '@thali/shared';
import { colors, radii, shadow, spacing, type as t } from '@thali/ui-tokens';
import { Icon, IconName } from '../../src/components/Icon';
import { analyzeMealImage, resolveComponents } from '../../src/supabase';
import { track } from '../../src/telemetry';
import type { MealType } from '../../src/store';

const { width: W, height: H } = Dimensions.get('window');

type Stage = 'framing' | 'analyzing' | 'results' | 'error';

interface Detection { label: string; kcal: number | null; }

const BUBBLE_POS = [
  { top: H * 0.20, left: W * 0.30 },
  { top: H * 0.40, left: W * 0.05 },
  { top: H * 0.40, right: W * 0.05 },
  { top: H * 0.58, left: W * 0.32 },
  { top: H * 0.28, right: W * 0.08 },
];

function inferMealType(): MealType {
  const h = new Date().getHours();
  if (h < 11) return 'breakfast';
  if (h < 15) return 'lunch';
  if (h < 21) return 'dinner';
  return 'snack';
}

async function uriToBase64(uri: string): Promise<string> {
  const resp = await fetch(uri);
  const blob = await resp.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const r = String(reader.result || '');
      resolve(r.includes(',') ? r.split(',')[1] : r);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cam = useRef<CameraView>(null);
  const [stage, setStage] = useState<Stage>('framing');
  const [torch, setTorch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [components, setComponents] = useState<MealComponent[]>([]);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isMock, setIsMock] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [camError, setCamError] = useState(false);

  const WEB = Platform.OS === 'web';
  const cameraReady = permission?.granted && !camError;

  function resetToFraming() {
    setCaptured(null);
    setDetections([]);
    setComponents([]);
    setStage('framing');
  }

  if (!permission) {
    return <View style={styles.dark}><ActivityIndicator color="#fff" /></View>;
  }

  // Show the permission / upload screen only while framing with nothing yet
  // captured. The analyzing / results / error views below MUST still render
  // without camera access (denied prompt, or a desktop browser) so a photo
  // picked from the library still flows through to recognition.
  if (!cameraReady && stage === 'framing' && !captured) {
    return (
      <View style={styles.permWrap}>
        <View style={styles.permIcon}><Icon name="camera" size={30} color="#fff" /></View>
        <Text style={styles.permTitle}>Scan your meal</Text>
        <Text style={styles.permBody}>
          {camError
            ? 'Camera unavailable here. Upload a photo of your plate and Thali will read the dishes.'
            : 'Upload a photo of your plate — or enable the camera — and Thali reads the dishes and estimates portions.'}
        </Text>
        <Pressable style={styles.permPrimary} onPress={pickFromLibrary}>
          <Icon name="imageIcon" size={18} color="#fff" strokeWidth={2.2} />
          <Text style={styles.permPrimaryText}>Upload a photo</Text>
        </Pressable>
        {!camError && (
          <Pressable style={styles.permGhost} onPress={requestPermission}>
            <Text style={styles.permGhostText}>Or enable the camera</Text>
          </Pressable>
        )}
        {notice && <Text style={styles.permNotice}>{notice}</Text>}
        <Pressable onPress={() => router.back()} style={{ marginTop: spacing.md }}>
          <Text style={styles.permGhostText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  async function runAnalyze(base64: string, mimeType: string, uri: string) {
    setCaptured(uri);
    setStage('analyzing');
    setError(null);
    try {
      const recognition = await analyzeMealImage(base64, mimeType);
      const { components: comps, unresolved } = resolveComponents(recognition);
      setIsMock(recognition.mock);
      track('scan_used', { mock: recognition.mock, detected: comps.length + unresolved.length });

      const dets: Detection[] = [
        ...comps.map((c) => ({
          label: getDish(c.dishId)?.name ?? c.dishId,
          kcal: estimateMeal([c]).kcal.mid,
        })),
        ...unresolved.map((name) => ({ label: name, kcal: null })),
      ];

      if (comps.length === 0 && unresolved.length === 0) {
        setCaptured(null);
        setStage('framing');
        setNotice("Couldn't read the plate — try a clearer, top-down photo.");
        return;
      }
      setNotice(null);
      setComponents(comps);
      setDetections(dets);
      setStage('results');
    } catch (e) {
      setStage('error');
      setError(e instanceof Error ? e.message : 'unknown_error');
    }
  }

  async function snap() {
    if (!cam.current) return;
    try {
      const photo = await cam.current.takePictureAsync({ base64: true, quality: 0.6, skipProcessing: true });
      const uri = photo?.uri ?? '';
      const b64 = photo?.base64 ?? (uri ? await uriToBase64(uri) : undefined);
      if (!b64) throw new Error('no_image_captured');
      await runAnalyze(b64, 'image/jpeg', uri);
    } catch (e) {
      setStage('error');
      setError(e instanceof Error ? e.message : 'capture_failed');
    }
  }

  async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true, quality: 0.6,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    let base64 = asset.base64 ?? undefined;
    if (!base64) {
      base64 = Platform.OS === 'web'
        ? await uriToBase64(asset.uri)
        : await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
    }
    await runAnalyze(base64, asset.mimeType ?? 'image/jpeg', asset.uri);
  }

  function confirmLog() {
    router.replace({
      pathname: '/add/review',
      params: {
        mealType: inferMealType(),
        payload: JSON.stringify(components),
        source: 'photo',
        mock: isMock ? '1' : '0',
        unresolved: detections.filter((d) => d.kcal === null).map((d) => d.label).join('|'),
      },
    });
  }

  const totalKcal = detections.reduce((s, d) => s + (d.kcal ?? 0), 0);

  return (
    <View style={styles.dark}>
      {/* Captured photo > live camera > dark fallback */}
      {captured ? (
        <Image source={{ uri: captured }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      ) : cameraReady ? (
        <CameraView
          ref={cam}
          style={StyleSheet.absoluteFillObject}
          facing="back"
          enableTorch={torch}
          onMountError={() => setCamError(true)}
        />
      ) : (
        <View style={StyleSheet.absoluteFillObject} />
      )}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(10,8,20,0.28)' }]} pointerEvents="none" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => (stage === 'results' ? resetToFraming() : router.back())} style={styles.roundBtn}>
          <Icon name={stage === 'results' ? 'arrowLeft' : 'x'} size={20} color="#fff" />
        </Pressable>
        <Text style={styles.topTitle}>{stage === 'results' ? 'Detected' : 'Scan food'}</Text>
        <View style={styles.roundBtn}>
          <Icon name="sparkles" size={18} color="#fff" strokeWidth={2.2} />
        </View>
      </View>

      {/* Notice (e.g. couldn't read the plate) — visible on web, unlike Alert */}
      {stage === 'framing' && notice && (
        <View style={styles.noticeBanner} pointerEvents="none">
          <Icon name="info" size={15} color="#fff" strokeWidth={2.2} />
          <Text style={styles.noticeText}>{notice}</Text>
        </View>
      )}

      {/* Reticle (framing) */}
      {stage === 'framing' && (
        <View style={styles.reticle} pointerEvents="none">
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
          <Text style={styles.reticleHint}>Point at your plate</Text>
        </View>
      )}

      {/* Analyzing */}
      {stage === 'analyzing' && (
        <View style={styles.center} pointerEvents="none">
          <View style={styles.reticle}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
            <MotiView
              from={{ translateY: -90 }} animate={{ translateY: 90 }}
              transition={{ type: 'timing', duration: 1100, loop: true, repeatReverse: true }}
              style={styles.scanLine}
            />
          </View>
          <View style={styles.analyzingPill}>
            <ActivityIndicator color="#fff" size="small" />
            <Text style={styles.analyzingText}>Reading your plate…</Text>
          </View>
        </View>
      )}

      {/* Detection bubbles — cap to the fixed positions so they never overlap;
          the full list + total lives in the summary bar and review screen */}
      {stage === 'results' && detections.slice(0, BUBBLE_POS.length).map((d, i) => {
        const pos = BUBBLE_POS[i];
        return (
          <MotiView
            key={i}
            from={{ opacity: 0, scale: 0.5, translateY: 8 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 220, delay: i * 130 }}
            style={[styles.bubble, pos as object]}
          >
            <Text style={styles.bubbleLabel} numberOfLines={1}>{d.label}</Text>
            <Text style={styles.bubbleKcal}>{d.kcal !== null ? `${d.kcal} kcal` : 'tap to match'}</Text>
          </MotiView>
        );
      })}

      {/* Bottom controls */}
      {stage === 'framing' && (
        <View style={styles.bottom}>
          <View style={styles.modeRow}>
            <Mode icon="scan" label="Scan Food" active />
            <Mode icon="target" label="Barcode" onPress={() => Alert.alert('Coming soon', 'Barcode scanning is on the roadmap.')} />
            <Mode icon="bookmark" label="Food label" onPress={() => Alert.alert('Coming soon', 'Nutrition-label scanning is on the roadmap.')} />
            <Mode icon="imageIcon" label="Library" onPress={pickFromLibrary} />
          </View>
          <View style={styles.shutterRow}>
            <Pressable onPress={() => setTorch((v) => !v)} style={styles.sideBtn}>
              <Icon name="zap" size={22} color={torch ? colors.gold : '#fff'} strokeWidth={2.2} />
            </Pressable>
            <Pressable onPress={snap} style={styles.shutter}>
              <View style={styles.shutterInner} />
            </Pressable>
            <Pressable onPress={pickFromLibrary} style={styles.sideBtn}>
              <Icon name="imageIcon" size={22} color="#fff" strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>
      )}

      {/* Results action bar */}
      {stage === 'results' && (
        <MotiView
          from={{ translateY: 120, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 220, delay: 300 }}
          style={styles.resultBar}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.resultTitle}>{detections.length} item{detections.length > 1 ? 's' : ''} · ~{totalKcal} kcal</Text>
            <Text style={styles.resultSub}>{isMock ? 'Demo recognition' : 'AI recognition'} · tap Log to adjust</Text>
          </View>
          <Pressable onPress={resetToFraming} style={styles.retake}>
            <Icon name="camera" size={20} color="#fff" />
          </Pressable>
          <Pressable onPress={confirmLog} style={styles.logBtn}>
            <Icon name="check" size={18} color="#fff" strokeWidth={2.6} />
            <Text style={styles.logText}>Log meal</Text>
          </Pressable>
        </MotiView>
      )}

      {/* Error */}
      {stage === 'error' && (
        <View style={styles.center}>
          <View style={styles.errCard}>
            <Text style={[t.h3, { color: colors.text }]}>Couldn't analyze</Text>
            <Text style={[t.body, { color: colors.textMuted }]}>{error ?? 'Unknown error.'}</Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
              <Pressable onPress={resetToFraming} style={styles.errBtn}><Text style={styles.errBtnText}>Try again</Text></Pressable>
              <Pressable onPress={pickFromLibrary} style={styles.errBtnGhost}><Text style={[styles.errBtnText, { color: colors.brand }]}>Upload a photo</Text></Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function Mode({ icon, label, active, onPress }: { icon: IconName; label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.mode, active && styles.modeActive]}>
      <Icon name={icon} size={16} color={active ? colors.success : '#fff'} strokeWidth={2.2} />
      <Text style={[styles.modeLabel, active && { color: colors.success }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dark: { flex: 1, backgroundColor: '#0A0814' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },

  // Permission
  permWrap: { flex: 1, backgroundColor: '#0A0814', alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.md },
  permIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  permTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  permBody: { ...t.body, color: 'rgba(255,255,255,0.7)', textAlign: 'center', maxWidth: 300 },
  permPrimary: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.brand, paddingVertical: 15, paddingHorizontal: 32, borderRadius: 999, marginTop: spacing.md, ...shadow.brandGlow },
  permPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  permGhost: { paddingVertical: 10 },
  permGhostText: { color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  permNotice: { color: '#F2C79A', fontWeight: '600', fontSize: 13, textAlign: 'center', maxWidth: 300, marginTop: spacing.xs },
  noticeBanner: {
    position: 'absolute', top: 108, left: spacing.lg, right: spacing.lg, zIndex: 20,
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(20,16,32,0.82)', borderRadius: radii.lg, paddingVertical: 12, paddingHorizontal: 16,
  },
  noticeText: { color: '#fff', fontWeight: '600', fontSize: 13, flex: 1 },

  topBar: { position: 'absolute', top: 56, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 },
  roundBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  topTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },

  reticle: { position: 'absolute', top: H * 0.28, left: W * 0.5 - 120, width: 240, height: 240, alignItems: 'center', justifyContent: 'center' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#fff' },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
  reticleHint: { color: 'rgba(255,255,255,0.85)', fontWeight: '600', fontSize: 13, marginTop: 260 },
  scanLine: { width: 200, height: 3, borderRadius: 2, backgroundColor: colors.success, shadowColor: colors.success, shadowOpacity: 0.8, shadowRadius: 8 },

  analyzingPill: { position: 'absolute', bottom: H * 0.16, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: 'rgba(0,0,0,0.6)', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 999 },
  analyzingText: { color: '#fff', fontWeight: '600', fontSize: 15 },

  bubble: {
    position: 'absolute', backgroundColor: '#fff', borderRadius: 16,
    paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center', minWidth: 92,
    ...shadow.floating,
  },
  bubbleLabel: { fontSize: 14, fontWeight: '800', color: colors.text },
  bubbleKcal: { fontSize: 11, fontWeight: '600', color: colors.accent, marginTop: 1 },

  bottom: { position: 'absolute', bottom: 40, left: 0, right: 0, gap: spacing.xl },
  modeRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, justifyContent: 'center' },
  mode: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.14)' },
  modeActive: { backgroundColor: '#fff' },
  modeLabel: { color: '#fff', fontWeight: '700', fontSize: 12 },
  shutterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingHorizontal: spacing.xxl },
  sideBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  shutter: { width: 82, height: 82, borderRadius: 41, borderWidth: 5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#fff' },

  resultBar: {
    position: 'absolute', bottom: 40, left: spacing.lg, right: spacing.lg,
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(20,16,32,0.86)', borderRadius: radii.xxl, padding: spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  resultTitle: { color: '#fff', fontWeight: '800', fontSize: 15 },
  resultSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 1 },
  retake: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  logBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.success, paddingVertical: 13, paddingHorizontal: 18, borderRadius: 999 },
  logText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  errCard: { backgroundColor: '#fff', borderRadius: radii.xl, padding: spacing.xl, gap: spacing.sm, margin: spacing.xl, alignItems: 'flex-start' },
  errBtn: { backgroundColor: colors.brand, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 999 },
  errBtnGhost: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  errBtnText: { color: '#fff', fontWeight: '700' },
});
