import { tournaments, user } from './mockData';

export const API = {
  getTournaments: async () => {
    return Promise.resolve([...tournaments]);
  },
  getUser: async () => {
    return Promise.resolve({...user});
  }
};
