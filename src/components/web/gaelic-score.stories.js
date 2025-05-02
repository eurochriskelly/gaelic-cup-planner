import './gaelic-score.js';

export default {
  title: 'web-comp/GaelicScore',
  component: 'gaelic-score',
  argTypes: {
    goals: {
      control: { type: 'number', min: 0 },
      description: 'Number of goals (each worth 3 points)',
    },
    points: {
      control: { type: 'number', min: 0 },
      description: 'Number of points',
    },
    layout: {
      control: 'text',
      description: 'Layout format (currently only "default")',
    },
    scale: {
      control: { type: 'number', min: 0.5, max: 3, step: 0.1 },
      description: 'Scaling factor for font size',
    },
    goalsagainst: {
      control: { type: 'number', min: 0 },
      description: 'Number of goals the opponent scored',
    },
    pointsagainst: {
      control: { type: 'number', min: 0 },
      description: 'Number of points the opponent scored',
    },
  },
};

const Template = ({ goals, points, layout, scale, goalsagainst, pointsagainst }) => {
  const el = document.createElement('gaelic-score');
  el.setAttribute('goals', goals.toString());
  el.setAttribute('points', points.toString());
  if (layout) el.setAttribute('layout', layout);
  if (scale) el.setAttribute('scale', scale.toString());
  if (goalsagainst != null) el.setAttribute('goalsagainst', goalsagainst.toString());
  if (pointsagainst != null) el.setAttribute('pointsagainst', pointsagainst.toString());
  return el;
};

export const Default = Template.bind({});
Default.args = {
  goals: 2,
  points: 4,
  layout: 'default',
};
Default.storyName = 'Default Layout';

export const RightToLeft = Template.bind({});
RightToLeft.args = {
  goals: 1,
  points: 7,
  layout: 'r2l',
};
RightToLeft.storyName = 'Right to Left Layout';
export const OverLayout = Template.bind({});
OverLayout.args = {
  goals: 3,
  points: 5,
  layout: 'over',
};
OverLayout.storyName = 'Over Layout';
export const Scaled = Template.bind({});
Scaled.args = {
  goals: 1,
  points: 2,
  layout: 'over',
  scale: 2,
};
Scaled.storyName = 'Scaled Over Layout';
export const ComparePositive = Template.bind({});
ComparePositive.args = {
  goals: 3,
  points: 4,
  goalsagainst: 2,
  pointsagainst: 3,
  layout: 'compare',
};
ComparePositive.storyName = 'Compare – Winning';

export const CompareNegative = Template.bind({});
CompareNegative.args = {
  goals: 1,
  points: 2,
  goalsagainst: 3,
  pointsagainst: 6,
  layout: 'compare',
};
CompareNegative.storyName = 'Compare – Losing';

export const CompareDraw = Template.bind({});
CompareDraw.args = {
  goals: 2,
  points: 3,
  goalsagainst: 1,
  pointsagainst: 6,
  layout: 'compare',
};
CompareDraw.storyName = 'Compare – Draw';

export const CompareRTL = Template.bind({});
CompareRTL.args = {
  goals: 4,
  points: 1,
  goalsagainst: 3,
  pointsagainst: 5,
  layout: 'compare-rtl',
};
CompareRTL.storyName = 'Compare RTL';

export const UnplayedScenarios = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(3, 1fr)';
    container.style.gap = '20px';
    container.style.padding = '20px';
    container.style.backgroundColor = '#f5f5f5';
    container.style.borderRadius = '8px';

    // Walkover scenarios
    const walkoverWinner = document.createElement('gaelic-score');
    walkoverWinner.setAttribute('goals', '0');
    walkoverWinner.setAttribute('points', '1');
    walkoverWinner.setAttribute('goalsagainst', '0');
    walkoverWinner.setAttribute('pointsagainst', '0');
    walkoverWinner.setAttribute('played', 'false');
    walkoverWinner.setAttribute('layout', 'compare');
    container.appendChild(walkoverWinner);

    const walkoverLoser = document.createElement('gaelic-score');
    walkoverLoser.setAttribute('goals', '0');
    walkoverLoser.setAttribute('points', '0');
    walkoverLoser.setAttribute('goalsagainst', '0');
    walkoverLoser.setAttribute('pointsagainst', '1');
    walkoverLoser.setAttribute('played', 'false');
    walkoverLoser.setAttribute('layout', 'compare');
    container.appendChild(walkoverLoser);

    // SCR scenarios
    const scrWinner = document.createElement('gaelic-score');
    scrWinner.setAttribute('goals', '0');
    scrWinner.setAttribute('points', '1');
    scrWinner.setAttribute('goalsagainst', '0');
    scrWinner.setAttribute('pointsagainst', '0');
    scrWinner.setAttribute('played', 'false');
    scrWinner.setAttribute('layout', 'compare');
    container.appendChild(scrWinner);

    const scrLoser = document.createElement('gaelic-score');
    scrLoser.setAttribute('goals', '0');
    scrLoser.setAttribute('points', '0');
    scrLoser.setAttribute('goalsagainst', '0');
    scrLoser.setAttribute('pointsagainst', '1');
    scrLoser.setAttribute('played', 'false');
    scrLoser.setAttribute('layout', 'compare');
    container.appendChild(scrLoser);

    // Share scenarios
    const share1 = document.createElement('gaelic-score');
    share1.setAttribute('goals', '0');
    share1.setAttribute('points', '0');
    share1.setAttribute('goalsagainst', '0');
    share1.setAttribute('pointsagainst', '0');
    share1.setAttribute('played', 'false');
    share1.setAttribute('layout', 'compare');
    container.appendChild(share1);

    const share2 = document.createElement('gaelic-score');
    share2.setAttribute('goals', '0');
    share2.setAttribute('points', '0');
    share2.setAttribute('goalsagainst', '0');
    share2.setAttribute('pointsagainst', '0');
    share2.setAttribute('played', 'false');
    share2.setAttribute('layout', 'compare');
    container.appendChild(share2);

    return container;
  },
};
UnplayedScenarios.storyName = 'Unplayed Scenarios';

export const UnplayedLayouts = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(3, 1fr)';
    container.style.gap = '20px';
    container.style.padding = '20px';
    container.style.backgroundColor = '#f5f5f5';
    container.style.borderRadius = '8px';

    // Show different layouts for unplayed matches
    const defaultLayout = document.createElement('gaelic-score');
    defaultLayout.setAttribute('goals', '0');
    defaultLayout.setAttribute('points', '0');
    defaultLayout.setAttribute('goalsagainst', '0');
    defaultLayout.setAttribute('pointsagainst', '0');
    defaultLayout.setAttribute('played', 'false');
    container.appendChild(defaultLayout);

    const overLayout = document.createElement('gaelic-score');
    overLayout.setAttribute('goals', '0');
    overLayout.setAttribute('points', '0');
    overLayout.setAttribute('goalsagainst', '0');
    overLayout.setAttribute('pointsagainst', '0');
    overLayout.setAttribute('played', 'false');
    overLayout.setAttribute('layout', 'over');
    container.appendChild(overLayout);

    const rtlLayout = document.createElement('gaelic-score');
    rtlLayout.setAttribute('goals', '0');
    rtlLayout.setAttribute('points', '0');
    rtlLayout.setAttribute('goalsagainst', '0');
    rtlLayout.setAttribute('pointsagainst', '0');
    rtlLayout.setAttribute('played', 'false');
    rtlLayout.setAttribute('layout', 'r2l');
    container.appendChild(rtlLayout);

    return container;
  },
};
UnplayedLayouts.storyName = 'Unplayed Layouts';

export const TransparencyMatrix = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(6, 1fr)';
    container.style.gap = '10px';
    container.style.padding = '20px';
    container.style.backgroundColor = '#f5f5f5';
    container.style.borderRadius = '8px';

    // Create positive difference matrix (0 to +50 in 5 steps)
    for (let diff = 0; diff <= 50; diff += 5) {
      const el = document.createElement('gaelic-score');
      el.setAttribute('goals', '3');
      el.setAttribute('points', '4');
      el.setAttribute('goalsagainst', '3');
      el.setAttribute('pointsagainst', (4 - diff).toString());
      el.setAttribute('layout', 'compare');
      container.appendChild(el);
    }

    // Create negative difference matrix (0 to -50 in 5 steps)
    for (let diff = 0; diff <= 50; diff += 5) {
      const el = document.createElement('gaelic-score');
      el.setAttribute('goals', '3');
      el.setAttribute('points', '4');
      el.setAttribute('goalsagainst', '3');
      el.setAttribute('pointsagainst', (4 + diff).toString());
      el.setAttribute('layout', 'compare');
      container.appendChild(el);
    }

    return container;
  },
};
TransparencyMatrix.storyName = 'Transparency Matrix';
