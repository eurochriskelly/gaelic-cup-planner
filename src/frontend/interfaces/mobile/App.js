import { Routes, Route } from "react-router-dom";
import { Provider} from "../../shared/js/Provider";
import PinLogin from '../../shared/generic/PinLogin';
import SelectTournamentView from "../../components/groups/SelectTournamentView";
import TournamentView from "../../components/groups/TournamentView";
import LandingPage from "./components/LandingPage";
import SelectPitchView from "../../components/pitch/SelectPitchView";
import PitchView from "../../components/pitch/PitchView";

function App() {
  console.log('Welcome to the App...');
  return (
    <Provider>
      <Routes>
        <Route path="/tournament/:tournamentId" element={<LandingPage />} />
        <Route path="/tournament/:tournamentId/selectCategory" element={<SelectTournamentView />} />
        <Route path="/tournament/:tournamentId/category/:category" element={<TournamentView />} />
        <Route path="/tournament/:tournamentId/selectPitch" element={<SelectPitchView />} />
        <Route path="/tournament/:tournamentId/pitch/:pitchId" element={<PitchView />} />
        <Route path="*" element={<PinLogin />} />
      </Routes>
    </Provider>
  );
}

export default App; 
