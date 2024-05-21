import { Routes, Route } from "react-router-dom";
import { GroupProvider} from "./GroupProvider"; 
import SelectTournamentView from "./components/SelectTournamentView";
import TournamentView from "./components/TournamentView";

function App() {
  return (
    <GroupProvider>
      <h1 style={{fontSize: '3.3em', background: 'black', padding: '2rem 0'}}>LIVE UPDATES</h1>
      <Routes>
        <Route path="/" element={<SelectTournamentView />} />
        <Route path="/tournament/:tournamentId" element={<TournamentView />} />
      </Routes>
    </GroupProvider>
  );
}

export default App; 
