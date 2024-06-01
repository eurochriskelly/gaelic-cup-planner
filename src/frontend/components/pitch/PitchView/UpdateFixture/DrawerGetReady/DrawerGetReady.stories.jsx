import DrawerGetReady from './';
import styles from './DrawerGetReady.module.scss'

export default {
  title: 'pitch/UpdateFixture/DrawerGetReady',
  component: DrawerGetReady,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}
export const BeforeMatchStarts = {
  args: {
    fixture: {
      id: 2,
    },
    visible: true,
    onClose: () => console.log('closing'),
    startMatch: (id) => console.log('starting the match', id)
  },
};

