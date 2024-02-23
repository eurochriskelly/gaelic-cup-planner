import PitchViewHeader from './';
import '~/src/frontend/shared/css/site.scss';

export default {
  title: 'pitch/PitchView/Header',
  component: PitchViewHeader,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'iphonex',
    }
  },
  tags: ['autodocs'],
}
export const HeaderNavigation = {
  args: {
    backToSelection: () => {},
    changeTab: () => console.log('Changing tab')
  },
};

