const path = require('path');

module.exports = ({ config, addons }) => {
  const tildaPath = path.resolve(__dirname, '../');
  config.resolve.alias['~'] = tildaPath;

  if (!config.module) config.module = { rules: [] };

  const jsRule = config.module.rules.find(rule =>
    rule.test && rule.test.toString() === '/\\.(js|jsx)$/'
  );
  if (jsRule) {
    jsRule.test = /\.(js|jsx)$/;
  } else {
    // Consider adding a new rule for js/jsx if not found
  }

  config.module.rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    include: path.resolve(__dirname, '../'),
  });

  const existingOptions = config.options || {};
  return config
};
