import React, { useState } from 'react';
import styles from './DrawerGetReady.module.scss';

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
        <div className={styles.drawerGetReady}>
            <div className='drawer-header'>Game prep checklist</div>
            <div className='drawer-container'>
                <div>
                    <h5>Check list</h5>
                    <ul>
                        <li>Are <span>{umpiringTeam}</span> umpires ready?      &nbsp;</li>
                        <li>Pitch markings are correct?</li>
                        <li>Have all teams submitted team sheets?</li>
                    </ul>
                    <button class="enabled" onClick={startMatch}>The game has started!</button>
                </div>
            </div>
        </div>
    );
};

export default DrawerGetReady