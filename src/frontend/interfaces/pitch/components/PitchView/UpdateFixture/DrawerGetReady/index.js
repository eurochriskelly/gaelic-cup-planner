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

    const { umpiringTeam = 'Berlin' } = fixture
    console.log({fixture})

    const actions = {
        startMatch: async () => {
            await startMatch(fixture.id)
            onClose('start')
        }
    }

    return (
        <div className={styles.drawerGetReady}>
            <div className='drawer-header'>Game prep checklist</div>
            <div className='drawer-container'>
                <div>
                    <ul>
                        <li>Are <span>{umpiringTeam}</span> umpires ready?      &nbsp;</li>
                        <li>Pitch markings are correct?</li>
                        <li>Have all teams submitted team sheets?</li>
                    </ul>
                    <button className="enabled" onClick={actions.startMatch}>Start the clock ...</button>
                </div>
            </div>
        </div>
    );
};

export default DrawerGetReady