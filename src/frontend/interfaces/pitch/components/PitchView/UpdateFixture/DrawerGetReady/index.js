import React, { useState } from 'react';
import './DrawerGetReady.css';

const DrawerGetReady = ({
    fixture,
    visible,
    startMatch,
    teamSheetProvided,
    onClose = () => { }
}) => {
    if (!visible) return null
    const [ready, setReadyState] = useState(false);
    const [fixtureReady, setFixtureReadyState] = useState(false);

    const { umpiringTeam = 'Berlin' } = fixture

    return (
        <div className='drawerGetReady'>
            <div className='drawer-header'>Game prep checklist</div>
            <div className='drawer-container'>
                <div>
                    <ul>
                        <li>Are <span>{umpiringTeam}</span> umpires ready?      &nbsp;</li>
                        <li>Pitch markings are correct?</li>
                        <li>Have all teams submitted team sheets?</li>
                    </ul>
                    <button class="enabled" onClick={startMatch}>Start the clock!</button>
                </div>
            </div>
        </div>
    );
};

export default DrawerGetReady