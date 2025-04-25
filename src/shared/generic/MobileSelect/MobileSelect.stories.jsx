import React from 'react';
import MobileSelect from './';

const Show = (props) => {
  return (
    <div>
      <MobileSelect {...props}>
        <div>subheading</div>
        <div>section 1</div>
        <div>section 2</div>
        <div>section 3</div>
      </MobileSelect>
    </div>
  )
}

export default {
  title: 'generic/MobileSelect',
  component: Show,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'tablet',
    }
  },
  tags: ['autodocs'],
}

export const JustAMobileSelect = {
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

