import './KanbanDetailsPanel.scss';
import FixtureBar from '../Fixture/FixtureBar';
import { useFixtureContext } from '../../PitchView/FixturesContext';

const KanbanDetailsPanel = ({ 
  fixture
}) => {
  const { fixtures } = useFixtureContext();
  if (!fixture) return null;

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

  return (
    <div className="kanban-details-panel">
      <FixtureBar
        fixtureId={fixture.id}
        category={displayCategory}
        stage={displayStage}
      />

      <div className="details-content-wrapper">
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
    </div>
  );
};

export default KanbanDetailsPanel;
