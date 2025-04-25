/** @type { import('@storybook/react').Preview } */
import '~/src/shared/css/site.css'; // Use the alias and point to your global CSS

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
