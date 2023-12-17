// import  GroupManager from '.';
import GroupManager from './index.js';         

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'groups/GroupManager',
  component: GroupManager,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Test1 = {
  args: {
    primary: true,
    label: 'Button',
    tournament: null,
    group: 'Ladies Senior'
  },
};

