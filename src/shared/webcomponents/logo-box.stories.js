// stories/LogoBox.stories.js

import './logo-box.js'; // Adjust the import path to where your component is defined

export default {
  title: 'Components/LogoBox', // The title in Storybook's sidebar
  component: 'logo-box', // The custom element tag name
  argTypes: {
    title: {
      control: 'text',
      description: 'The full title to extract initials from',
    },
    index: {
      control: { type: 'range', min: 0, max: 19, step: 1 },
      description: 'Color scheme index (0-19)',
    },
    size: {
      control: 'text',
      description: 'Size of the square (e.g., "40px")',
    },
    image: {
      control: 'text',
      description: 'URL to an image (optional)',
    },
    borderColor: {
      control: 'color',
      description: 'Custom border color',
      table: {
        category: 'Customization',
      },
    },
  },
};

// Template function to render the component with argsn
const Template = ({ title, index, size, image, borderColor }) => {
  const element = document.createElement('logo-box');
  element.setAttribute('title', title);
  if (index !== undefined) element.setAttribute('index', index.toString());
  if (size) element.setAttribute('size', size);
  if (image) element.setAttribute('image', image);
  if (borderColor) element.setAttribute('border-color', borderColor);
  return element;
};

// Default story
export const Default = Template.bind({});
Default.args = {
  title: 'Wolverhampton United F.C.',
  index: 1,
  size: '40px',
  image: '',
};
Default.storyName = 'Basic Usage';

// Variations
export const WithNumbers = Template.bind({});
WithNumbers.args = {
  title: 'Under-18 Eagles',
  index: 2,
  size: '50px',
  image: '',
};
WithNumbers.storyName = 'With Numbers';

export const SmallSize = Template.bind({});
SmallSize.args = {
  title: 'Manchester City',
  index: 3,
  size: '20px',
  image: '',
};
SmallSize.storyName = 'Small Size';

export const WithImage = Template.bind({});
WithImage.args = {
  title: 'Team 1',
  index: 5,
  size: '40px',
  image: 'https://via.placeholder.com/40', // Using a placeholder image
};
WithImage.storyName = 'With Image';

export const HighIndex = Template.bind({});
HighIndex.args = {
  title: 'Chelsea FC',
  index: 25, // Will cycle back to index 5
  size: '40px',
  image: '',
};
HighIndex.storyName = 'High Index (Cycles)';

export const SpecialTeam = Template.bind({});
SpecialTeam.args = {
  title: '~Match / P1',
  size: '40px',
  image: '',
};
SpecialTeam.storyName = 'Special Team (Starts with ~)';

export const CustomBorder = Template.bind({});
CustomBorder.args = {
  title: 'Team With Custom Border',
  size: '40px',
  borderColor: '#ff0000',
  image: '',
};
CustomBorder.storyName = 'Custom Border Color';
