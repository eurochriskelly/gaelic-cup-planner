// src/ui/public/scripts/webcomponents/nav-dropdown.stories.js
import './nav-dropdown.js';

export default {
  title: 'Components/NavDropdown',
  component: 'nav-dropdown',
};

export const Default = () => `
  <nav-dropdown
    title="Menu"
    items='[{"label": "Item 1", "href": "#item1"}, {"label": "Item 2", "href": "#item2"}]'
  ></nav-dropdown>
`;

export const WithHTMX = () => `
  <nav-dropdown
    title="Planning"
    items='[{"label": "Execution", "href": "/execution/1/recent", "hxAttrs": "hx-get=\\"/execution/1/recent\\" hx-target=\\"body\\" hx-swap=\\"outerHTML\\""}]'
  ></nav-dropdown>
`;
