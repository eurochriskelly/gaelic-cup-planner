import { Routes, Route } from "react-router-dom";
import PlayerView from "./component/PlayerView";

function App() {
    return <>
        <h1>Tournament Builder</h1>
        <Routes>
            <Route path="/" element={<PlayerView />} />
        </Routes>
    </>
}

export default App
