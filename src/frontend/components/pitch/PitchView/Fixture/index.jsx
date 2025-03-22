import FixtureNext from './FixtureNext';
import FixtureFinished from './FixtureNext';
import FixtureUnplayed from './FixtureUnplayed';

const Fixture = ({ fixture, isFocus, view = '' }) => {
  let model = <div>no model</div>
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
