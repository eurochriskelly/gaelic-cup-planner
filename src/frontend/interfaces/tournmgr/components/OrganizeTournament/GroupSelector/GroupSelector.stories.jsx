// import  GroupManager from '.';
import GroupSelector from './index.js';         
import { action } from '@storybook/addon-actions';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'groups/GroupSelector',
  component: GroupSelector,
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
    selectedGroup: 'Ladies Senior',
    tournamentId: 2,
    setGroup: () => console.log('setgroup') || action('setGroup'),
  },
};

