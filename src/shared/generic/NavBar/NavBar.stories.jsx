import React from 'react';
import PitchView from './';
// import { overrideApis } from '~/src/test/story-data.js';
import '~/src/shared/css/site.css';

// overrideApis()

const NavBar = (props) => {
  return (
    <div id='app'>
      <h1>This is it</h1>
      <PitchView {...props} />
    </div>
  )
}

export default {
  title: 'generic/NavBar',
  component: NavBar,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'iphonex',
    }
  },
  tags: ['autodocs'],
}

export const JustANavBar = {
  args: {
    backToSelection: () => {},
  },
};

