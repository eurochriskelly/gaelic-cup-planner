import chroma from "chroma-js";

const COLOR_LIST = [
  '#A7FFEB', '#FFCCBC', '#FC8762', '#FFC107', '#FFE0B2', '#4CAF50', '#795548', '#FFECB3',
  '#DCEDC8', '#9C27B0', '#3F51B5', '#673AB7', '#FF8A80', '#FF9800', '#E91E63',
  '#F8BBD0', '#C5CAE9', '#F0F4C3', '#8C9EFF', '#00BCD4', '#80D8FF',
  '#EA80FC', '#F44336', '#8BC34A', '#03A9F4', '#D7CCC8', '#BBDEFB', '#E1BEE7',
  '#F5F5F5', '#B2DFDB', '#2196F3', '#B2EBF2', '#D1C4E9', '#FFEB3B', '#FFCDD2', 
  '#212121', '#9E9E9E', '#C8E6C9', '#CDDC39', '#009688',
  '#607D8B'
];

// Utility function to create the participants object
const createParticipants = (teams, colorList) => {
  const participants = {};
  teams.forEach((team, index) => {
    const base = colorList[index % colorList.length] || 'transparent'
    participants[team] = {
      base,
      dark: chroma(base).darken().hex(),
      vdark: chroma(base).darken(2).hex(),
      light: chroma(base).brighten().hex(),
      vlight: chroma(base).brighten(2).hex(),
    }
  });
  return participants;
};

export const participantLookup = (groups) => {
  return createParticipants(
    groups.reduce((p, n) => [...p, ...n], []),
    COLOR_LIST
  )
};
