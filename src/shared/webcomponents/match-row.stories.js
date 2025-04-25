// src/ui/public/scripts/webcomponents/match-row.stories.js
import { createMatchRow } from './match-row.js';

export default {
  title: 'Components/MatchRow',
  component: 'match-row',
};

export const LoggedIn = () => `
  <table style="width: 100%; border-collapse: collapse;">
    <tr style="background-color: #e5e7eb;">
      <th style="padding: 8px; text-align: left;">ID</th>
      <th style="padding: 8px; text-align: left;">Team 1</th>
      <th style="padding: 8px; text-align: left;">Team 2</th>
      <th style="padding: 8px; text-align: left;">Score 1</th>
      <th style="padding: 8px; text-align: left;">Score 2</th>
      <th style="padding: 8px; text-align: left;">Date</th>
      <th style="padding: 8px; text-align: left;">Location</th>
      <th style="padding: 8px; text-align: left;">Edit</th>
      <th style="padding: 8px; text-align: left;">Update Score</th>
    </tr>
    ${createMatchRow({
      id: '1',
      team1: 'Team A',
      team2: 'Team B',
      score1: 2,
      score2: 1,
      date: '2025-04-01',
      location: 'Stadium X',
      isLoggedIn: true
    })}
  </table>
`;

export const LoggedOut = () => `
  <table style="width: 100%; border-collapse: collapse;">
    <tr style="background-color: #e5e7eb;">
      <th style="padding: 8px; text-align: left;">ID</th>
      <th style="padding: 8px; text-align: left;">Team 1</th>
      <th style="padding: 8px; text-align: left;">Team 2</th>
      <th style="padding: 8px; text-align: left;">Score 1</th>
      <th style="padding: 8px; text-align: left;">Score 2</th>
      <th style="padding: 8px; text-align: left;">Date</th>
      <th style="padding: 8px; text-align: left;">Location</th>
    </tr>
    ${createMatchRow({
      id: '1',
      team1: 'Team A',
      team2: 'Team B',
      score1: 2,
      score2: 1,
      date: '2025-04-01',
      location: 'Stadium X',
      isLoggedIn: false
    })}
  </table>
`;
