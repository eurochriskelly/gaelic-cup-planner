<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fixture Kanban Board</title>
    <script src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.22.9/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-200">
    <div id="root" class="container mx-auto p-4 h-screen flex flex-col"></div>
    <script type="text/babel">
        const initialData = [
            { id: 1, column: 'finished', plannedStart: '12:00', team1: 'Team A', team2: 'Team B', score1: '1-03 (06)', score2: '0-01 (01)', pitch: 'Pitch 1', stage: 'group', groupNumber: 1, actualStartedTime: '12:03', actualEndedTime: '12:28', outcome: 'played' },
            { id: 2, column: 'planned', plannedStart: '12:30', team1: 'Team C', team2: 'Team D', score1: null, score2: null, pitch: 'Pitch 2', stage: 'group', groupNumber: 2, actualStartedTime: null, actualEndedTime: null, outcome: 'pending' },
            { id: 3, column: 'started', plannedStart: '13:00', team1: 'Team E', team2: 'Team F', score1: '0-00 (00)', score2: '0-00 (00)', pitch: 'Pitch 1', stage: 'group', groupNumber: 1, actualStartedTime: '13:02', actualEndedTime: null, outcome: 'in-progress' },
            { id: 4, column: 'planned', plannedStart: '13:30', team1: 'Team G', team2: 'Team H', score1: null, score2: null, pitch: 'Pitch 3', stage: 'group', groupNumber: 3, actualStartedTime: null, actualEndedTime: null, outcome: 'pending' },
            { id: 5, column: 'finished', plannedStart: '14:00', team1: 'Team I', team2: 'Team J', score1: '2-02 (08)', score2: '1-01 (04)', pitch: 'Pitch 2', stage: 'group', groupNumber: 2, actualStartedTime: '14:05', actualEndedTime: '14:35', outcome: 'played' },
            { id: 6, column: 'started', plannedStart: '14:30', team1: 'Team K', team2: 'Team L', score1: '0-01 (01)', score2: '0-00 (00)', pitch: 'Pitch 1', stage: 'group', groupNumber: 1, actualStartedTime: '14:32', actualEndedTime: null, outcome: 'in-progress' },
            { id: 7, column: 'planned', plannedStart: '15:00', team1: 'Team M', team2: 'Team N', score1: null, score2: null, pitch: 'Pitch 4', stage: 'group', groupNumber: 4, actualStartedTime: null, actualEndedTime: null, outcome: 'pending' },
            { id: 8, column: 'finished', plannedStart: '15:30', team1: 'Team O', team2: 'Team P', score1: '3-00 (09)', score2: '0-02 (02)', pitch: 'Pitch 3', stage: 'group', groupNumber: 3, actualStartedTime: '15:33', actualEndedTime: '16:00', outcome: 'played' },
            { id: 9, column: 'planned', plannedStart: '16:00', team1: 'Team Q', team2: 'Team R', score1: null, score2: null, pitch: 'Pitch 2', stage: 'group', groupNumber: 2, actualStartedTime: null, actualEndedTime: null, outcome: 'pending' },
            { id: 10, column: 'started', plannedStart: '16:30', team1: 'Team S', team2: 'Team T', score1: '1-01 (04)', score2: '1-00 (03)', pitch: 'Pitch 1', stage: 'group', groupNumber: 1, actualStartedTime: '16:34', actualEndedTime: null, outcome: 'in-progress' },
            { id: 11, column: 'planned', plannedStart: '17:00', team1: 'Team U', team2: 'Team V', score1: null, score2: null, pitch: 'Pitch 4', stage: 'group', groupNumber: 4, actualStartedTime: null, actualEndedTime: null, outcome: 'pending' },
            { id: 12, column: 'finished', plannedStart: '17:30', team1: 'Team W', team2: 'Team X', score1: '2-01 (07)', score2: '1-02 (05)', pitch: 'Pitch 3', stage: 'group', groupNumber: 3, actualStartedTime: '17:32', actualEndedTime: '18:00', outcome: 'played' },
            { id: 13, column: 'planned', plannedStart: '18:00', team1: 'Team Y', team2: 'Team Z', score1: null, score2: null, pitch: 'Pitch 2', stage: 'group', groupNumber: 2, actualStartedTime: null, actualEndedTime: null, outcome: 'pending' }
        ];

        const KanbanBoard = () => {
            const [fixtures, setFixtures] = React.useState(initialData);
            const [selectedFixture, setSelectedFixture] = React.useState(null);
            const [errorMessage, setErrorMessage] = React.useState(null);
            const [selectedPitch, setSelectedPitch] = React.useState('All Pitches');
            const [selectedTeam, setSelectedTeam] = React.useState('All Teams');

            // Pastel color mapping for pitches
            const pitchColors = {
                'Pitch 1': '#B3CDE0', // Pastel Blue
                'Pitch 2': '#C1E1C1', // Pastel Green
                'Pitch 3': '#F4C2C2', // Pastel Pink
                'Pitch 4': '#FFE5B4', // Pastel Yellow
            };

            const getPitchColor = (pitch) => pitchColors[pitch] || '#E6E6E6'; // Default Pastel Gray

            // Unique pitches and teams for dropdowns
            const pitches = ['All Pitches', ...new Set(fixtures.map(fixture => fixture.pitch))];
            const teams = ['All Teams', ...new Set(fixtures.flatMap(fixture => [fixture.team1, fixture.team2]))];

            // Filter fixtures based on selected pitch and team
            const filteredFixtures = fixtures.filter(fixture => {
                const pitchMatch = selectedPitch === 'All Pitches' || fixture.pitch === selectedPitch;
                const teamMatch = selectedTeam === 'All Teams' || fixture.team1 === selectedTeam || fixture.team2 === selectedTeam;
                return pitchMatch && teamMatch;
            });

            // Show error message for 3 seconds
            const showError = (message) => {
                setErrorMessage(message);
                setTimeout(() => setErrorMessage(null), 3000);
            };

            const onDragStart = (e, fixtureId) => {
                e.dataTransfer.setData('fixtureId', fixtureId);
            };

            const onDrop = (e, targetColumn) => {
                e.preventDefault();
                const fixtureId = parseInt(e.dataTransfer.getData('fixtureId'));
                const fixture = fixtures.find(f => f.id === fixtureId);

                // Check if moving to 'started' and another match is already started on the same pitch
                if (targetColumn === 'started') {
                    const hasStartedMatch = fixtures.some(
                        f => f.column === 'started' && f.pitch === fixture.pitch && f.id !== fixtureId
                    );
                    if (hasStartedMatch) {
                        showError("Can't start 2 matches on one pitch");
                        return;
                    }
                }

                // Check if moving from 'started' to 'finished' without a score
                if (targetColumn === 'finished' && fixture.column === 'started') {
                    if (fixture.score1 === null || fixture.score2 === null) {
                        showError("Cannot finish match without a score");
                        return;
                    }
                }

                // Check if moving from 'started' to 'planned' with a score
                if (targetColumn === 'planned' && fixture.column === 'started') {
                    if (fixture.score1 !== null && fixture.score2 !== null) {
                        showError("Cannot move a scored match back to planned");
                        return;
                    }
                }

                setFixtures(fixtures.map(f =>
                    f.id === fixtureId ? { ...f, column: targetColumn } : f
                ));
            };

            const onDragOver = (e) => {
                e.preventDefault();
            };

            const handleFixtureClick = (fixture) => {
                if (selectedFixture && selectedFixture.id === fixture.id) {
                    setSelectedFixture(null); // Deselect if clicking the same fixture
                } else {
                    setSelectedFixture(fixture); // Select the clicked fixture
                }
            };

            const handlePitchChange = (e) => {
                setSelectedPitch(e.target.value);
                setSelectedFixture(null); // Clear selected fixture when changing pitch filter
            };

            const handleTeamChange = (e) => {
                setSelectedTeam(e.target.value);
                setSelectedFixture(null); // Clear selected fixture when changing team filter
            };

            const columns = ['planned', 'started', 'finished'];

            return (
                <div className="relative h-full flex flex-col">
                    {/* Error Message Toast */}
                    {errorMessage && (
                        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-30">
                            {errorMessage}
                        </div>
                    )}
                    {/* Filter Dropdowns */}
                    <div className="mb-4 flex space-x-4">
                        <div>
                            <label htmlFor="pitchFilter" className="mr-2 text-lg font-semibold">Filter by Pitch:</label>
                            <select
                                id="pitchFilter"
                                value={selectedPitch}
                                onChange={handlePitchChange}
                                className="p-2 rounded-lg border border-gray-300"
                            >
                                {pitches.map(pitch => (
                                    <option key={pitch} value={pitch}>{pitch}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="teamFilter" className="mr-2 text-lg font-semibold">Filter by Team:</label>
                            <select
                                id="teamFilter"
                                value={selectedTeam}
                                onChange={handleTeamChange}
                                className="p-2 rounded-lg border border-gray-300"
                            >
                                {teams.map(team => (
                                    <option key={team} value={team}>{team}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Kanban Board - Full height when no fixture selected */}
                    <div className={`p-4 h-full ${selectedFixture ? 'pb-[400px]' : ''}`}>
                        <div className="flex justify-around gap-4 h-full">
                            {columns.map(column => (
                                <div
                                    key={column}
                                    className="w-1/3 bg-white p-4 rounded-lg shadow flex flex-col h-full"
                                    onDrop={(e) => onDrop(e, column)}
                                    onDragOver={onDragOver}
                                >
                                    <h2 className="text-xl font-bold mb-4 capitalize text-center sticky top-0 bg-white z-10">{column}</h2>
                                    <div className="flex-1 overflow-y-auto">
                                        {filteredFixtures
                                            .filter(fixture => fixture.column === column)
                                            .map(fixture => (
                                                <div
                                                    key={fixture.id}
                                                    draggable
                                                    onDragStart={(e) => onDragStart(e, fixture.id)}
                                                    onClick={() => handleFixtureClick(fixture)}
                                                    className={`p-3 mb-2 rounded shadow cursor-move hover:opacity-90 ${
                                                        selectedFixture && selectedFixture.id === fixture.id
                                                            ? 'border-2 border-blue-500 bg-blue-100'
                                                            : ''
                                                    }`}
                                                    style={{ backgroundColor: getPitchColor(fixture.pitch) }}
                                                >
                                                    <h3 className="font-semibold">{fixture.team1} vs {fixture.team2}</h3>
                                                    <p className="text-sm text-gray-600">Time: {fixture.plannedStart}</p>
                                                    <p className="text-sm text-gray-600">Pitch: {fixture.pitch}</p>
                                                    {fixture.score1 && fixture.score2 && (
                                                        <p className="text-sm text-gray-600">Score: {fixture.score1} - {fixture.score2}</p>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Details Panel - Fixed at bottom when a fixture is selected */}
                    {selectedFixture && (
                        <div className="fixed bottom-0 left-0 right-0 h-[400px] bg-white p-4 rounded-t-lg shadow-lg overflow-y-auto z-20">
                            <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white z-10">Fixture Details</h2>
                            <div>
                                <h3 className="text-lg font-semibold">{selectedFixture.team1} vs {selectedFixture.team2}</h3>
                                <p className="text-sm text-gray-600">Planned Start: {selectedFixture.plannedStart}</p>
                                <p className="text-sm text-gray-600">Pitch: {selectedFixture.pitch}</p>
                                <p className="text-sm text-gray-600">Stage: {selectedFixture.stage}</p>
                                <p className="text-sm text-gray-600">Group: {selectedFixture.groupNumber}</p>
                                <p className="text-sm text-gray-600">Status: {selectedFixture.column}</p>
                                <p className="text-sm text-gray-600">Outcome: {selectedFixture.outcome}</p>
                                {selectedFixture.score1 && selectedFixture.score2 && (
                                    <p className="text-sm text-gray-600">Score: {selectedFixture.score1} - {selectedFixture.score2}</p>
                                )}
                                {selectedFixture.actualStartedTime && (
                                    <p className="text-sm text-gray-600">Actual Start: {selectedFixture.actualStartedTime}</p>
                                )}
                                {selectedFixture.actualEndedTime && (
                                    <p className="text-sm text-gray-600">Actual End: {selectedFixture.actualEndedTime}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<KanbanBoard />);
    </script>
</body>
</html>