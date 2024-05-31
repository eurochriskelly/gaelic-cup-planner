import React from 'react'
import { Routes, Route } from "react-router-dom";
import { PitchProvider } from "./PitchProvider";
import SelectPitchView from "./components/SelectPitchView";
import PitchView from "./components/PitchView";
import PinLogin from './components/PinLogin';

function App() {
    return <PitchProvider>
        <Routes>
            <Route path="/" element={<PinLogin />} />
            <Route path="/ping" element={<div>pong</div>} />
            <Route path="/tournament/:tournamentId/selectPitch" element={<SelectPitchView />} />
            <Route path="/tournament/:tournamentId/pitch/:pitchId" element={<PitchView />} />
        </Routes>
    </PitchProvider>
}

export default App
