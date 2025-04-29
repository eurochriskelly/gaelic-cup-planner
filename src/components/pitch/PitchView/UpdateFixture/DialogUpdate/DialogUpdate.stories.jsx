import DialogUpdate from '../';
// Removed explicit SCSS imports - Storybook should handle these via webpack config

export default {
  title: 'Pitch/PitchView/UpdateFixture/DialogUpdate', // Adjusted title for better grouping
  component: DialogUpdate,
  parameters: {
    // layout: 'fullscreen', // Let's try centered first, like Fixture.stories
    layout: 'centered',
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
