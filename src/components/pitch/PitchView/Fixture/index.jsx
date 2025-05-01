import { useFixtureContext } from '../FixturesContext';
import FixtureNext from './FixtureNext';
import FixtureFinished from './FixtureFinished';
import FixtureUnplayed from './FixtureUnplayed';

const Fixture = ({ view = '' }) => {
  const { nextFixture } = useFixtureContext();
  let model = <div>no model</div>
  switch (view) {
    case 'unplayed': 
      model = <FixtureUnplayed fixture={nextFixture} />
      break;
      
    case 'finished':
      model = <FixtureFinished fixture={nextFixture} />
      break;

    default: 
      model = <FixtureNext fixture={nextFixture} />
      break
  }
  return model
};


export default Fixture;
