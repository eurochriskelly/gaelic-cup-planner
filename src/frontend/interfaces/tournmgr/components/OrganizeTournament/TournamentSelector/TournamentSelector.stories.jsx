import React from 'react';
import TournamentSelector from './index.js';


// Mock the fetch function
global.fetch = () => Promise.resolve({
    json: () => Promise.resolve({
      data: [
        { Id: '1', Title: 'Big Tournament' },
        { Id: '2', Title: 'Little Tournament' },
        { Id: '3', Title: 'Another Tournament' },
      ]
    }),
  })

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'groups/TournamentSelector',
  component: TournamentSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const NoTournamentSelected = {
  args: {
    tournamentId: '',
    tournamentTitle: 'Big tourny',
    setTournament: () => console.log('will set it now'),
    fetchFn: () => null,
  },
};

