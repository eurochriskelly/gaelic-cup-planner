import DrawerFinish from './';

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

export const CardPlayers = {
  args: {
    fixture: {
      id: 2,
    },
    visible: true,
    initialStep: 1,
    updateFixtures: () => {},
    onConfirm: () => {},
  },
}

