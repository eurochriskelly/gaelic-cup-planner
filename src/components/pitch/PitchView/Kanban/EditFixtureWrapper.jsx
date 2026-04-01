import { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import API from '../../../../shared/api/endpoints';
import { useFixtureContext } from '../../PitchView/FixturesContext';

const EditFixtureWrapper = ({ fixture, closePanel }) => {
  const { fetchFixtures } = useFixtureContext();
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const [selectedTeam1, setSelectedTeam1] = useState(null);
  const [selectedTeam2, setSelectedTeam2] = useState(null);

  const tournamentId = fixture.tournamentId;

  // Fetch all teams in the tournament
  useEffect(() => {
    let cancelled = false;

    const loadTeams = async () => {
      if (!tournamentId) return;
      setIsLoading(true);
      setErrorMessage(null);

      try {
        // Fetch fixtures to get all teams
        const { data: fixturesData } = await API.fetchAllFixtures(tournamentId);
        
        if (cancelled) return;

        // Extract unique team names from all fixtures
        const teamSet = new Set();
        if (Array.isArray(fixturesData)) {
          fixturesData.forEach(f => {
            if (f.team1 && f.team1 !== 'TBD') teamSet.add(f.team1);
            if (f.team2 && f.team2 !== 'TBD') teamSet.add(f.team2);
          });
        }
        
        const teamList = Array.from(teamSet).sort();
        setTeams(teamList);

        // Set initial selections
        if (fixture.team1) {
          setSelectedTeam1({ value: fixture.team1, label: fixture.team1 });
        }
        if (fixture.team2) {
          setSelectedTeam2({ value: fixture.team2, label: fixture.team2 });
        }
      } catch (error) {
        if (cancelled) return;
        console.error('Error loading teams:', error);
        setErrorMessage('Unable to load team information. Please try again.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadTeams();

    return () => {
      cancelled = true;
    };
  }, [tournamentId, fixture.team1, fixture.team2]);

  // Create select options from teams
  const teamOptions = useMemo(() => {
    return teams.map(team => ({ value: team, label: team }));
  }, [teams]);

  // Check if changes have been made
  const hasChanges = useMemo(() => {
    const currentTeam1 = selectedTeam1?.value;
    const currentTeam2 = selectedTeam2?.value;
    const originalTeam1 = fixture.team1;
    const originalTeam2 = fixture.team2;
    
    return currentTeam1 !== originalTeam1 || currentTeam2 !== originalTeam2;
  }, [selectedTeam1, selectedTeam2, fixture.team1, fixture.team2]);

  // Check if teams are the same (not allowed)
  const teamsAreSame = useMemo(() => {
    return selectedTeam1?.value && selectedTeam2?.value && 
           selectedTeam1.value === selectedTeam2.value;
  }, [selectedTeam1, selectedTeam2]);

  const canSubmit = hasChanges && !teamsAreSame && !isLoading && !isSaving;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    
    setShowConfirmation(true);
  };

  const confirmUpdate = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setShowConfirmation(false);

    try {
      const teamData = {
        team1: selectedTeam1?.value || fixture.team1,
        team2: selectedTeam2?.value || fixture.team2
      };
      
      await API.updateFixtureTeams(tournamentId, fixture.id, teamData);
      await fetchFixtures(true);
      closePanel();
    } catch (error) {
      console.error('Error updating fixture teams:', error);
      setErrorMessage('Could not update teams. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelUpdate = () => {
    setShowConfirmation(false);
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      border: `2px solid ${state.isFocused ? '#64748b' : 'rgba(51, 65, 85, 0.2)'}`,
      borderRadius: '1rem',
      padding: '0.4rem',
      minHeight: '5.6rem',
      background: 'white',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(100, 116, 139, 0.15)' : 'none',
      '&:hover': {
        borderColor: '#64748b'
      }
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 1rem'
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: '1.5rem',
      color: '#94a3b8'
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: '1.6rem',
      color: '#334155',
      fontWeight: '600'
    }),
    input: (provided) => ({
      ...provided,
      fontSize: '1.6rem'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '1rem',
      border: '1px solid rgba(51, 65, 85, 0.15)',
      boxShadow: '0 1rem 2rem rgba(15, 23, 42, 0.15)',
      zIndex: 10000
    }),
    option: (provided, state) => ({
      ...provided,
      padding: '1.2rem 1.4rem',
      fontSize: '1.5rem',
      fontWeight: state.isSelected ? '600' : '400',
      backgroundColor: state.isSelected ? '#64748b' : state.isFocused ? 'rgba(100, 116, 139, 0.08)' : 'white',
      color: state.isSelected ? 'white' : '#334155',
      cursor: 'pointer'
    })
  };

  return (
    <div className="edit-fixture-wrapper">
      <header className="edit-fixture-header">
        <h3>Edit Fixture Teams</h3>
        <p className="subtitle">Select new teams for this fixture</p>
      </header>

      {errorMessage && (
        <div className="edit-fixture-alert" role="alert">
          <span className="alert-icon">⚠️</span>
          {errorMessage}
        </div>
      )}

      <div className="edit-fixture-card">
        {isLoading ? (
          <div className="loading-state">Loading teams...</div>
        ) : (
          <div className="team-selectors">
            <div className="team-selector-group">
              <label className="team-label">
                <span className="team-number">1</span>
                Home Team
              </label>
              <Select
                options={teamOptions}
                value={selectedTeam1}
                onChange={setSelectedTeam1}
                placeholder="Select team..."
                isClearable={false}
                styles={customSelectStyles}
                className="team-select"
                classNamePrefix="team-select"
              />
            </div>

            <div className="versus-divider">
              <span className="vs-text">VS</span>
            </div>

            <div className="team-selector-group">
              <label className="team-label">
                <span className="team-number">2</span>
                Away Team
              </label>
              <Select
                options={teamOptions}
                value={selectedTeam2}
                onChange={setSelectedTeam2}
                placeholder="Select team..."
                isClearable={false}
                styles={customSelectStyles}
                className="team-select"
                classNamePrefix="team-select"
              />
            </div>
          </div>
        )}

        {teamsAreSame && (
          <div className="validation-error">
            <span className="error-icon">🚫</span>
            Teams cannot be the same
          </div>
        )}

        {!isLoading && (
          <div className="current-selection-preview">
            <h4>Current Selection</h4>
            <div className="preview-teams">
              <div className="preview-team">
                <span className="preview-label">Home</span>
                <span className={`preview-value ${selectedTeam1?.value !== fixture.team1 ? 'changed' : ''}`}>
                  {selectedTeam1?.label || fixture.team1 || 'TBD'}
                  {selectedTeam1?.value !== fixture.team1 && <span className="change-indicator">*</span>}
                </span>
              </div>
              <div className="preview-vs">vs</div>
              <div className="preview-team">
                <span className="preview-label">Away</span>
                <span className={`preview-value ${selectedTeam2?.value !== fixture.team2 ? 'changed' : ''}`}>
                  {selectedTeam2?.label || fixture.team2 || 'TBD'}
                  {selectedTeam2?.value !== fixture.team2 && <span className="change-indicator">*</span>}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="edit-fixture-actions">
        <button 
          type="button" 
          className="btn btn-tertiary" 
          onClick={closePanel}
          disabled={isSaving}
        >
          <span className="btn-icon">✕</span>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          <span className="btn-icon">
            {isSaving ? '⏳' : '✓'}
          </span>
          {isSaving ? 'Saving...' : 'Update Teams'}
        </button>
      </div>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <div className="confirmation-icon">⚠️</div>
            <h4>Confirm Team Changes</h4>
            <p>Are you sure you want to update the teams for this fixture?</p>
            <div className="confirmation-teams">
              <div className="team-change">
                <span className="old-team">{fixture.team1 || 'TBD'}</span>
                <span className="arrow">→</span>
                <span className="new-team">{selectedTeam1?.value || fixture.team1 || 'TBD'}</span>
              </div>
              <div className="team-change">
                <span className="old-team">{fixture.team2 || 'TBD'}</span>
                <span className="arrow">→</span>
                <span className="new-team">{selectedTeam2?.value || fixture.team2 || 'TBD'}</span>
              </div>
            </div>
            <div className="confirmation-actions">
              <button type="button" className="btn btn-tertiary" onClick={cancelUpdate}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={confirmUpdate}>
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditFixtureWrapper;
