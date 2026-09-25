// Design tokens — mirrors the Lingua design system
export const colors = {
  primary: {
    purple: "#6c4ef5",
    deepPurple: "#5b3bf6",
    blue: "#4d88ff",
    green: "#21c16b",
  },
  semantic: {
    success: "#21c16b",
    warning: "#ffcb00",
    streak: "#ff8a00",
    error: "#ff4d4f",
    info: "#4d88ff",
  },
  neutral: {
    textPrimary: "#001328",
    textSecondary: "#6b7280",
    border: "#e5e7eb",
    surface: "#f6f7fb",
    background: "#ffffff",
  },
} as const;

export const fontFamily = {
  regular: "System",
  medium: "System",
  semiBold: "System",
  bold: "System",
} as const;

export const fontSize = {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 16,
  bodyLg: 16,
  bodyMd: 14,
  bodySm: 13,
  caption: 11,
} as const;

export const lineHeight = {
  h1: 38,
  h2: 31,
  h3: 26,
  h4: 22,
  bodyLg: 26,
  bodyMd: 22,
  bodySm: 21,
  caption: 15,
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
} as const;

export const textStyles = {
  h1: { fontSize: fontSize.h1, fontWeight: fontWeight.bold as any, lineHeight: lineHeight.h1, color: colors.neutral.textPrimary },
  h2: { fontSize: fontSize.h2, fontWeight: fontWeight.semiBold as any, lineHeight: lineHeight.h2, color: colors.neutral.textPrimary },
  h3: { fontSize: fontSize.h3, fontWeight: fontWeight.semiBold as any, lineHeight: lineHeight.h3, color: colors.neutral.textPrimary },
  h4: { fontSize: fontSize.h4, fontWeight: fontWeight.medium as any, lineHeight: lineHeight.h4, color: colors.neutral.textPrimary },
  body: { fontSize: fontSize.bodyMd, fontWeight: fontWeight.regular as any, lineHeight: lineHeight.bodyMd, color: colors.neutral.textPrimary },
  button: { fontSize: fontSize.bodyLg, fontWeight: fontWeight.semiBold as any, lineHeight: lineHeight.bodyLg, color: colors.neutral.textPrimary },
  bodyLg: { fontSize: fontSize.bodyLg, fontWeight: fontWeight.regular as any, lineHeight: lineHeight.bodyLg, color: colors.neutral.textPrimary },
  bodyMd: { fontSize: fontSize.bodyMd, fontWeight: fontWeight.regular as any, lineHeight: lineHeight.bodyMd, color: colors.neutral.textPrimary },
  bodySm: { fontSize: fontSize.bodySm, fontWeight: fontWeight.regular as any, lineHeight: lineHeight.bodySm, color: colors.neutral.textPrimary },
  caption: { fontSize: fontSize.caption, fontWeight: fontWeight.regular as any, lineHeight: lineHeight.caption, color: colors.neutral.textSecondary },
} as const;

import { Platform } from 'react-native';

export const Colors = {
  light: { text: '#000', background: '#fff' },
  dark: { text: '#fff', background: '#000' },
};
export type ThemeColor = keyof typeof Colors.light;

export const Fonts = {
  mono: 'monospace'
};
