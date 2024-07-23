import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: {
          base: "white", // Default background color
          _dark: "charcoal.900", // Background color for dark mode
        },
      },
    },
  },
  colors: {
    charcoal: {
      900: "#333333", // Charcoal color
    },
  },
});

export default theme;