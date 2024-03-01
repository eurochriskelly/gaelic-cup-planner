import React from 'react';
import PitchView from './';
import { overrideApis } from '~/src/frontend/shared/test/story-data.js';
import '~/src/frontend/shared/css/site.scss';

overrideApis()

const Page = (props) => {
  return (
    <div id='app'>
      <h1>Mock Coordinator</h1>
      <PitchView {...props} />
    </div>
  )
}

export default {
  title: 'pitch/PitchView',
  component: Page,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'iphonex',
    }
  },
  tags: ['autodocs'],
}
export const BigView = {
  args: {
    backToSelection: () => {},
  },
};

