import './cup-icon.js';

export default {
  title: 'web-comp/CupIcon',
  component: 'cup-icon',
  argTypes: {
    icon: {
      control: 'text',
      description: 'Icon type (e.g., "cup" or "shd")',
    },
  },
};

const Template = ({ icon }) => {
  const el = document.createElement('cup-icon');
  if (icon) el.setAttribute('icon', icon);
  return el;
};

export const Default = Template.bind({});
Default.args = { icon: 'cup' };
Default.storyName = 'Default Cup Icon';

export const Shield = Template.bind({});
Shield.args = { icon: 'shd' };
Shield.storyName = 'Shield Icon';
