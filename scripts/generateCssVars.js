const vars = require('./vars')

const generateCSSVariables = (vars) => {
  let light = '';
  for (const [key, value] of Object.entries(vars['light'])) {
    light += `--${key}: ${value};\n`;
  }

  let dark = ''
  for (const [key, value] of Object.entries(vars['dark'])) {
    dark += `--${key}: ${value};\n`;
  }

  return { light, dark }
}

module.exports = generateCSSVariables(vars)
