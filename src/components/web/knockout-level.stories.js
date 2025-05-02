import './knockout-level.js';

export default {
  title: 'web-comp/KnockoutLevel',
  component: 'knockout-level',
  argTypes: {
    matchId: {
      control: 'text',
      description: 'Match ID (only last 3 digits displayed)',
    },
    stage: {
      control: 'text',
      description: 'Stage in format round_level (e.g., cup_final)',
    },
    stageLevel: {
      control: 'text',
      description: 'Stage level in format x.y (e.g., 2.1)',
      name: 'stage-level', // Use kebab-case for attribute control
    },
    category: {
      control: 'text',
      description: 'Category (e.g., Mens, Womens) - not used yet',
    },
    // Add group argType, conditional display
    group: {
      control: 'text',
      description: 'Group number (only used when stage is "group")',
      if: { arg: 'stage', eq: 'group' }, // Show only if stage is 'group'
    },
  },
};

// Add 'group' to Template parameters
const Template = ({ matchId, stage, stageLevel, category, group, noId }) => {
  const el = document.createElement('knockout-level');
  if (matchId) el.setAttribute('match-id', matchId);
  if (stage) el.setAttribute('stage', stage);
  if (stageLevel) el.setAttribute('stage-level', stageLevel);
  if (category) el.setAttribute('category', category);
  if (stage === 'group' && group) {
    el.setAttribute('group', group);
  }
  if (noId) {
    el.setAttribute('no-id', '');
  }
  return el;
};

export const Final = Template.bind({});
Final.args = {
  matchId: '120056',
  stage: 'cup_final',
  stageLevel: '1.1',
  category: 'Mens',
};
Final.storyName = 'Final';

export const SemiFinal1 = Template.bind({});
SemiFinal1.args = {
  matchId: '120055',
  stage: 'cup_semis',
  stageLevel: '2.1',
  category: 'Mens',
};
SemiFinal1.storyName = 'Semi-Final 1';

export const SemiFinal2 = Template.bind({});
SemiFinal2.args = {
  matchId: '120054',
  stage: 'cup_semis',
  stageLevel: '2.2',
  category: 'Mens',
};
SemiFinal2.storyName = 'Semi-Final 2';

export const QuarterFinal1 = Template.bind({});
QuarterFinal1.args = {
  matchId: '120053',
  stage: 'cup_quarters',
  stageLevel: '3.1',
  category: 'Mens',
};
QuarterFinal1.storyName = 'Quarter-Final 1';

export const QuarterFinal2 = Template.bind({});
QuarterFinal2.args = {
  matchId: '120052',
  stage: 'cup_quarters',
  stageLevel: '3.2',
  category: 'Mens',
};
QuarterFinal2.storyName = 'Quarter-Final 2';

export const QuarterFinal3 = Template.bind({});
QuarterFinal3.args = {
  matchId: '120051',
  stage: 'cup_quarters',
  stageLevel: '3.3',
  category: 'Mens',
};
QuarterFinal3.storyName = 'Quarter-Final 3';

export const QuarterFinal4 = Template.bind({});
QuarterFinal4.args = {
  matchId: '120050',
  stage: 'cup_quarters',
  stageLevel: '3.4',
  category: 'Mens',
};
QuarterFinal4.storyName = 'Quarter-Final 4';

export const ThirdFourth = Template.bind({});
ThirdFourth.args = {
  matchId: '120049',
  stage: 'cup_3rd4th',
  stageLevel: '2.3',
  category: 'Mens',
};
ThirdFourth.storyName = '3rd/4th Place';

export const FourthFifth = Template.bind({});
FourthFifth.args = {
  matchId: '120048',
  stage: 'cup_4th5th',
  stageLevel: '3.5',
  category: 'Mens',
};
FourthFifth.storyName = '4th/5th Place';

export const FifthSixth = Template.bind({});
FifthSixth.args = {
  matchId: '120047',
  stage: 'cup_5th6th',
  stageLevel: '3.6',
  category: 'Mens',
};
FifthSixth.storyName = '5th/6th Place';

export const SixthSeventh = Template.bind({});
SixthSeventh.args = {
  matchId: '120046',
  stage: 'cup_6th7th',
  stageLevel: '3.7',
  category: 'Mens',
};
SixthSeventh.storyName = '6th/7th Place';

export const SeventhEighth = Template.bind({});
SeventhEighth.args = {
  matchId: '120045',
  stage: 'cup_7th8th',
  stageLevel: '3.8',
  category: 'Mens',
};
SeventhEighth.storyName = '7th/8th Place';

// --- Add Group Stage Stories ---
export const Group1 = Template.bind({});
Group1.args = {
  matchId: '120044',
  stage: 'group', // Set stage to 'group'
  group: '1',     // Specify group number
  category: 'Mens',
  // stageLevel is not relevant for groups
};
Group1.storyName = 'Group 1 (GP1)';

export const Group2 = Template.bind({});
Group2.args = {
  matchId: '120043',
  stage: 'group',
  group: '2',
  category: 'Mens',
};
Group2.storyName = 'Group 2 (GP2)';

export const GroupUnknown = Template.bind({});
GroupUnknown.args = {
  matchId: '120040',
  stage: 'group',
  // No group attribute provided
  category: 'Mens',
};
GroupUnknown.storyName = 'Group ? (Unknown)';
// --- End Group Stage Stories ---

// --- Add New Story for No Fixture ID ---
export const NoId = Template.bind({});
NoId.args = {
  matchId: '120056',
  stage: 'cup_final',
  stageLevel: '1.1',
  category: 'Mens',
  noId: true, // will result in no-id attribute being set
};
NoId.storyName = 'No Fixture ID';

// Add more position match stories
export const EighthNinth = Template.bind({});
EighthNinth.args = {
  matchId: '120044',
  stage: 'cup_8th9th',
  stageLevel: '3.9',
  category: 'Mens',
};
EighthNinth.storyName = '8th/9th Place';

export const NinthTenth = Template.bind({});
NinthTenth.args = {
  matchId: '120043',
  stage: 'cup_9th10th',
  stageLevel: '3.10',
  category: 'Mens',
};
NinthTenth.storyName = '9th/10th Place';

export const TenthEleventh = Template.bind({});
TenthEleventh.args = {
  matchId: '120042',
  stage: 'cup_10th11th',
  stageLevel: '3.11',
  category: 'Mens',
};
TenthEleventh.storyName = '10th/11th Place';

export const FifteenthSixteenth = Template.bind({});
FifteenthSixteenth.args = {
  matchId: '120036',
  stage: 'cup_15th16th',
  stageLevel: '3.16',
  category: 'Mens',
};
FifteenthSixteenth.storyName = '15th/16th Place';

export const NineteenthTwentieth = Template.bind({});
NineteenthTwentieth.args = {
  matchId: '120032',
  stage: 'cup_19th20th',
  stageLevel: '3.20',
  category: 'Mens',
};
NineteenthTwentieth.storyName = '19th/20th Place';

// Update the AllStages story to include the new position matches
export const AllStages = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(4, 1fr)';
    container.style.gap = '20px';
    container.style.padding = '20px';
    container.style.backgroundColor = '#f5f5f5';
    container.style.borderRadius = '8px';

    const stages = [
      { matchId: '120056', stage: 'cup_final', stageLevel: '1.1', category: 'Mens' },
      { matchId: '120055', stage: 'cup_semis', stageLevel: '2.1', category: 'Mens' },
      { matchId: '120054', stage: 'cup_semis', stageLevel: '2.2', category: 'Mens' },
      { matchId: '120053', stage: 'cup_quarters', stageLevel: '3.1', category: 'Mens' },
      { matchId: '120052', stage: 'cup_quarters', stageLevel: '3.2', category: 'Mens' },
      { matchId: '120051', stage: 'cup_quarters', stageLevel: '3.3', category: 'Mens' },
      { matchId: '120050', stage: 'cup_quarters', stageLevel: '3.4', category: 'Mens' },
      { matchId: '120049', stage: 'cup_3rd4th', stageLevel: '2.3', category: 'Mens' },
      { matchId: '120048', stage: 'cup_4th5th', stageLevel: '3.5', category: 'Mens' },
      { matchId: '120047', stage: 'cup_5th6th', stageLevel: '3.6', category: 'Mens' },
      { matchId: '120046', stage: 'cup_6th7th', stageLevel: '3.7', category: 'Mens' },
      { matchId: '120045', stage: 'cup_7th8th', stageLevel: '3.8', category: 'Mens' },
      // Add new position matches
      { matchId: '120044', stage: 'cup_8th9th', stageLevel: '3.9', category: 'Mens' },
      { matchId: '120043', stage: 'cup_9th10th', stageLevel: '3.10', category: 'Mens' },
      { matchId: '120042', stage: 'cup_10th11th', stageLevel: '3.11', category: 'Mens' },
      { matchId: '120041', stage: 'cup_15th16th', stageLevel: '3.16', category: 'Mens' },
      { matchId: '120039', stage: 'cup_19th20th', stageLevel: '3.20', category: 'Mens' },
      // Group stage examples
      { matchId: '120044', stage: 'group', group: '1', category: 'Mens' },
      { matchId: '120043', stage: 'group', group: '2', category: 'Mens' },
      { matchId: '120040', stage: 'group', category: 'Mens' }, // Unknown group
      // Shield final example
      { matchId: '120030', stage: 'shield_final', stageLevel: '1.2', category: 'Mens' },
    ];

    // Refactor to dynamically set attributes based on the data keys
    stages.forEach((attrs) => {
      const el = document.createElement('knockout-level');
      Object.entries(attrs).forEach(([key, value]) => {
        // Convert potential camelCase keys (like stageLevel) to kebab-case attribute names
        const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        // Set attribute only if value is provided
        if (value !== undefined && value !== null) {
          el.setAttribute(attrName, value);
        }
      });
      container.appendChild(el);
    });

    return container;
  },
};
AllStages.storyName = 'All Stages';
