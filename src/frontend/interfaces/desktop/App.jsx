import { Routes, Route } from "react-router-dom";
import { Provider} from "../../shared/js/Provider";
import LandingPage from "./components/LandingPage";
import { PrimeReactProvider } from 'primereact/api';

import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "./App.scss";

function App() {
  return (
    <PrimeReactProvider>
      <Provider>
        <Routes>
          <Route path="/tournament/:tournamentId" element={<LandingPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Provider>
    </PrimeReactProvider>
  );
}

export default App; 
