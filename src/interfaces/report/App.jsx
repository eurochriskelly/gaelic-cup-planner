import { Routes, Route } from 'react-router-dom';
import { Provider} from "../../shared/js/Provider";
import Sandbox from "./pages/sandbox";
import PlannerPage from "./pages/planner";
import LandingPage from "./pages/landing";
import { TournamentProvider } from "./TournamentContext";
import { PrimeReactProvider } from 'primereact/api';

import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import "./App.scss"; // Ensure Tailwind directives are here

function App() {
  return (
    <PrimeReactProvider>
      <Provider>
        <TournamentProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tournament/:tournamentId" element={<LandingPage />} />
            <Route path="/planning/:id/matches" element={<PlannerPage />} />
            <Route path="/execution/:id/recent" element={<LandingPage />} />
            <Route path="*" element={<Sandbox />} />
          </Routes>
        </TournamentProvider>
      </Provider>
    </PrimeReactProvider>
  );
}

export default App;
