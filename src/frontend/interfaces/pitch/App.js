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
            <Route path="/tournaments/:tournamentId" element={<SelectPitchView />} />
            <Route path="/tournaments/:tournamentId/pitches/:pitchId" element={<PitchView />} />
        </Routes>
    </PitchProvider>
}

export default App
