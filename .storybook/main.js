/** @type { import('@storybook/react-webpack5').StorybookConfig } */

// At the top of your file
const path = require('path');

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

    // --- CSS/Tailwind/PostCSS Setup ---
    // Ensure CSS rules process files in src and handle PostCSS correctly
    config.module.rules.push({
      test: /\.css$/,
      use: [
        { loader: 'style-loader' }, // Revert to string
        { loader: 'css-loader', options: { importLoaders: 1 } }, // Revert to string
        {
          loader: 'postcss-loader', // Revert to string
          options: {
            // Use postcss.config.js located at the project root
            postcssOptions: {
              config: path.resolve(__dirname, '../postcss.config.js'),
            },
          },
        },
      ],
      include: path.resolve(__dirname, '../src'), // Target CSS files within src
    });

    // --- SCSS Setup ---
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader', // Revert to string
        'css-loader', // Revert to string
        {
          loader: 'postcss-loader', // Already string
          options: {
            postcssOptions: {
              config: path.resolve(__dirname, '../postcss.config.js'),
            },
          },
        },
        'sass-loader' // Revert to string
      ],
      include: path.resolve(__dirname, '../src'), // Target SCSS files within src
    });

    // Remove default CSS rule if it conflicts (optional, depends on exact Storybook version/setup)
    // This prevents Storybook's default CSS rule from interfering
    // config.module.rules = config.module.rules.filter( // Line removed/commented out as the filter logic is commented
    //    // rule => rule.test?.toString() !== '/\\.css$/i' && rule.test?.toString() !== '/\\.css$/'
    // );


    return config;
  },
};

export default config;
