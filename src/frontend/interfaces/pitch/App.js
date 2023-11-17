import { Routes, Route } from "react-router-dom";
import SelectPitchView from "./components/SelectPitchView";
import PitchView from "./components/PitchView";


function App() {
    return <>
        <h1>Field Coordinator</h1>
        <Routes>
            <Route path="/" element={<SelectPitchView />} />
            <Route path="/pitch/:pitchId" element={<PitchView />} />
        </Routes>
    </>
}

export default App