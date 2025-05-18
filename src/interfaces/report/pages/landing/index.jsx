import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateTournamentModal from './dialogs/CreateTournament';

// Inline mock data
const mockTournaments = [
  { id: 26, title: "Eindhoven Football Round 3", date: "2025-05-16", location: "Eindhoven", link: "bec22312-ee53-4c8d-b395-a633b6859e96" },
  { id: 25, title: "vienna", date: "2025-05-09", location: "vienna", link: "0e5c8afc-2023-4a99-b44d-2cb8e802627c" },
  { id: 24, title: "hurling", date: "2025-05-02", location: "maastricht", link: "d291769b-dfe8-47bb-b665-e70a70c22140" },
  // ...add a few more, you can add the rest as needed
  { id: 1, title: "Sandbox tournament 2030", date: "2029-12-31", location: "Eurodisney, Paris", link: "7bd2ad30-f6aa-11ef-a162-23d9aafc1469" }
];

// Mock API functions
const API = {
  getTournaments: async () => Promise.resolve(mockTournaments),
  getUser: async () => Promise.resolve({
    id: 1,
    name: "John Doe",
    email: "chris@pitchperfect.eu.com"
  })
};

// Navbar Component
function Navbar() {
    console.log("Navbar component rendered");
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <div className="breadcrumbs">
                <button onClick={() => navigate('/')} className="text-sm font-medium hover:text-gray-300">
                    Home
                </button>
            </div>
            <button
                onClick={() => navigate('/logout')}
                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-gray-300 hover:bg-gray-700"
            >
                Log Out
            </button>
        </nav>
    );
}

// Tournament Table Component
function TournamentTable({ tournaments }) {
    const navigate = useNavigate();

    const handleCopyLink = (link) => {
        if (link !== "N/A") {
            navigator.clipboard.writeText(link)
                .then(() => alert("Link copied!"))
                .catch(() => alert("Copy function not available"));
        }
    };

    return (
        <div className="m-3">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="p-2 bg-gray-200">ID</th>
                        <th className="p-2 bg-gray-200">Title</th>
                        <th className="p-2 bg-gray-200">Date</th>
                        <th className="p-2 bg-gray-200">Location</th>
                        <th className="p-2 bg-gray-200">Planning</th>
                        <th className="p-2 bg-gray-200">Execution</th>
                        <th className="p-2 bg-gray-200">Share</th>
                    </tr>
                </thead>
                <tbody>
                    {tournaments.map((tournament) => (
                        <tr key={tournament.id}>
                            <td className="p-2">{tournament.id}</td>
                            <td className="p-2">{tournament.title}</td>
                            <td className="p-2 whitespace-nowrap">{tournament.date}</td>
                            <td className="p-2">{tournament.location}</td>
                            <td className="p-2">
                                <button
                                    className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
                                    onClick={() => navigate(`/planning/${tournament.id}/matches`)}
                                >
                                    Planning
                                </button>
                            </td>
                            <td className="p-2">
                                <button
                                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                                    onClick={() => navigate(`/execution/${tournament.id}/recent`)}
                                >
                                    Execution
                                </button>
                            </td>
                            <td className="p-2">
                                <button
                                    className="px-4 py-2 rounded bg-teal-500 text-white hover:bg-teal-600"
                                    onClick={() => handleCopyLink(tournament.link)}
                                >
                                    Copy Link
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function LandingPage () {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        API.getTournaments()
            .then(data => {
                setTournaments(data);
            })
            .catch(error => {
                console.error("Failed to fetch tournaments:", error);
                setTournaments([]);
            });
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Add regions data
    const regions = ["North America", "Europe", "Asia Pacific", "Middle East", "Africa"];

    return (
        <article className="min-h-screen bg-gray-100">
            <Navbar />
            <hr className="border-gray-300" />
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Select a Tournament</h2>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        title="Create New Tournament"
                        onClick={openModal}
                    >+</button>
                </div>
                <CreateTournamentModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    regions={regions}
                />
                <TournamentTable tournaments={tournaments} />
            </div>
        </article>
    );
}

export default LandingPage;