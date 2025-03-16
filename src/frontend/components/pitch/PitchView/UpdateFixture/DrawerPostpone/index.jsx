import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Select from 'react-select';
import './DrawerPostpone.scss';

const DrawerPostpone = ({
  onClose,
  onSubmit,
  visible,
  pitch
}) => {
  const { tournamentId } = useParams();
  const [selPitch, setSelPitch] = useState(pitch||'');
  const [selFixture, setSelFixture] = useState(null);
  const [placement, setPlacement] = useState("after");
  const [fixtures, setFixtures] = useState([]);
  const [pitches, setPitches] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // When user opens the drawer, fetch all fixtures data
    fetch(`/api/tournaments/${tournamentId}/pitches`)
      .then((response) => response.json())
      .then((data) => {
        console.log('pitch', data.data)
        setPitches(data.data.map(pitch => pitch.pitch));
      })
      .catch((error) => {
        console.error('Error fetching pitches', error)
      });
    fetch(`/api/tournaments/${tournamentId}/fixtures`)
      .then((response) => response.json())
      .then((data) => { 
        setFixtures(data.data);
      })
      .catch((error) => { console.error("Error fetching data:", error); });
  }, []);

  if (!visible) return null;

  const readyToSubmit = () => selPitch && selFixture && placement;
  const handlePitchChange = ({value}) => setSelPitch(value);
  const handleFixtureChange = ({value}) => {
    setSelFixture(value);
  };
  const tryToSubmit = () => {
    if (!readyToSubmit()) return;
    onSubmit(selFixture, selPitch, placement);
  };
  const handlePlacementChange = (event) => {
    setPlacement(event.target.value);
  };

  const customOptionLabel = ({ data }) => (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
      <span>{`${data.id}: ${data.scheduledTime} ${data.category}/group-${data.groupNumber}`}</span>
      <span>{`${data.team1} vs ${data.team2}`}</span>
    </div>
  );
  return (
    <div className="drawerPostpone">
      <div>
        <div className="drawer-header">Re-schedule match</div>
        <div className="drawer-container">
          <div className="postponeForm">
            {currentStep === 0 && (
              <>
                <div className="drawer-content-row grid grid-flow-col grid-columns-2">
                  <span className="drawer-content-label uppercase">From pitch:</span>
                  <span className="drawer-content-value">
                    <Select
                      options={pitches.map(pitch => ({ value: pitch, label: pitch }))}
                      onChange={handlePitchChange}
                      placeholder="Select pitch"
                      value={pitches
                        .map(p => ({ value: p, label: p }))
                        .find(option => option.value === selPitch) || null
                      }
                    />
                  </span>
                </div>
                <div className="drawer-content-row">
                  <div className="drawer-content-label uppercase">Place:</div>
                  <div className="drawer-content-value radio-section">
                    <div>
                      <input
                        type="radio"
                        name="placement"
                        value="before"
                        checked={placement === "before"}
                        onChange={handlePlacementChange}
                      />
                      <b>Before</b> another match 
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="placement"
                        value="after"
                        checked={placement === "after"}
                        onChange={handlePlacementChange}
                      />
                      <b>After</b> another match
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="placement"
                        value="swap"
                        checked={placement === "swap"}
                        onChange={handlePlacementChange}
                      />
                      <b>Swap with</b> another match 
                    </div>
                  </div>
                </div>
              </>
            )}
            {currentStep === 1 && (
              <>
                <div className="drawer-content-row">
                  <div className="drawer-content-label">{`Moving fixture (${placement}):`}</div>
                  <div className="drawer-content-value">
                    <Select
                      options={fixtures
                        .filter(fixture => fixture.pitch === selPitch)
                        .sort((a, b) => a.scheduledTime - b.scheduledTime)
                        .map(fixture => ({
                          value: fixture.id,
                          label: fixture,
                          data: fixture
                        }))
                      }
                      onChange={handleFixtureChange}
                      placeholder="Select fixture"
                      getOptionLabel={customOptionLabel}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="footer">
            {currentStep === 0 && <>
              <button 
                className="btn btn-primary" 
                onClick={() => setCurrentStep(1)}
                disabled={!placement}
              >
                Next
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                cancel
              </button>
            </>}
            {currentStep === 1 && (
              <>
                <button className="btn btn-secondary" onClick={() => setCurrentStep(0)}>
                  Back
                </button>
                <button
                  className={`btn btn-primary ${readyToSubmit() ? 'enabled' : 'disabled'}`}
                  onClick={tryToSubmit}
                >
                  Apply
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawerPostpone;

function Placement({
  placement,
  handlePlacementChange
}) {
  return (
    <div className="drawer-content-row">
      <div className="drawer-content-label">Placement</div>
      <div className="drawer-content-value radio-section">
        <input
          type="radio"
          name="placement"
          value="before"
          checked={placement === "before"}
          onChange={handlePlacementChange}
        />
        Before
        <input
          type="radio"
          name="placement"
          value="after"
          checked={placement === "after"}
          onChange={handlePlacementChange}
        />
        After
      </div>
    </div>
  )
}
