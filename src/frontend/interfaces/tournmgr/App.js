import { Routes, Route } from "react-router-dom";
import SelectTournamentView from "./components/SelectTournamentView";
import TournamentView from "./components/TournamentView";
import OrganizeTournament from "./components/OrganizeTournament";

function App() {
    return <>
        <h1>Tournament Manager</h1>
        <Routes>
            <Route path="/" element={<SelectTournamentView />} />
            <Route path="/tournament/:tournamentId" element={<TournamentView />} />
            <Route path="/manage" element={<OrganizeTournament  />} />
        </Routes>
    </>
}

export default App