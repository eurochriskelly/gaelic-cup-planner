import React from 'react';
import SelectPitch from './';
import { MemoryRouter } from 'react-router-dom';
import styles from './SelectPitch.module.scss'

export default {
  title: 'pitch/SelectPitchView/SelectPitch',
  component: SelectPitch,
  decorators: [(Story) => (<MemoryRouter><Story/></MemoryRouter>)],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}
export const ReasonDelayed = {
  args: {
    pitch: 'Z1',
    type: 'astro',
    location: 'Zuiderpark',
    category: 'Ladies Junior',
    team1: 'Celtic Grovers Utd.',
    team2: 'Westport Wanderers FC',
    scheduledTime: '10:20',
    onChoosePitch: x => console.log('Chosen pitch', x)
  },
};

