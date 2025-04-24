import PitchView from './';
import { overrideApis } from '~/src/shared/test/story-data.js';
import '~/src/shared/css/site.scss';

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

