import { Colors, ThemeMode, AppTheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme(overrideMode?: ThemeMode): { theme: AppTheme; mode: ThemeMode } {
  const systemScheme = useColorScheme();
  const mode: ThemeMode = overrideMode ?? (systemScheme === 'dark' ? 'dark' : 'light');
  return {
    theme: Colors[mode],
    mode,
  };
}
