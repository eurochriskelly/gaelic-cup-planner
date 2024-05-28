import React from 'react';
import MobileInterface from './';

const Show = (props) => {
  return (
    <div>
      <MobileInterface {...props}>
        <div>
          <div>BBB foo</div> 
          <div>CCC baz</div> 
          <div>DDD bar</div> 
        </div>
        <div>
          <div>a</div>
          <div>b</div>
          <div>c</div>
          <div>d</div>
          <div>e</div>
        </div>
      </MobileInterface>
    </div>
  )
}

export default {
  title: 'layout/MobileInterface',
  component: Show,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'tablet',
    }
  },
  tags: ['autodocs'],
}

export const JustAMobileInterface = {
  args: {
    topTitle: 'Select competition',
    tabNames: ['foo', 'bar', 'baz'],
    viewType: 'Competition',
    cardInfo: [
      {
        name: 'LGFA_JNR'
      } 
    ],
    sections: [
      {
        title: 'live competition status',
        name: 'competitions',
        action: () => {
          console.log('foo fah')
        }
      },
      {
        title: 'field coordination',
        name: 'pitches',
        action: () => {
          console.log('fee faw')
        }
      }
    ]
  },
};

