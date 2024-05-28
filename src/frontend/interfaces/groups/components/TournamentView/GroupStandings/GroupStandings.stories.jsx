import React, { useEffect, useState } from 'react';
import GroupStandings from './';
import { overrideApis } from '~/src/frontend/shared/test/story-data.js';
import '~/src/frontend/shared/css/site.css';

overrideApis()

const Page = (props) => {
  const [standings, setStandings] = useState([])
  useEffect(() => {
    const getStandings = async () => {
      const data = await fetch('/api/fixtures/5/standings')
      setStandings(await fetch('/api/fixutres/5/standings'))
    }
    getStandings()
  }, [])
  return (
    <div id='app'>
      <h1>Mock Standings</h1>
      <GroupStandings standing={standings} />
    </div>
  )
}

export default {
  title: 'groups/GroupStandings',
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
  },
};

