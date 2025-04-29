import DialogUpdate from './';
import './DialogUpdate.scss'; // Import component styles
import '../TabScore/TabScore.scss'; // Import child component styles
import '../TabScore/ScoreSelect/ScoreSelect.scss';
import '../TabCancel/TabCancel.scss';
import '../TabCards/TabCards.scss';
import '../TabCards/ListCardedPlayers/ListCardedPlayers.scss';
import '../TabCards/ListCardedPlayers/CardButton/CardButton.scss';

export default {
  title: 'pitch/PitchView/UpdateFixture/DialogUpdate',
  component: DialogUpdate,
  parameters: {
    layout: 'fullscreen', // Use fullscreen layout as it's a dialog/modal
  },
  tags: ['autodocs'],
  argTypes: {
    onClose: { action: 'closed' }, // Log when onClose is called
  },
};

// Sample fixture data based on Fixture.stories.jsx
const sampleFixture = {
  id: 'f123',
  startedTime: new Date().toISOString(),
  scheduledTime: '08:20',
  stage: 'group',
  group: 'Ladies Senior',
  team1: 'Finn Harps Utd.',
  team2: 'The annoying O\'Niells Utd.',
  goals1: null, // Start with no score
  points1: null,
  goals2: null,
  points2: null,
  umpireTeam: 'Andalusian Celts',
  played: false,
};

export const Default = {
  args: {
    fixture: sampleFixture,
    // onClose is handled by argTypes action
  },
};

export const WithInitialScore = {
  args: {
    fixture: {
      ...sampleFixture,
      goals1: 1,
      points1: 2,
      goals2: 0,
      points2: 5,
    },
    // onClose is handled by argTypes action
  },
};
