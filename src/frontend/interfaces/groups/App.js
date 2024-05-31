import { Routes, Route } from "react-router-dom";
import { GroupProvider} from "./GroupProvider"; 
import SelectTournamentView from "./components/SelectTournamentView";
import TournamentView from "./components/TournamentView";

function App() {
  return (
    <GroupProvider>
      <h1>LIVE UPDATES</h1>
      <Routes>
        <Route path="/" element={<SelectTournamentView />} />
        <Route path="/tournament/:tournamentId/selectCategory" element={<SelectTournamentView />} />
        <Route path="/tournament/:tournamentId/category/:category" element={<TournamentView />} />
      </Routes>
    </GroupProvider>
  );
}

export default App; 
