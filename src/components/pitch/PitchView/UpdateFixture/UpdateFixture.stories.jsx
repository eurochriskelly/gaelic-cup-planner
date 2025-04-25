import React from 'react'
import UpdateFixture from './';
import './UpdateFixture.scss' // Corrected extension from .css to .scss

const TestUpdateFixture = (props) => {
  return (
    <div className={styles.storybook}>
      <div>fixture goes here</div>
      <UpdateFixture {...props} />
    </div>
  )
}

export default {
  title: 'pitch/Pitch/UpdateFixture',
  component: TestUpdateFixture,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}
const fCommon = {
  id: 'f123',
  startedTime: new Date().toISOString(),
  scheduledTime: '08:20',
  stage: 'group',
  group: 'Ladies Senior',
  team1: 'Finn Harps Utd.',
  team2: 'The annoying O\'Niells Utd.',
  goals1: 10,
  points1: 29,
  goals2: 0,
  points2: 3,
  umpireTeam: 'Andalusian Celts',
}
export const BeforeMatchStarts1 = {
  args: {
    fixture: {
      ...fCommon,
      played: true,
    },
    updateFixtures: () => {},
    startMatch: () => {},
  },
};

