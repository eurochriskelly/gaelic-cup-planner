import './KanbanDetailsPanel.scss';
import UpdateFixture from '../../PitchView/UpdateFixture';
import FixtureBar from '../Fixture/FixtureBar';     // <-- new
import { useFixtureContext } from '../../PitchView/FixturesContext';

const KanbanDetailsPanel = ({ 
  fixture, 
  onClose 
}) => {
  const { fixtures } = useFixtureContext();
  if (!fixture) return null;

  const moveToNextFixture = async () => {
    const currentFocusIndex = fixtures.findIndex(f => f.id === currentFocusFixtureId);
    let nextUnplayedFixture = null;

    // Search *after* the current index first
    for (let i = currentFocusIndex + 1; i < fixtures.length; i++) {
      if (!fixtures[i].played) {
        nextUnplayedFixture = fixtures[i];
        break;
      }
    }
    // If not found after, search from the beginning up to the current index
    if (!nextUnplayedFixture && currentFocusIndex > 0) { // Check currentFocusIndex > 0
      for (let i = 0; i < currentFocusIndex; i++) {
        if (!fixtures[i].played) {
          nextUnplayedFixture = fixtures[i];
          break;
        }
      }
    }

    if (nextUnplayedFixture) {
      console.log("PitchView: Moving to next unplayed fixture:", nextUnplayedFixture);
      setCurrentFocusFixtureId(nextUnplayedFixture.id);
    } else {
      // Handle case where no *other* unplayed fixture is found
      // Maybe check if the *current* one is still unplayed?
      const currentFixtureStillUnplayed = fixtures[currentFocusIndex] && !fixtures[currentFocusIndex].played;
      if (!currentFixtureStillUnplayed) {
        setCurrentFocusFixtureId(null); // Truly no more unplayed fixtures
        console.log("PitchView: No more unplayed fixtures.");
        // Optionally navigate away or show a message
      } else {
        // Stay on the current fixture if it's the only unplayed one left
        console.log("PitchView: Current fixture is the last unplayed one.");
      }
    }
  };
  const displayCategory = fixture.category
    ? fixture.category.substring(0, 9).toUpperCase()
    : '';
  const displayStage = fixture.stage
    ? fixture.stage.toUpperCase()
      .replace('PLT', 'Plate')
      .replace('CUP', 'Cup')
      .replace('SHD', 'Shield')
      .replace('_', '/')
    : '';

  return <>
    <div className="kanban-details-panel">

      <FixtureBar
        fixtureId={fixture.id}
        category={displayCategory}
        stage={displayStage}
      />

      <div className="details-content-wrapper">   {/* <-- new wrapper */}
        <div className="panel-content">
          <h3>{fixture.team1 || 'TBD'} vs {fixture.team2 || 'TBD'}</h3>
          <p><strong>ID:</strong> {fixture.id}</p>
          <p><strong>Status:</strong> <span className={`status-${fixture.column}`}>{fixture.column}</span></p>
          <p><strong>Planned Start:</strong> {fixture.plannedStart || fixture.startTime}</p>
          <p><strong>Pitch:</strong> {fixture.pitch}</p>
          {fixture.category && <p><strong>Category:</strong> {fixture.category}</p>}
          {fixture.stage && <p><strong>Stage:</strong> {fixture.stage}{fixture.groupNumber ? ` (Group ${fixture.groupNumber})` : ''}</p>}
          {fixture.actualStartedTime && <p><strong>Actual Start:</strong> {fixture.actualStartedTime}</p>}
          {fixture.actualEndedTime && <p><strong>Actual End:</strong> {fixture.actualEndedTime}</p>}
          {(fixture.score1 || fixture.score2) && (
            <p><strong>Score:</strong> {fixture.score1 || '0-00'} - {fixture.score2 || '0-00'}</p>
          )}
          {fixture.outcome && <p><strong>Outcome:</strong> {fixture.outcome}</p>}
        </div>
      </div>

      <div className="update-fixture-container">
        <UpdateFixture fixture={fixture} moveToNextFixture={moveToNextFixture}/>
      </div>
    </div>
  </>;
};

export default KanbanDetailsPanel;
