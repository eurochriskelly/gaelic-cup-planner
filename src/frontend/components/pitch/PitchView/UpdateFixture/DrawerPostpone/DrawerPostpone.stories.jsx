import DrawerPostpone from './';
import styles from './DrawerPostpone.module.scss'

export default {
  title: 'pitch/UpdateFixture/DrawerPostpone',
  component: DrawerPostpone,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}
export const ReasonDelayed = {
  args: {
    visible: true,
    onClose: () => console.log('closing'),
    delayByOne: () => console.log('dealying by one'),
    delayUntilEnd: (x) => console.log('delay until end', x)
  },
};

