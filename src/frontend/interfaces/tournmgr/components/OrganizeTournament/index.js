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
    return <div className={styles.organizeTournament}>
        <h2>Organize Tournament</h2>

        <TournamentSelector
            tournamentId={selectedTournament?.id}
            tournamentTitle={selectedTournament?.Title}
            setTournament={x => {
                console.log('Setting tournament to', x)
                setSelectedTournament(x)
            }}
        />
        {selectedTournament?.id && <TournamentLayout
            tournament={selectedTournament}
            group={selectedGroup}
            setGroup={actions.setGroup}>
            <>
                {
                    selectedGroup && <>
                    <GroupManager
                        group={selectedGroup}
                        tournament={selectedTournament}
                    />
                    </>
                }
            </>
        </TournamentLayout>
        }
    </div>
}

export default OrganizeTournament