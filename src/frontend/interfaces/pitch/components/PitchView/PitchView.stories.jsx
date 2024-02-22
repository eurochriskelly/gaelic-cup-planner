import React from 'react';

import PitchView from './';
import '~/src/frontend/shared/css/site.scss';

const PhoneHolder = (props) => {
  const phoneStyle = {
    left :'0',
    top: '0',
    width: '800px',
    height: '1200px',
    position: 'absolute',
    border: '4px dotted red',
  }
  return (
    <div style={phoneStyle}>
        <PitchView {...props} />
    </div>
  )
}
export default {
  title: 'pitch/PitchView',
  component: PhoneHolder,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}
export const ReasonDelayed = {
  args: {
    backToSelection: () => {},
  },
};

