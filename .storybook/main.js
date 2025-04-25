/** @type { import('@storybook/react-webpack5').StorybookConfig } */

// At the top of your file
const path = require('path');
const webpack = require('webpack'); // Import webpack

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-actions",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-viewport",
    "@storybook/addon-postcss", // Add the official PostCSS addon
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    // --- Alias Setup ---
    config.resolve.alias = {
      ...config.resolve.alias, // Preserve existing aliases
      '~': path.resolve(__dirname, '../'), // Add '~' alias
    };

    // Remove manual CSS rule - let @storybook/addon-postcss handle it
    // config.module.rules.push({
    //   test: /\.css$/,
    //   use: [
    //     { loader: 'style-loader' },
    //     { loader: 'css-loader', options: { importLoaders: 1 } },
    //   ],
    //   include: path.resolve(__dirname, '../src'),
    // });

    // Re-add manual SCSS rule to ensure sass-loader is used.
    // @storybook/addon-postcss should still process the output CSS.
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader', // Inject styles into DOM
        'css-loader',   // Translates CSS into CommonJS
        'sass-loader'   // Compiles Sass to CSS
      ],
      include: path.resolve(__dirname, '../src'), // Target SCSS files within src
    });

    // Remove default CSS rule filtering if it exists (it's commented out anyway)
    //     'style-loader',
    //     'css-loader',
    //     'sass-loader'
    //   ],
    //   include: path.resolve(__dirname, '../src'),
    // });

    // Remove default CSS rule filtering if it exists (it's commented out anyway)
    // This prevents Storybook's default CSS rule from interfering
    // config.module.rules = config.module.rules.filter( // Line removed/commented out as the filter logic is commented
    //    // rule => rule.test?.toString() !== '/\\.css$/i' && rule.test?.toString() !== '/\\.css$/'
    // ); // End of SCSS rule push

    // Add ProvidePlugin to make React globally available in Storybook modules
    // This helps components that rely on Vite's jsxInject and don't explicitly import React.
    config.plugins.push(
      new webpack.ProvidePlugin({
        React: 'react',
      })
    );

    return config;
  },
};

export default config;
