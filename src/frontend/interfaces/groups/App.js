import { Routes, Route } from "react-router-dom";
import SelectTournamentView from "./components/SelectTournamentView";
import TournamentView from "./components/TournamentView";

function App() {
    return <>
        <h1>Live Group Information</h1>
        <Routes>
            <Route path="/" element={<SelectTournamentView />} />
            <Route path="/tournament/:tournamentId" element={<TournamentView />} />
        </Routes>
    </>
}

export default App