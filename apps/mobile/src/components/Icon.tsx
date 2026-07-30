import React from 'react';
import * as L from 'lucide-react-native';
import { colors } from '@thali/ui-tokens';

// Curated icon set. Names map to Lucide directly. Keeps import surface
// controlled and lets us swap the icon lib later without touching screens.
export const Icons = {
  camera:      L.Camera,
  scan:        L.ScanLine,
  sparkles:    L.Sparkles,
  brain:       L.BrainCircuit,
  flame:       L.Flame,
  target:      L.Target,
  trending:    L.TrendingUp,
  chart:       L.BarChart3,
  utensils:    L.Utensils,
  coffee:      L.Coffee,
  soup:        L.Soup,
  cookie:      L.Cookie,
  moon:        L.Moon,
  sun:         L.Sun,
  sunrise:     L.Sunrise,
  sunset:      L.Sunset,
  award:       L.Award,
  droplets:    L.Droplets,
  leaf:        L.Leaf,
  heart:       L.HeartPulse,
  bell:        L.Bell,
  settings:    L.Settings2,
  user:        L.User,
  users:       L.Users,
  home:        L.Home,
  history:     L.CalendarDays,
  plus:        L.Plus,
  check:       L.Check,
  x:           L.X,
  chevronR:    L.ChevronRight,
  chevronL:    L.ChevronLeft,
  chevronD:    L.ChevronDown,
  arrowR:      L.ArrowRight,
  arrowUp:     L.ArrowUpRight,
  arrowDown:   L.ArrowDownRight,
  swap:        L.ArrowLeftRight,
  info:        L.Info,
  zap:         L.Zap,
  wand:        L.Wand2,
  bookmark:    L.Bookmark,
  camera2:     L.CameraOff,
  imageIcon:   L.ImagePlus,
  activity:    L.Activity,
  scale:       L.Scale,
  ruler:       L.Ruler,
  search:      L.Search,
  filter:      L.SlidersHorizontal,
  clock:       L.Clock,
  trash:       L.Trash2,
  arrowLeft:   L.ArrowLeft,
  moreHoriz:   L.MoreHorizontal,
} as const;

export type IconName = keyof typeof Icons;

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, color = colors.text, strokeWidth = 1.8 }: Props) {
  const Cmp = Icons[name];
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} />;
}
