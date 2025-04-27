import { userEvent, within } from '@storybook/testing-library';
import ListCardedPlayers from './';

export default {
  title: 'pitch/PitchView/UpdateFixture/DrawerFinish/ListCardedPlayers',
  component: ListCardedPlayers,
  parameters: {
    layout: 'centered', // Or 'fullscreen' depending on how you want to view it
  },
  tags: ['autodocs'],
  argTypes: {
    team1: { control: 'text' },
    team2: { control: 'text' },
    onProceed: { action: 'proceed' },
    onClose: { action: 'close' },
  },
};

// Default story showing the initial state (asking the question)
export const Default = {
  args: {
    team1: 'Team Alpha',
    team2: 'Team Beta',
    onProceed: (cards) => console.log('Proceeding with cards:', cards),
    onClose: () => console.log('Closing card entry'),
  },
};

// Story where the user has chosen to record cards (shows the table)
// You might need to interact with the component in Storybook to see this state,
// or add internal state management to the story if needed for testing specific scenarios directly.
// For now, this story will render the same as Default initially.
export const RecordingCards = {
    args: {
      ...Default.args,
      // Note: Controlling the internal 'recordCards' state directly from story args isn't straightforward
      // without modifying the component or using Storybook's play function.
      // This story primarily serves as documentation or a starting point for interaction testing.
    },
};

// Story showing the state after clicking "Yes" and adding some cards
export const RecordingCardsWithData = {
  args: {
    ...Default.args,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Simulate clicking 'Yes'
    const yesButton = await canvas.findByRole('button', { name: /yes/i });
    await userEvent.click(yesButton);

    // Wait for the card table to appear
    await canvas.findByRole('table');

    // Find the add card buttons for Team Alpha
    const teamAlphaRow = await canvas.findByText('TEAM ALPHA');
    const teamAlphaButtonsCell = teamAlphaRow.closest('tr').querySelector('td:last-child');
    const teamAlphaButtons = within(teamAlphaButtonsCell).getAllByRole('button'); // R, Y, B
 
    // Simulate adding a Red card for Team Alpha
    await userEvent.click(teamAlphaButtons[0]); // Click Red (+)
 
    // Wait for the sub-tables to appear and find inputs
    const teamAlphaSubTable = await canvas.findByText('TEAM ALPHA').closest('tr').nextElementSibling.querySelector('table');
    const teamAlphaNumberInput = within(teamAlphaSubTable).getByPlaceholderText('#');
    const teamAlphaNameInput = within(teamAlphaSubTable).getByPlaceholderText('player name required'); // Match updated placeholder
 
    // Simulate entering data for Team Alpha's card
    await userEvent.type(teamAlphaNumberInput, '10', { delay: 50 });
    await userEvent.type(teamAlphaNameInput, 'John Doe', { delay: 50 });
  },
};
