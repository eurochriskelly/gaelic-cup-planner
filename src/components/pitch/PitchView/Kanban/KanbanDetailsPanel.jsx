import './KanbanDetailsPanel.scss';
import FixtureBar from '../Fixture/FixtureBar';
import { useFixtureContext } from '../../PitchView/FixturesContext';
import { formatTeamName, militaryTimeDiffMins } from "../../../../shared/generic/TeamNameDisplay";
import ClockIcon from "../../../../shared/generic/ClockIcon";
import UmpiresIcon from "../../../../shared/icons/icon-umpires-circle.svg?react";
import API from '../../../../shared/api/endpoints';
import '../../../../components/web/gaelic-score';
import '../../../../components/web/logo-box';
import '../../../../components/web/team-name';

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

  // Check if all score values are valid 
  const hasScores = fixture.score1 || fixture.score2;
  const hasGoalsPoints = typeof fixture.goals1 === 'number' &&
    typeof fixture.goals2 === 'number' &&
    typeof fixture.points1 === 'number' &&
    typeof fixture.points2 === 'number';

  return (
    <div className="kanban-details-panel">
      <FixtureBar
        fixtureId={fixture.id}
        category={displayCategory}
        stage={displayStage}
        number={fixture.groupNumber || '0'}
      />

      <div className="details-content-wrapper">
        <section className="mt-7 mr-0 pr-0">
          <ClockIcon
            scheduled={fixture.scheduledTime || fixture.plannedStart}
            started={fixture.startedTime || fixture.actualStartedTime}
            delay={militaryTimeDiffMins(fixture.scheduledTime || fixture.plannedStart, fixture.startedTime || fixture.actualStartedTime)}
            played={!!fixture.startedTime || !!fixture.actualStartedTime}
            size={100}
          />

          <div className="p-6 pt-12 ml-12 mr-12 rounded-3xl border-solid border-4" style={{ borderColor: '#FFFFFF00'}}>
            <div className="match-up">
              <div></div>
              <div className="team team-1">
                <logo-box title={fixture.team1 || 'TBD'} size="140px" border-color="#e11d48"></logo-box>
              </div>
              <div className="text-6xl">vs.</div>
              <div className="team team-2">
                <logo-box title={fixture.team2 || 'TBD'} size="140px" border-color="#38bdf8"></logo-box>
              </div>
              <div></div>
            </div>

            <div className="match-teams">
              <div></div>
              <div className="text-3xl" style={{ textAlign: 'center' }}>{formatTeamName(fixture.team1 || 'TBD')}</div>
              <div></div>
              <div className="text-3xl" style={{ textAlign: 'center' }}>{formatTeamName(fixture.team2 || 'TBD')}</div>
              <div></div>
            </div>

            {hasGoalsPoints ? (
              <div className="match-scores">
                <div></div>
                <div className="team-score team1-score">
                  <gaelic-score
                    goals={fixture.goals1}
                    points={fixture.points1}
                    layout="over"
                    scale="2.2"
                    played="true"
                  ></gaelic-score>
                </div>
                <div></div>
                <div className="team-score team2-score">
                  <gaelic-score
                    goals={fixture.goals2}
                    points={fixture.points2}
                    layout="over"
                    scale="2.2"
                    played="true"
                  ></gaelic-score>
                </div>
                <div></div>
              </div>
            ) : hasScores ? (
              <div className="match-scores plain-scores">
                <div></div>
                <div className="team-score">{fixture.score1 || '0-00'}</div>
                <div></div>
                <div className="team-score">{fixture.score2 || '0-00'}</div>
                <div></div>
              </div>
            ) : (
              <div className="fixture-details">
                <div className="details-grid">
                  <div className="detail-item">
                    <strong>Pitch:</strong> {fixture.pitch}
                  </div>
                  {fixture.actualStartedTime && (
                    <div className="detail-item">
                      <strong>Actual Start:</strong> {fixture.actualStartedTime}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {fixture.umpireTeam && (
            <div className="umpires">
              <UmpiresIcon width="82" height="82" />
              <team-name name={fixture.umpireTeam} show-logo="true" direction="r2l" height="35px"></team-name>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default KanbanDetailsPanel;
