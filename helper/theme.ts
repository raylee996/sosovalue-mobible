import React from "react";
import { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// export const roboto = Roboto({
//   weight: ['300', '400', '500', '700'],
//   subsets: ['latin'],
//   display: 'swap',
//   fallback: ['Helvetica', 'Arial', 'sans-serif'],
// });

export const getDesignTokens = (mode?: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      main: "#FF4F20",
    },
    // primary: {
    //   ...(mode === 'dark' && {
    //   }),
    // },
    // ...(mode === 'dark' && {
    //   background: {
    //   },
    // }),
    // text: {
    //   ...(mode === 'light'
    //     ? {
    //     }
    //     : {
    //     }),
    // },
  },
  // typography: {
  //   fontFamily: roboto.style.fontFamily,
  // },
});

const theme = createTheme(getDesignTokens("dark"));
export default theme;
