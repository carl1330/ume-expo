export const typography = {
  titleBig: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  titleMedium: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700" as const,
    letterSpacing: 0,
  },
  titleSmall: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
    letterSpacing: 0,
  },
  bodyBig: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: "400" as const,
    letterSpacing: 0,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
