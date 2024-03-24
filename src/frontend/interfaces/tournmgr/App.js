import { Routes, Route } from "react-router-dom";
import OrganizeTournament from "./components/OrganizeTournament";

function App() {
    return <>
        <h1>Tournament Builder</h1>
        <Routes>
            <Route path="/" element={<OrganizeTournament />} />
        </Routes>
    </>
}

export default App
