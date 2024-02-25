import React, { useState } from 'react';
import styles from './DrawerGetReady.module.scss';

const DrawerGetReady = ({
    fixture,
    visible,
    startMatch,
    onClose = () => { }
}) => {
    if (!visible) return null;

    const { umpireTeam } = fixture;

    // Initialize state for checkboxes
    const [checklist, setChecklist] = useState({
        pitchMarked: false,
        sheetsSubmitted: false,
        umpiresReady: false,
    });

    // Function to handle checkbox change
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setChecklist(prevChecklist => ({
            ...prevChecklist,
            [name]: checked,
        }));
    };

    // Check if all checkboxes are checked
    const allChecked = Object.values(checklist).every(value => value);

    const actions = {
        startMatch: async () => {
            await startMatch(fixture.id);
            onClose('start');
        },
    };

    return (
        <div className={styles.drawerGetReady}>
            <div className='drawer-header'>Pre-match checklist</div>
            <div className='drawer-container'>
                <div>
                    <ul>
                        <li>
                            <input
                                type="checkbox"
                                name="pitchMarked"
                                checked={checklist.pitchMarked}
                                onChange={handleCheckboxChange}
                            />
                            Is pitch marked out?
                        </li>
                        <li>
                            <input
                                type="checkbox"
                                name="sheetsSubmitted"
                                checked={checklist.sheetsSubmitted}
                                onChange={handleCheckboxChange}
                            />
                            Have both teams submitted sheets?
                        </li>
                        <li>
                            <input
                                type="checkbox"
                                name="umpiresReady"
                                checked={checklist.umpiresReady}
                                onChange={handleCheckboxChange}
                            />
                            Are <span>{umpireTeam}</span> umpires ready?
                        </li>
                    </ul>
                    <button
                        className={allChecked ? "enabled" : "disabled"}
                        onClick={actions.startMatch}
                        disabled={!allChecked}
                    >
                        Start the clock ...
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DrawerGetReady;
