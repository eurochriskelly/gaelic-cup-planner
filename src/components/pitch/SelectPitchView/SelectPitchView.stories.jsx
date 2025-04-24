import React from 'react';
import SelectPitchView from './';
import { MemoryRouter } from 'react-router-dom';
import "./SelectPitchView.scss";

export default {
  title: 'pitch/SelectPitchView',
  component: SelectPitchView,
  decorators: [(Story) => (<MemoryRouter><Story/></MemoryRouter>)],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}
export const AllPitches = {
  args: {
  },
};

