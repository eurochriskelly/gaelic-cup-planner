import React, { useState, useEffect } from 'react';
import GroupSelector from "./GroupSelector";
import GroupManager from "./GroupManager";
import TournamentSelector from "./TournamentSelector";
import styles from './OrganizeTournament.module.scss';

const OrganizeTournament = () => {
    const [selectedTournament, setSelectedTournament] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)

    const actions = {
        setGroup: (group) => setSelectedGroup(group)
    }
    return <div className={styles.organizeTournament}>
        <h2>Organize Tournament</h2>

        <TournamentSelector
            selectedTournament={selectedTournament}
            setTournament={setSelectedTournament}
        />
        {selectedTournament && <>
            <GroupSelector setGroup={actions.setGroup} />
            <GroupManager group={selectedGroup} />
        </>
        }
    </div>
}

export default OrganizeTournament