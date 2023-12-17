import React, { useEffect, useState } from 'react';
import { DD } from '~/src/frontend/shared/js/log'
import styles from './TournamentLayout.module.scss';

const TournamentLayout = ({
    group = '',
    setGroup,
    tournament,
    children
}) => {
    const [existingGroups, setExistingGroups] = useState([])
    const [groupNames, setGroupNames] = useState([])
    
    useEffect(() => {
        const tournamentId = tournament?.id
        if (!tournamentId) return
        setGroupNames(Array.from(new Set(tournament.groups?.map(x => x.category) || [])))
        fetch(`/api/tournaments/${tournamentId}/groups`)
            .then(response => response.json())
            .then(data => {
                setExistingGroups(data.data.map(x => x.category))
            })
            .catch(error => {
                console.error('Error fetching next fixtures:', error)
            })
    }, [tournament])
    
    return (
        <div className={styles.tournamentLayout}>
            <div className={styles.sidePanel}>
                <SideSection title="Tournament">
                    <div className={styles.tournamentTitle}>{tournament?.Title}</div>
                </SideSection>

                <SideSection title="Categories">
                    <EditSelector 
                        action={setGroup}
                        current={group}
                        list={groupNames}
                    />
                </SideSection>

                <SideSection title="Pitches">
                    <EditSelector list={['Z1', 'Z2', 'Z3']} />
                </SideSection>
            </div>
            <div>
                <div className={styles.groupDetailsSection}>
                    <h3>Define groups for [{group}]</h3>
                    <div>{children}</div>
                </div>
            </div>
            
        </div>
    );
};

export default TournamentLayout;



function SideSection({title ="PLEASE SET!", children}) {
    return (
        <div className={styles.sideSection}>
            <h5 className={styles.sideLabel}>{title}:</h5>
            {children}
        </div>
    )
}

function EditSelector({ 
    list = [],
    current = '',
    action = () => {}
}) {
    // 
    return (
        <div>{list.map((x, i) => (
            <div
                key={`{x}-${i}`}
                className={`${styles.groupItem} ${current === x ? styles.active : ''}`}
                onClick={() => {
                    DD('From TournamentLayout, selected:', x)
                    action(x)
                }}>{x}</div>
        ))}</div>
    )
}    