import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import SelectTournamentView from './';
// import '~/src/shared/css/site.css'; // Removed redundant import (already in preview.js)

const PageTournament = (props) => {
  return (
    <Router>
      <div id='app'>
        <SelectTournamentView {...props}>
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
        </SelectTournamentView>
      </div>
    </Router>
  );
};

export default {
  title: 'groups/SelectTournamentView',
  component: PageTournament,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'iphonex',
    }
  },
  tags: ['autodocs'],
};

export const PickCompetition = {
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
