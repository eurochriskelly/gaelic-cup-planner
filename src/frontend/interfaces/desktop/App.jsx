import { Routes, Route } from "react-router-dom";
import { Provider} from "../../shared/js/Provider";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <Provider>
      <Routes>
        <Route path="/tournament/:tournamentId" element={<LandingPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Provider>
  );
}

export default App; 
