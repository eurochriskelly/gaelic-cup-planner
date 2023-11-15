import { Routes, Route } from "react-router-dom";
import SelectTournamentView from "./components/SelectTournamentView";
import TournamentView from "./components/TournamentView";
import GroupManager from "./components/GroupManager";

function App() {
    return <>
        <h1>Live Group Information</h1>
        <Routes>
            <Route path="/" element={<SelectTournamentView />} />
            <Route path="/tournament/:tournamentId" element={<TournamentView />} />
            <Route path="/manage" element={<GroupManager  />} />
        </Routes>
    </>
}

export default App