import React, { useState, useEffect } from 'react';
import GroupSelector from "./GroupSelector";
import GroupManager from "./GroupManager";
import TournamentSelector from "./TournamentSelector";
import TournamentLayout from "./TournamentLayout";
import styles from './OrganizeTournament.module.scss';

const OrganizeTournament = () => {
    const [selectedTournament, setSelectedTournament] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)

    const actions = {
        setGroup: (group) => setSelectedGroup(group)
    }
    const ss = (tournament) => {
        setSelectedTournament(tournament)
    }
    return <div className={styles.organizeTournament}>
        <h2>Organize Tournament</h2>

        <TournamentSelector
            tournamentId={selectedTournament?.Id}
            tournamentTitle={selectedTournament?.Title}
            setTournament={ss}
        />
        {selectedTournament?.Id && <TournamentLayout 
            group={selectedGroup}
            tournamentId={selectedTournament?.Id}
            title={selectedTournament?.Title}
            setGroup={actions.setGroup}>
            <>
                {
                    selectedGroup &&
                    <GroupManager
                        group={selectedGroup}
                        tournamentId={selectedTournament?.Id}
                    />
                }
            </>
        </TournamentLayout>
        }
    </div>
}

export default OrganizeTournament