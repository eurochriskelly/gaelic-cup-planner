import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { Provider, useAppContext } from "../../shared/js/Provider";
import { FixtureProvider } from "../../components/pitch/PitchView/FixturesContext";
import SelectTournamentView from "../../components/groups/SelectTournamentView";
import TournamentView from "../../components/groups/TournamentView";
import LandingPage from "./pages/LandingPage";
import SelectPitchView from "../../components/pitch/SelectPitchView";
import PitchView from "../../components/pitch/PitchView";
import PinLogin from "../../shared/generic/PinLogin";
import Cookies from "js-cookie";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../../shared/css/site-common.scss";
import "../../shared/css/site-mobile.scss";
import "./App.scss";
import "./i18n";

// New component to contain the routes and context-dependent logic
function AppContent() {
  const { userRole } = useAppContext(); // Now called within Provider's scope

  switch (userRole.toLowerCase()) {
    case 'coordinator':
      return (
        <Routes>
          <Route path="/" element={<PinLogin />} />
          <Route path="/tournament/:tournamentId" element={<LandingPage />} />
          <Route path="/tournament/:tournamentId/selectCategory" element={<SelectTournamentView />} />
          <Route path="/tournament/:tournamentId/category/:category" element={<TournamentView />} />
          <Route path="/tournament/:tournamentId/selectPitch" element={<SelectPitchView />} />
          <Route path="/tournament/:tournamentId/pitch/:pitchId" element={<PitchViewWrapper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      );
    case 'spectator':
    default:
      return (
        <Routes>
          <Route path="/" element={<PinLogin />} />
          <Route path="/tournament/:tournamentId" element={<SelectTournamentView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      );
  }
}

function App() {
  return <Provider><AppContent /></Provider>;
}

function PitchViewWrapper() {
  const { tournamentId } = useParams();
  let pitchId = useParams().pitchId;
  if (!pitchId) {
    pitchId = '*'
  }

  return (
    <FixtureProvider tournamentId={tournamentId} pitchId={pitchId}>
      <PitchView />
    </FixtureProvider>
  );
}

export default App;
