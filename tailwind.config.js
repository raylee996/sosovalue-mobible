const vars = require("./scripts/vars");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./store/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // 去掉 tailwindcss 默认的颜色配置
    colors: {},
    extend: {
      boxShadow: {
        area: "0px 0px 8px 0px rgba(0, 0, 0, 0.36)",
      },
      screens: {
        xs: "390px",
        lg: "1280px",
        "2xl": "1536px",
        "3xl": "2400px",
      },
      fontFamily: {
        jetbrains: ["var(--font-jetbrains)"],
        inter: ["var(--font-inter)"],
        ddin: ["var(--font-ddin)"],
        lato: ["var(--font-lato)"],
        fjalla: ["var(--font-fjalla)"],
      },
      height: {
        block: "500px",
        "block-min": "500px",
        inherit: "inherit",
      },
      colors: {
        primary: "#FF4F20",
        rise: "#65C466",
        fall: "#EB4E3D",
        "bg-color": "#1A1A1A",
        "block-color": "#0D0D0D",
        title: "#F4F4F4",
        "sub-title": "#C2C2C2",
        content: "#8F8F8F",
        ...vars.tailwind,
      },

      keyframes: {
        up: {
          "0%": { color: "#CCCCCC", opacity: 1, transform: "scale(1)" },
          "50%": { color: "#8DC149", opacity: 0.5, transform: "scale(1.5)" },
          "100%": { color: "#CCCCCC", opacity: 1, transform: "scale(1)" },
        },
        down: {
          "0%": { color: "#CCCCCC", opacity: 1, transform: "scale(1)" },
          "50%": { color: "#CC3E44", opacity: 0.5, transform: "scale(1.5)" },
          "100%": { color: "#CCCCCC", opacity: 1, transform: "scale(1)" },
        },
        fade: {
          "0%": {
            background: "white",
            opacity: "0",
            "z-index": "0",
            inset: "0px",
            position: "absolute",
          },
          "50%": {
            background: "white",
            opacity: "0.2",
            "z-index": "0",
            inset: "0px",
            position: "absolute",
          },
          "100%": {
            background: "white",
            opacity: "0",
            "z-index": "0",
            inset: "0px",
            position: "absolute",
          },
        },
        ripple: {
          "0%": {
            transform: "scale(0)",
            background: "white",
            opacity: "0",
            "z-index": "0",
            inset: "0px",
            position: "absolute",
          },
          "50%": {
            transform: "scale(1)",
            background: "white",
            opacity: "0.2",
            "z-index": "0",
            inset: "0px",
            position: "absolute",
          },
          "100%": {
            transform: "scale(1)",
            background: "white",
            opacity: "0",
            "z-index": "0",
            inset: "0px",
            position: "absolute",
          },
        },
      },
      animation: {
        ripple: "ripple .6s ease-in-out 1",
        fade: "fade .6s ease-in-out 1",
        up: "up 1s ease-in 1 forwards",
        down: "down 1s ease-in 1 forwards",
      },
    },
  },
  presets: [require("./tailwind/presets/animation")],
  corePlugins: {
    preflight: false,
  },
  important: "#__next",
};
