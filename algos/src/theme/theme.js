import { extendTheme } from "@chakra-ui/react";

export const colors = {
  primary: "#7caee1",    // Light blue
  secondary: "#9ec0f8",  // Light blue variant
  darkBlue: "#18416b",   // Dark blue (for primary actions)
  lightGreen: "#acbca4", // Light green (for success messages or highlights)
  pink: "#d4a4ac",       // Pink (for warnings or accent)
  darkGray: "#272c3c",   // Dark gray (for text or backgrounds)
  lightGray: "#f7f7f7",  // Light gray (for light theme backgrounds)
  white: "#ffffff",      // Pure white (for light theme)
  black: "#000000",      // Pure black (for dark theme)
  mediumGray: "#a0a0a0", // Medium gray (for neutral elements)
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  colors,
  config,
  styles: {
    global: {
      body: {
        bg: { light: "lightGray", dark: "darkGray" },
        color: { light: "darkGray", dark: "white" },
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        borderRadius: "full",
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === "dark" ? "darkBlue" : "primary",
          color: props.colorMode === "dark" ? "white" : "darkGray",
          _hover: {
            bg: props.colorMode === "dark" ? "lightGreen" : "secondary",
          },
        }),
      },
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: "full",
          _focus: {
            borderColor: "darkBlue",
            boxShadow: "0 0 0 1px darkBlue",
          },
        },
      },
    },
  },
  fonts: {
    // heading: 'helvetica, sans-serif',
    // body: 'helvetica, sans-serif',
    heading: 'helvetica',
    body: 'helvetica',
  },
});

export default theme;
