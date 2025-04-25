import React from 'react';
import MobileLayout from './';

const Show = (props) => {
  return (
    <div>
      <MobileLayout {...props}>
        <div>foo bing 1</div>
        <div>bar 2</div>
        <div>baz 3</div>
      </MobileLayout>
    </div>
  )
}

export default {
  title: 'generic/MobileLayout',
  component: Show,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'tablet',
    }
  },
  tags: ['autodocs'],
}

export const JustAMobileLayout = {
  args: {
    backToSelection: () => {},
    sections: [
      {
        title: 'Live competition status',
        name: 'Competitions',
        action: () => {
          console.log('foo fah')
        }
      },
      {
        title: 'Field coordination',
        name: 'Pitches',
        action: () => {
          console.log('fee faw')
        }
      }
    ]
  },
};

