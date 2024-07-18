/**
 * tailwindcss 动画预设
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeInOut: {
          "0%": { opacity: 1 },
          "50%": { opacity: 0,  },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        fadeInOut: "fadeInOut 1.1s infinite linear forwards",
      },
    },
  },
};
