import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../../../shared/api/endpoints.js'; // Assuming API calls will be needed

// Palette of colors for pitches
const PITCH_PALETTE = [
  '#FFDFD3', '#D3FFD3', '#D3D3FF', '#FFFFD3', '#FFD3FF',
  '#D3FFFF', '#E8D3FF', '#FFEBD3', '#D3FFE8', '#FFD3E8',
  '#FADADD', '#FDFD96', '#CDFADF', '#BDECB6', '#C9EBFD',
  '#D7C9FD', '#FDC9D7', '#FDEAC9', '#C9FDEE', '#E6E6FA'
];

// Helper to determine Kanban column based on fixture status
const getKanbanColumn = (fixture) => {
  if (fixture.played || fixture.actualEndedTime) {
    return 'finished';
  }
  if (fixture.actualStartedTime && !fixture.actualEndedTime) {
    return 'started';
  }
  return 'planned';
};

export const useKanbanBoard = (initialFixtures, fetchFixturesCallback, startMatchCallback) => {
  const { tournamentId } = useParams();
  const [boardFixtures, setBoardFixtures] = useState([]);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedPitch, setSelectedPitch] = useState('All Pitches');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [pitchColorMapping, setPitchColorMapping] = useState({});
  const [maximizedColumnKey, setMaximizedColumnKey] = useState(null); // null, 'planned', 'started', 'finished'

  const toggleMaximizeColumn = useCallback((key) => {
    setMaximizedColumnKey(prevKey => (prevKey === key ? null : key));
  }, []);

  useEffect(() => {
    // Dynamically create color mapping for pitches
    const uniquePitches = [...new Set(initialFixtures.map(f => f.pitch).filter(Boolean))].sort();
    const newMapping = {};
    uniquePitches.forEach((pitch, index) => {
      newMapping[pitch] = PITCH_PALETTE[index % PITCH_PALETTE.length];
    });
    setPitchColorMapping(newMapping);

    // Process fixtures for board display
    const processedFixtures = initialFixtures.map(f => ({
      ...f,
      column: getKanbanColumn(f), // Ensure column is determined based on fixture status
    }));
    setBoardFixtures(processedFixtures);
  }, [initialFixtures]);

  const getPitchColor = useCallback((pitch) => {
    return pitchColorMapping[pitch] || '#E6E6E6'; // Default to Pastel Gray if pitch not in mapping
  }, [pitchColorMapping]);

  const pitches = ['All Pitches', ...new Set(boardFixtures.map(fixture => fixture.pitch))];
  const teams = ['All Teams', ...new Set(boardFixtures.flatMap(fixture => [fixture.team1, fixture.team2].filter(Boolean)))];

  const filteredFixtures = boardFixtures.filter(fixture => {
    const pitchMatch = selectedPitch === 'All Pitches' || fixture.pitch === selectedPitch;
    const teamMatch = selectedTeam === 'All Teams' || fixture.team1 === selectedTeam || fixture.team2 === selectedTeam;
    return pitchMatch && teamMatch;
  });

  const showError = useCallback((message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  }, []);

  const onDragStart = (e, fixtureId) => {
    e.dataTransfer.setData('fixtureId', fixtureId.toString());
  };

  const onDrop = async (e, targetColumn) => {
    e.preventDefault();
    const fixtureId = parseInt(e.dataTransfer.getData('fixtureId'), 10);
    const fixtureToMove = boardFixtures.find(f => f.id === fixtureId);

    if (!fixtureToMove) return;

    // Validations from concept.jsx
    if (targetColumn === 'started') {
      const hasStartedMatchOnPitch = boardFixtures.some(
        f => f.column === 'started' && f.pitch === fixtureToMove.pitch && f.id !== fixtureId
      );
      if (hasStartedMatchOnPitch) {
        showError("Can't start 2 matches on one pitch at the same time.");
        return;
      }
      // Call API to start match
      try {
        await startMatchCallback(fixtureId); // Uses the startMatch from PitchView.hooks
        // fetchFixturesCallback will be called by startMatchCallback internally
      } catch (error) {
        showError(`Failed to start match: ${error.message}`);
        return;
      }
    }

    if (targetColumn === 'finished' && fixtureToMove.column === 'started') {
      // In a real app, score might be on fixture or need to be checked/entered.
      // For now, assume if it's being moved to finished, it's okay.
      // Add score check if fixture data includes it:
      // if (fixtureToMove.score1 === null || fixtureToMove.score2 === null) {
      //   showError("Cannot finish match without a score");
      //   return;
      // }
      // TODO: API call to mark as finished if not handled by score update
      console.log(`Fixture ${fixtureId} moved to finished. Implement API call if needed.`);
    }

    if (targetColumn === 'planned' && fixtureToMove.column === 'started') {
      // Add score check if fixture data includes it:
      // if (fixtureToMove.score1 !== null || fixtureToMove.score2 !== null) {
      //   showError("Cannot move a scored match back to planned");
      //   return;
      // }
      // TODO: API call to un-start or move to planned
      console.log(`Fixture ${fixtureId} moved to planned from started. Implement API call if needed.`);
    }
    
    // Optimistic update for UI, real data comes from fetchFixturesCallback
    setBoardFixtures(prevFixtures =>
      prevFixtures.map(f =>
        f.id === fixtureId ? { ...f, column: targetColumn } : f
      )
    );
    // If not handled by specific actions like startMatch, call generic refresh
    if (targetColumn !== 'started') { // startMatch already calls fetchFixtures
        await fetchFixturesCallback();
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const handleFixtureClick = (fixture) => {
    setSelectedFixture(prevSelected => (prevSelected && prevSelected.id === fixture.id ? null : fixture));
  };

  const handlePitchChange = (e) => {
    setSelectedPitch(e.target.value);
    setSelectedFixture(null);
  };

  const handleTeamChange = (e) => {
    setSelectedTeam(e.target.value);
    setSelectedFixture(null);
  };

  const columns = ['planned', 'started', 'finished'];

  return {
    filteredFixtures,
    selectedFixture,
    setSelectedFixture, // Expose setter
    errorMessage,
    selectedPitch,
    selectedTeam,
    pitches,
    teams,
    columns,
    getPitchColor,
    onDragStart,
    onDrop,
    onDragOver,
    handleFixtureClick,
    handlePitchChange,
    handleTeamChange,
    showError,
    maximizedColumnKey,
    toggleMaximizeColumn,
  };
};
