import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    textStyles: {
      pageTitle: {
        value: {
          fontSize: "2xl",
          fontWeight: "semibold",
          letterSpacing: "-0.01em",
        },
      },
      pageSubtitle: {
        value: {
          fontSize: "sm",
          color: "fg.muted",
        },
      },
    },
    layerStyles: {
      pageHeader: {
        value: {
          bg: "bg.surface",
          borderBottomWidth: "1px",
          borderColor: "border.default",
          px: 6,
          py: 4,
        },
      },
      actionBar: {
        value: {
          gap: 2,
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
