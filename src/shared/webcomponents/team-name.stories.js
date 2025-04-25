import './team-name.js';
import './logo-box.js';

export default {
    title: 'Components/TeamName',
    component: 'team-name',
    argTypes: {
        name: { control: 'text', description: 'Team name, can include slashes' },
        showLogo: { control: 'boolean', description: 'Whether to show the logo' },
        height: { control: 'text', description: 'Height of the logo and component (e.g., "30px")' },
        direction: {
            control: { type: 'radio' },
            options: ['l2r', 'r2l'],
            description: 'Direction of layout: left-to-right or right-to-left',
        },
        completion: {
            control: { type: 'number', min: 1, max: 3, step: 1 },
            description: 'Spacing level (1-3)',
        },
        maxchars: {
            control: { type: 'number' },
            description: 'Max characters before truncation',
        },
        width: {
            control: { type: 'text' },
            description: 'Strict width (e.g. "200px") that will be enforced',
        }
    },
};

const Template = ({ name, showLogo, height, width }) => {
    const element = document.createElement('team-name');
    element.setAttribute('name', name);
    element.setAttribute('showLogo', showLogo.toString());
    if (height) element.setAttribute('height', height);
    if (width) element.setAttribute('width', width);
    return element;
};

const MultiTemplate = ({ teams }) => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    container.style.width = '300px';
    teams.forEach(({ name, showLogo, height, direction, completion, maxchars, width }) => { // Added width here
        const element = document.createElement('team-name');
        element.setAttribute('name', name);
        element.setAttribute('showLogo', showLogo.toString());
        if (height) element.setAttribute('height', height);
        if (direction) element.setAttribute('direction', direction);
        if (completion) element.setAttribute('completion', completion);
        if (maxchars) element.setAttribute('maxchars', maxchars);
        if (width) element.setAttribute('width', width);
        container.appendChild(element);
    });
    return container;
};

export const Default = Template.bind({});
Default.args = { name: 'Wolverhampton Wanderers F.C.', showLogo: true, height: '30px' };
Default.storyName = 'Default with Logo';

export const NoLogo = Template.bind({});
NoLogo.args = { name: 'Manchester United', showLogo: false, height: '30px' };
NoLogo.storyName = 'Without Logo';

export const WithSlash = Template.bind({});
WithSlash.args = { name: 'Foo/Bar United', showLogo: true, height: '40px' };
WithSlash.storyName = 'With Slash';

export const MultipleTeamsOrder1 = MultiTemplate.bind({});
MultipleTeamsOrder1.args = {
    teams: [
        { name: 'Wolverhampton Wanderers F.C.', showLogo: true, height: '30px', maxchars: '20' },
        { name: 'Manchester United', showLogo: true, height: '30px', completion: 2 },
        { name: 'Chelsea/London F.C.', showLogo: true, height: '30px', maxchars: '15', completion: 3 },
        { name: 'Arsenal F.C.', showLogo: true, height: '30px' },
        { name: 'Arsenal F.C.', direction: 'r2l', showLogo: true, height: '30px', completion: 2 },
        { name: 'Foo/Bar United', showLogo: true, height: '30px', maxchars: '10', direction: 'r2l', completion: 3 },
    ],
};
MultipleTeamsOrder1.storyName = 'Multiple Teams (Order 1)';

export const MultipleTeamsOrder2 = MultiTemplate.bind({});
MultipleTeamsOrder2.args = {
    teams: [
        { name: 'Foo/Bar United', showLogo: true, height: '30px' },
        { name: 'Arsenal F.C.', showLogo: true, height: '30px' },
        { name: 'Chelsea/London F.C.', showLogo: true, height: '30px' },
        { name: 'Manchester United', showLogo: true, height: '30px' },
        { name: 'Wolverhampton Wanderers F.C.', showLogo: true, height: '30px' },
    ],
};
MultipleTeamsOrder2.storyName = 'Multiple Teams (Order 2 - Shuffled)';

export const SpacingDebug = MultiTemplate.bind({});
SpacingDebug.args = {
    teams: [
        { name: 'Team 1', showLogo: true, height: '30px', completion: 1 },
        { name: 'Team 2', showLogo: true, height: '30px', completion: 2 },
        { name: 'Team 3', showLogo: true, height: '30px', completion: 3 },
        { name: 'Team 4', showLogo: true, height: '30px', direction: 'r2l', completion: 1 },
        { name: 'Team 5', showLogo: true, height: '30px', direction: 'r2l', completion: 2 },
        { name: 'Team 6', showLogo: true, height: '30px', direction: 'r2l', completion: 3 },
    ],
};
SpacingDebug.storyName = 'Spacing Debug (Visible Spacers)';

export const EdgeCases = MultiTemplate.bind({});
EdgeCases.args = {
    teams: [
        { name: 'Very Long Team Name That Should Be Truncated', showLogo: true, height: '30px', completion: 3, maxchars: 20 },
        { name: 'Short', showLogo: true, height: '30px', completion: 3 },
        { name: 'Team With/Slash', showLogo: true, height: '30px', completion: 2 },
        { name: 'No Logo Team', showLogo: false, height: '30px', completion: 3 },
    ],
};
EdgeCases.storyName = 'Edge Cases with Completion';

export const StrictWidth = MultiTemplate.bind({});
StrictWidth.args = {
    teams: [
        { name: 'Normal Width Team', showLogo: true, height: '30px', width: '200px' },
        { name: 'Very Long Team Name That Should Overflow', showLogo: true, height: '30px', width: '150px' },
        { name: 'Narrow With Logo', showLogo: true, height: '30px', width: '100px' },
        { name: 'Narrow No Logo', showLogo: false, height: '30px', width: '50px' },
    ],
};
StrictWidth.storyName = 'Strict Width Enforcement';

export const NameMaxWidthDemo = MultiTemplate.bind({});
NameMaxWidthDemo.args = {
    teams: [
        { name: 'This Is A Very Very Long Team Name That Absolutely Must Be Truncated By The Name Container', showLogo: true, height: '30px', completion: 1 },
        { name: 'Another Excessively Long Team Name For The Right-To-Left Layout Example', showLogo: true, height: '30px', direction: 'r2l', completion: 1 },
        { name: 'Long Name No Logo Example That Also Needs Truncation', showLogo: false, height: '30px', completion: 1 },
        { name: 'Short Name', showLogo: true, height: '30px', completion: 1 },
        { name: 'Long Name With Wider Component Width', showLogo: true, height: '30px', width: '400px', completion: 1 }, // Component wider, name still capped at 200px
    ],
};
NameMaxWidthDemo.storyName = 'Name Container Max Width (200px)';

export const SpecialNames = MultiTemplate.bind({});
SpecialNames.args = {
    teams: [
        { name: '~group:1/p:1', showLogo: true, height: '30px' }, // 1st Gp.1
        { name: '~group:2/p:2', showLogo: true, height: '30px' }, // 2nd Gp.2
        { name: '~group:3/p:3', showLogo: true, height: '30px' }, // 3rd Gp.3
        { name: '~group:4/p:4', showLogo: true, height: '30px' }, // 4th Gp.4
        { name: '~group:11/p:5', showLogo: true, height: '30px' }, // 5th Gp.11
        { name: '~match:123/p:1', showLogo: true, height: '30px' }, // Winner #123
        { name: '~match:456/p:2', showLogo: true, height: '30px' }, // Loser #456
        { name: '~match:007/p:1', showLogo: true, height: '30px' }, // Winner #007
        { name: '~invalid:format', showLogo: true, height: '30px' }, // Should display raw
        { name: '~group:1/p:10', showLogo: true, height: '30px' }, // Invalid M, should display raw
        { name: '~match:123/p:3', showLogo: true, height: '30px' }, // Invalid M, should display raw
        { name: '~match:120056/p:1', showLogo: true, height: '30px' }, // Winner #056 (Truncated)
    ],
};
SpecialNames.storyName = 'Special Tilde (~) Names';
