// Wobbi Design Tokens

export const Colors = {
  light: { background: '#F8FAFC', cardBg: '#FFFFFF', text: '#1E293B', textMuted: '#64748B', primary: '#6C4EF5', border: 'rgba(0,0,0,0.08)' },
  dark:  { background: '#0F1020', cardBg: '#1A1C3A', text: '#FFFFFF',  textMuted: '#94A3B8', primary: '#7D67FF', border: 'rgba(255,255,255,0.08)' },
  day:   { background: '#F8FAFC', cardBg: '#FFFFFF', text: '#1E293B', textMuted: '#64748B', primary: '#6C4EF5', border: 'rgba(0,0,0,0.08)' },
  night: { background: '#0F1020', cardBg: '#1A1C3A', text: '#FFFFFF',  textMuted: '#94A3B8', primary: '#7D67FF', border: 'rgba(255,255,255,0.08)' },
};

export type ThemeKey = keyof typeof Colors;

// Eski kod uyumluluğu için küçük harf alias
export const colors = {
  primary:  { purple: '#6c4ef5', deepPurple: '#5b3bf6', blue: '#4d88ff', green: '#21c16b' },
  semantic: { success: '#21c16b', warning: '#ffcb00', streak: '#ff8a00', error: '#ff4d4f', info: '#4d88ff' },
  neutral:  { textPrimary: '#001328', textSecondary: '#6b7280', border: '#e5e7eb', surface: '#f6f7fb', background: '#ffffff' },
} as const;

export const Fonts = { mono: 'monospace' };
