import FixtureNext from './FixtureNext';
import FixtureFinished from './FixtureFinished';
import FixtureUnplayed from './FixtureUnplayed';

const Fixture = ({ fixture, onUpdate, view = '' }) => {
  let model = null;
  switch (view) {
    case 'unplayed': 
      model = <FixtureUnplayed fixture={fixture} />
      break;
      
    case 'finished':
      model = <FixtureFinished fixture={fixture} onUpdateScore={onUpdate} />
      break;

    default: 
      model = <FixtureNext fixture={fixture} />
      break
  }
  return model
};


export default Fixture;
