import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, type } from '@thali/ui-tokens';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { analyzeMealImage, isRecognitionEnabled, resolveComponents } from '../../src/supabase';
import type { MealType } from '../../src/store';

type Stage = 'framing' | 'analyzing' | 'error';

function inferMealType(): MealType {
  const h = new Date().getHours();
  if (h < 11) return 'breakfast';
  if (h < 15) return 'lunch';
  if (h < 21) return 'dinner';
  return 'snack';
}

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cam = useRef<CameraView>(null);
  const [stage, setStage] = useState<Stage>('framing');
  const [error, setError] = useState<string | null>(null);

  // Permission gate ─────────────────────────────────────────────────────
  if (!permission) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <Text style={{ ...type.h1, color: colors.text }}>Camera access</Text>
        <Text style={{ ...type.body, color: colors.textMuted }}>
          Thali reads the plate on-device with your camera. Photos never leave your phone unless you log the meal.
        </Text>
        <View style={{ flex: 1 }} />
        <Button label="Grant camera access" onPress={requestPermission} />
        <Button label="Pick a photo instead" variant="ghost" onPress={pickFromLibrary} />
        <Button label="Back" variant="ghost" onPress={() => router.back()} />
      </Screen>
    );
  }

  // Analyze pipeline ────────────────────────────────────────────────────
  async function handleAnalyze(base64: string, mimeType: string) {
    setStage('analyzing');
    setError(null);
    try {
      const recognition = await analyzeMealImage(base64, mimeType);
      const { components, unresolved } = resolveComponents(recognition);

      if (components.length === 0) {
        setStage('framing');
        Alert.alert(
          "Couldn't match this plate",
          unresolved.length
            ? `Recognized ${unresolved.join(', ')} but nothing in our dish library matches yet. Try Add manually.`
            : 'The model returned no dishes. Try a clearer, top-down photo.',
        );
        return;
      }

      router.replace({
        pathname: '/add/review',
        params: {
          mealType: inferMealType(),
          payload: JSON.stringify(components),
          source: 'photo',
          unresolved: unresolved.join('|'),
          mock: recognition.mock ? '1' : '0',
        },
      });
    } catch (e) {
      setStage('error');
      setError(e instanceof Error ? e.message : 'unknown_error');
    }
  }

  async function snap() {
    if (!cam.current) return;
    try {
      const photo = await cam.current.takePictureAsync({ base64: true, quality: 0.6, skipProcessing: true });
      if (!photo?.base64) throw new Error('no_base64_returned');
      await handleAnalyze(photo.base64, 'image/jpeg');
    } catch (e) {
      setStage('error');
      setError(e instanceof Error ? e.message : 'capture_failed');
    }
  }

  async function pickFromLibrary() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.6,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    const base64 = asset.base64
      ?? (await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 }));
    await handleAnalyze(base64, asset.mimeType ?? 'image/jpeg');
  }

  // Render ──────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <CameraView ref={cam} style={StyleSheet.absoluteFillObject} facing="back" />

      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.topBtn}>
          <Text style={styles.topBtnText}>Close</Text>
        </Pressable>
        {!isRecognitionEnabled() && (
          <View style={styles.devPill}>
            <Text style={{ ...type.caption, color: colors.accent }}>Mock mode</Text>
          </View>
        )}
      </View>

      <View style={styles.bottomBar}>
        <Pressable onPress={pickFromLibrary} style={styles.libBtn}>
          <Text style={styles.libBtnText}>Library</Text>
        </Pressable>
        <Pressable onPress={snap} disabled={stage !== 'framing'} style={[styles.shutter, stage !== 'framing' && { opacity: 0.5 }]}>
          <View style={styles.shutterInner} />
        </Pressable>
        <View style={styles.libBtn} />
      </View>

      {stage === 'analyzing' && (
        <View style={styles.overlay}>
          <Card style={{ alignItems: 'center', gap: spacing.md, minWidth: 220 }}>
            <ActivityIndicator size="large" color={colors.brand} />
            <Text style={{ ...type.bodyBold, color: colors.text }}>Reading the plate…</Text>
            <Text style={{ ...type.caption, color: colors.textMuted, textAlign: 'center' }}>
              Identifying components and estimating portions.
            </Text>
          </Card>
        </View>
      )}

      {stage === 'error' && (
        <View style={styles.overlay}>
          <Card style={{ gap: spacing.md, minWidth: 260 }}>
            <Text style={{ ...type.h3, color: colors.text }}>Couldn't analyze</Text>
            <Text style={{ ...type.body, color: colors.textMuted }}>{error ?? 'Unknown error.'}</Text>
            <Button label="Try again" onPress={() => setStage('framing')} />
            <Button label="Add manually instead" variant="ghost" onPress={() => router.replace('/add/manual')} />
          </Card>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  topBar: {
    position: 'absolute',
    top: 60, left: 20, right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBtn: { backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill },
  topBtnText: { ...type.bodyBold, color: '#fff' },
  devPill: { backgroundColor: colors.accentSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill },
  bottomBar: {
    position: 'absolute',
    bottom: 60, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.xl,
  },
  libBtn: { minWidth: 70, alignItems: 'center' },
  libBtnText: { ...type.body, color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.pill, overflow: 'hidden' },
  shutter: {
    width: 78, height: 78, borderRadius: 39,
    borderWidth: 4, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  shutterInner: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
});
