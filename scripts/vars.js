const theme = require('./theme.json')

const createCssVars = () => {
  const vars = { dark: {}, light: {}, tailwind: {} };
  theme.forEach((item, index) => {
    item.color.forEach((i) => {
      const key = i.name
        .split("/")[1]
        .replaceAll(" ", "")
        .replace(/\W+/g, "-")
        .replace(/-$/, "");
      const mode = item.mode.name.toLowerCase().match(/dark|light/i)[0] || "dark";
      vars[mode][key] = i.color;
      if (index === 0) {
        vars.tailwind[key] = `var(--${key})`;
      }
    });
  });
  return vars;
};

module.exports = createCssVars()
