/** @type {import('tailwindcss').Config} */
const { colors } = require("./src/theme/colors");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lingua: {
          purple: colors.primary.purple,
          deepPurple: colors.primary.deepPurple,
          blue: colors.primary.blue,
          green: colors.primary.green,
        },
        semantic: {
          success: colors.semantic.success,
          warning: colors.semantic.warning,
          streak: colors.semantic.streak,
          error: colors.semantic.error,
          info: colors.semantic.info,
        },
        surface: colors.neutral.surface,
        border: colors.neutral.border,
        "text-primary": colors.neutral.textPrimary,
        "text-secondary": colors.neutral.textSecondary,
        "bg-primary": colors.neutral.background,
      },
      fontFamily: {
        "poppins-regular": ["Poppins_400Regular", "sans-serif"],
        "poppins-medium": ["Poppins_500Medium", "sans-serif"],
        "poppins-semibold": ["Poppins_600SemiBold", "sans-serif"],
        "poppins-bold": ["Poppins_700Bold", "sans-serif"],
      },
    },
  },
  plugins: [],
}
