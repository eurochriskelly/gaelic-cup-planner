const path = require('path');

module.exports = ({ config }) => {
  // Find the rule that contains a specific test regex for js/jsx files
  const rule = config.module.rules.find(rule =>
  	rule.test && rule.test.toString().includes('js')
  );

  // Modify this rule to include js files
  if (rule) {
    rule.test = /\.(js|jsx)$/;
  }
  config.module.rules.push({
    test: /\.scss$/,
    use: ['style-loader', 'css-loader', 'sass-loader'],
    include: path.resolve(__dirname, '../'),
  })
  
  // Return the altered config
  return config;
};



