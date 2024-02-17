import React from 'react';
import TournamentLayout from './index.js';

const TLWithChildren = (props) => {
  return (
    <TournamentLayout {...props}>
      <div>foo</div>
    </TournamentLayout>
  )
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'groups/TournamentLayout',
  component: TLWithChildren,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Layout = {
  args: {
    group: 'Ladies Senior',
    tournament: {
      id: 2,
      Title: 'Big tournament',
      groups: [
        'g1',
        'g2'
      ]
    },
    setGroup: () => console.log('setgroup'),
  },
};

