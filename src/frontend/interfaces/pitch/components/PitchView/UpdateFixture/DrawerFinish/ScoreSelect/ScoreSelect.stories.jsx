import ScoreSelect from './';
import styles from './ScoreSelect.module.scss'

export default {
  title: 'pitch/UpdateFixture/DrawerFinish/ScoreSelect',
  component: ScoreSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export const NewScore = {
  args: {
    scores: {
      Team1: { goals: null, points: null },
      Team2: { goals: null, points: null },
    },
    currentTeam: 'Team1',
    updateScore: x => {
      console.log('New Score', x)
    },
  },
};


export const UpdateScore = {
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


// FIXME: high score breaks!!
export const UpdateHighScore = {
  args: {
    scores: {
      Team1: { goals: 13, points: 42 },
      Team2: { goals: 3, points: 12 },
    },
    currentTeam: 'Team1',
    updateScore: x => {
      console.log('New Score', x)
    },
  },
};

