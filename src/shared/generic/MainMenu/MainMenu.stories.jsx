import React from 'react';
import MainMenu from './';

const Show = (props) => {
  const sections = [
    {
      name: 'Groups',
      title: 'Live Status',
      link: 'tournaments/7/groups',
    },
    {
      name: 'Pitches',
      title: 'Field coordinator',
      link: 'tournaments/7/pitches',
    }
  ]
  return (
    <div style={{
      position: 'fixed',
      top: 0, height: '3rem', left: 0,
      width: '100%', background: 'black',
    }}>
      <MainMenu sections={sections} selected={1} />
    </div>
  )
}

export default {
  title: 'generic/MainMenu',
  component: Show,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'tablet',
    }
  },
  tags: ['autodocs'],
}

export const TestMainMenu = {
  args: {},
};

