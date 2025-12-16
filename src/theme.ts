import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        neutral: {
          100: { value: "#cccccc" }, // dominant
          200: { value: "#ccccd4" },
        },

        primary: {
          700: { value: "#2c245c" },
          800: { value: "#1c1838" },
          900: { value: "#1c1434" },
        },

        brand: {
          600: { value: "#4c1888" },
          700: { value: "#50182c" },
        },

        danger: {
          500: { value: "#e42c24" },
        },
      },
    },

    semanticTokens: {
      colors: {
        bg: {
          DEFAULT: { value: "{colors.neutral.100}" },
          subtle: { value: "{colors.neutral.200}" },
          dark: { value: "{colors.primary.800}" },
        },

        fg: {
          DEFAULT: { value: "{colors.primary.900}" },
          muted: { value: "{colors.primary.700}" },
          inverted: { value: "#ffffff" },
        },

        accent: {
          DEFAULT: { value: "{colors.brand.600}" },
          emphasis: { value: "{colors.brand.700}" },
        },

        destructive: {
          DEFAULT: { value: "{colors.danger.500}" },
        },

        border: {
          DEFAULT: { value: "{colors.neutral.200}" },
          strong: { value: "{colors.primary.700}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
