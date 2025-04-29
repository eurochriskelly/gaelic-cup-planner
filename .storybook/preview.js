/** @type { import('@storybook/react').Preview } */
/** @type { import('@storybook/react').Preview } */
import '~/src/shared/css/site.css'; // Use the alias and point to your global CSS
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'; // Import predefined viewports

const preview = {
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS, // Use predefined viewports like 'iphone6', 'pixelxl', etc.
      // You could also define custom viewports here:
      // viewports: {
      //   smallMobile: {
      //     name: 'Small Mobile',
      //     styles: { width: '360px', height: '640px' },
      //     type: 'mobile',
      //   },
      //   largeMobile: {
      //     name: 'Large Mobile',
      //     styles: { width: '414px', height: '896px' },
      //     type: 'mobile',
      //   },
      //   ...INITIAL_VIEWPORTS, // Include defaults if needed
      // },
    },
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
