import FixtureNext from './FixtureNext';
import FixtureFinished from './FixtureFinished';
import FixtureUnplayed from './FixtureUnplayed';

const Fixture = ({ fixture, view = '' }) => {
  let model = null;
  switch (view) {
    case 'unplayed': 
      model = <FixtureUnplayed fixture={fixture} />
      break;
      
    case 'finished':
      model = <FixtureFinished fixture={fixture} />
      break;

    default: 
      model = <FixtureNext fixture={fixture} />
      break
  }
  return model
};


export default Fixture;
