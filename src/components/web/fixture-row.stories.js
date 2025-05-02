import './fixture-row.js';
import './gaelic-score.js'; // For demo purposes
import './team-name.js';    // Assume this exists
import './knockout-level.js'; // Assume this exists

export default {
  title: 'web-comp/FixtureRow',
  component: 'fixture-row',
  argTypes: {
    team1: { control: 'text' },
    team1Goals: { control: 'number' },
    team1Points: { control: 'number' },
    team2: { control: 'text' },
    team2Goals: { control: 'number' },
    team2Points: { control: 'number' },
    outcome: { control: 'text' },
    matchId: { control: 'text' },
    stage: { control: 'text' },
    stageLevel: { control: 'number' },
    category: { control: 'text' },
    debug: { control: 'boolean', description: 'Show debug backgrounds' }, // <-- add this line
  },
};

const Template = ({
  team1, team1Goals, team1Points,
  team2, team2Goals, team2Points,
  outcome, matchId, stage, stageLevel, category,
  child1, child2, debug // <-- add debug here
}) => {
  const el = document.createElement('fixture-row');
  el.setAttribute('team1', team1);
  el.setAttribute('team1-goals', team1Goals);
  el.setAttribute('team1-points', team1Points);
  el.setAttribute('team2', team2);
  el.setAttribute('team2-goals', team2Goals);
  el.setAttribute('team2-points', team2Points);
  el.setAttribute('outcome', outcome);
  el.setAttribute('match-id', matchId);
  el.setAttribute('stage', stage);
  el.setAttribute('stage-level', stageLevel);
  el.setAttribute('category', category);
  if (debug) {
    el.setAttribute('debug', '');
  } else {
    el.removeAttribute('debug');
  }

  if (child1) {
    const c1 = document.createElement('div');
    c1.setAttribute('slot', 'child1');
    c1.textContent = child1;
    el.appendChild(c1);
  }
  if (child2) {
    const c2 = document.createElement('div');
    c2.setAttribute('slot', 'child2');
    c2.textContent = child2;
    el.appendChild(c2);
  }
  return el;
};

export const Default = Template.bind({});
Default.args = {
  team1: 'Foo/roovers/FC',
  team1Goals: 2,
  team1Points: 1,
  team2: 'Bar F.C',
  team2Goals: 3,
  team2Points: 4,
  outcome: 'played',
  matchId: '123',
  stage: 'cup_final',
  stageLevel: 1,
  category: 'Senior',
  child1: 'child1',
  child2: 'child2',
  debug: false, // <-- add default value
};
Default.storyName = 'Default Fixture Row';

export const LongTeamNames = Template.bind({});
LongTeamNames.args = {
  ...Default.args,
  team1: 'The Very Long Name Athletic Club United',
  team2: 'Another Extremely Long Football Club Name',
};
LongTeamNames.storyName = 'Long Team Names';

export const NoChildren = Template.bind({});
NoChildren.args = {
  ...Default.args,
  child1: '',
  child2: '',
};
NoChildren.storyName = 'No Children';

export const CustomChildren = {
  render: () => {
    const el = document.createElement('fixture-row');
    el.setAttribute('team1', 'Alpha');
    el.setAttribute('team1-goals', '1');
    el.setAttribute('team1-points', '2');
    el.setAttribute('team2', 'Beta');
    el.setAttribute('team2-goals', '2');
    el.setAttribute('team2-points', '3');
    el.setAttribute('outcome', 'played');
    el.setAttribute('match-id', '456');
    el.setAttribute('stage', 'shield_semi');
    el.setAttribute('stage-level', '2');
    el.setAttribute('category', 'Junior');

    const badge1 = document.createElement('span');
    badge1.setAttribute('slot', 'child1');
    badge1.textContent = '🏆';
    badge1.style.display = 'block';
    badge1.style.textAlign = 'center';

    const badge2 = document.createElement('span');
    badge2.setAttribute('slot', 'child2');
    badge2.textContent = '⭐';
    badge2.style.display = 'block';
    badge2.style.textAlign = 'center';

    el.appendChild(badge1);
    el.appendChild(badge2);

    return el;
  },
};
CustomChildren.storyName = 'Custom Children (Badges)';
