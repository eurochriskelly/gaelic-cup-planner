import Fixture from '.';

export default {
  title: 'pitch/Pitch/Fixture',
  component: Fixture,
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
export const PlayedMatch = {
  args: {
    fixture: {
      ...fCommon,
      played: true,
    }, 
  },
};


export const UnPlayedMatch = {
  args: {
    fixture: {
      ...fCommon,
      played: false,
    }, 
  },
};
