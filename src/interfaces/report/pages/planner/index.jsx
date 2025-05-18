import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ImportFixturesDialog from './dialogs/import-fixtures';
import { TOURNAMENT_CONFIG } from './consts';

export default PlannerPage; 

function PlannerNavbar() {
    const navigate = useNavigate();
    
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/')} 
                    className="text-sm font-medium hover:text-gray-300"
                >
                    Home
                </button>
                <span className="text-gray-500">/</span>
                <span className="text-sm">Tournament Planner</span>
            </div>
            <div className="flex gap-4">
                <button className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Save Changes
                </button>
                <button 
                    onClick={() => navigate('/')}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                >
                    Exit
                </button>
            </div>
        </nav>
    );
}

function TeamName({ name, maxChars = 25, iconOnly, showLogo }) {
    const displayName = maxChars ? name.substring(0, maxChars) : name;
    return (
        <span className="inline-flex items-center">
            {iconOnly ? (
                showLogo && <span className="w-6 h-6 bg-gray-200 rounded-full mr-2"></span>
            ) : displayName}
        </span>
    );
}

function MatchScore({ score, points, isWinner }) {
    return (
        <div className="text-center">
            <span className={isWinner ? 'font-bold' : ''}>
                {score}<br/>
                <span className="text-sm">({points})</span>
            </span>
        </div>
    );
}

function MatchesTable({ matches, type }) {
    return (
        <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">
                {type === 'upcoming' ? `UPCOMING GAMES (${matches.length})` : `FINISHED GAMES (${matches.length})`}
            </h3>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-3">ID</th>
                        <th className="text-left p-3">CATEGORY</th>
                        <th className="text-left p-3">STAGE</th>
                        {type === 'upcoming' && (
                            <>
                                <th className="text-left p-3">PITCH</th>
                                <th className="text-left p-3">TIME</th>
                            </>
                        )}
                        <th className="text-left p-3">TEAM 1</th>
                        {type === 'finished' ? (
                            <>
                                <th className="text-center p-3">SCORE</th>
                                <th className="text-center p-3">SCORE</th>
                            </>
                        ) : null}
                        <th className="text-left p-3">TEAM 2</th>
                        {type === 'upcoming' && <th className="text-left p-3">UMPIRE</th>}
                    </tr>
                </thead>
                <tbody>
                    {matches.map((match) => (
                        <tr 
                            key={match.id}
                            className={`transition-colors ${
                                match.category === 'Ladies' ? '' : 'hidden'
                            }`}
                            data-category={match.category}
                        >
                            <td className="p-3 bg-gray-600 text-white">{match.id}</td>
                            <td>
                                <span className={`
                                    px-3 py-1 rounded-full text-white text-sm font-bold
                                    ${match.category === 'Ladies' ? 'bg-pink-400' : 'bg-purple-400'}
                                `}>
                                    {match.category}
                                </span>
                            </td>
                            <td><knockout-level stage={match.stage} category={match.category} group={match.group}></knockout-level></td>
                            {type === 'upcoming' ? (
                                <>
                                    <td>
                                        <span className="bg-green-200 px-3 py-1 rounded-full text-sm font-bold">
                                            {match.pitch}
                                        </span>
                                    </td>
                                    <td>{match.time}</td>
                                    <td><TeamName name={match.team1} /></td>
                                    <td><TeamName name={match.team2} /></td>
                                    <td><TeamName name={match.umpire} iconOnly showLogo /></td>
                                </>
                            ) : (
                                <>
                                    <td><TeamName name={match.team1.name} /></td>
                                    <td><MatchScore {...match.team1} /></td>
                                    <td><MatchScore {...match.team2} /></td>
                                    <td><TeamName name={match.team2.name} /></td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CategoryFilter({ currentCategory, onCategoryChange }) {
    return (
        <div className="mb-4">
            <label htmlFor="category-filter" className="mr-2 font-semibold">
                Filter by Category:
            </label>
            <select
                id="category-filter"
                className="p-2 border border-gray-500 rounded bg-white text-lg"
                value={currentCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
            >
                <option value="">-- Select a Category --</option>
                {TOURNAMENT_CONFIG.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
    );
}

function PlannerPage() {
    const { id } = useParams();
    const [selectedCategory, setSelectedCategory] = useState(TOURNAMENT_CONFIG.defaultCategory);
    const [matches, setMatches] = useState({ upcoming: [], finished: [] });
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

    // Add your data fetching logic here
    useEffect(() => {
        // Fetch matches data based on selectedCategory
    }, [selectedCategory, id]);

    const handleImportFixtures = (fixturesText) => {
        // TODO: Implement fixture parsing and importing logic
        console.log('Importing fixtures:', fixturesText);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <PlannerNavbar />
            <div className="p-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-4">Tournament Planning</h1>
                    
                    <div className="mb-4 flex justify-between items-center">
                        <CategoryFilter 
                            currentCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />
                        <div className="space-x-2">
                            <button 
                                onClick={() => setIsImportDialogOpen(true)}
                                className="bg-orange-500 text-white px-4 py-2 rounded"
                            >
                                Import Fixtures
                            </button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded">
                                Reset Tournament
                            </button>
                        </div>
                    </div>

                    <div id="play-controls" className="mb-5">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded">
                            Play Next Match
                        </button>
                        <input 
                            type="number" 
                            className="w-20 mx-2 p-2 border rounded"
                            min="1"
                            placeholder="N"
                        />
                        <button className="bg-green-500 text-white px-4 py-2 rounded">
                            Play Next N Matches
                        </button>
                    </div>

                    <MatchesTable matches={matches.upcoming} type="upcoming" />
                    <MatchesTable matches={matches.finished} type="finished" />

                    <ImportFixturesDialog
                        isOpen={isImportDialogOpen}
                        onClose={() => setIsImportDialogOpen(false)}
                        onImport={handleImportFixtures}
                    />
                </div>
            </div>
        </div>
    );
}
