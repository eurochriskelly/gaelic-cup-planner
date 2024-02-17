import React from 'react'
import ScoreSelect from './';
import styles from './ScoreSelect.module.scss'

export default {
  title: 'pitch/Pitch/UpdateFixture/ScoreSelect',
  component: ScoreSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}
export const BeforeMatchStarts = {
  args: {
    scores: {
      Team1: { goals: 3, points: 12 },
      Team2: { goals: 3, points: 12 },
    },
    currentTeam: 'Team1',
    updateScore: x => {
      console.log('New Score', x)
    },
  },
};

