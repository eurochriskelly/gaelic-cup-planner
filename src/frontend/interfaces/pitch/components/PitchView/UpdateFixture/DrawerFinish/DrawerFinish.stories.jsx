import DrawerFinish from './';
import styles from './DrawerFinish.module.scss'

export default {
  title: 'pitch/UpdateFixture/DrawerFinish',
  component: DrawerFinish,
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
    updateFixtures: () => {},
    onConfirm: () => {},
  },
};

