// src/ui/public/scripts/webcomponents/tournament-row.stories.js
import { createTournamentRow } from './tournament-row.js';

export default {
  title: 'web-comp/TournamentRow',
  component: 'tournament-row', // Storybook still treats it as a "component" conceptually
};

export const LoggedIn = () => `
  <table style="width: 100%; border-collapse: collapse;">
    <tr style="background-color: #e5e7eb;">
      <th style="padding: 8px; text-align: left;">ID</th>
      <th style="padding: 8px; text-align: left;">Title</th>
      <th style="padding: 8px; text-align: left;">Date</th>
      <th style="padding: 8px; text-align: left;">Location</th>
      <th style="padding: 8px; text-align: left;">Planning</th>
      <th style="padding: 8px; text-align: left;">Execution</th>
      <th style="padding: 8px; text-align: left;">Share</th>
    </tr>
    ${createTournamentRow({
      id: '1',
      title: 'Test Tournament',
      date: '2025-03-31',
      location: 'Test Location',
      eventUuid: 'abc123',
      isLoggedIn: true
    })}
  </table>
`;

export const LoggedOut = () => `
  <table style="width: 100%; border-collapse: collapse;">
    <tr style="background-color: #e5e7eb;">
      <th style="padding: 8px; text-align: left;">ID</th>
      <th style="padding: 8px; text-align: left;">Title</th>
      <th style="padding: 8px; text-align: left;">Date</th>
      <th style="padding: 8px; text-align: left;">Location</th>
    </tr>
    ${createTournamentRow({
      id: '1',
      title: 'Test Tournament',
      date: '2025-03-31',
      location: 'Test Location',
      isLoggedIn: false
    })}
  </table>
`;
