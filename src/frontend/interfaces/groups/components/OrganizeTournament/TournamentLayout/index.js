import React, { useEffect, useState } from 'react';
import { GroupCategoryEditor, GroupCategorySelector } from './GroupCategory';
import styles from './TournamentLayout.module.scss';

const TournamentLayout = ({
    title,
    group,
    setGroup,
    tournamentId,
    children
}) => {
    const [existingGroups, setExistingGroups] = useState([])
    useEffect(() => {
        if (!tournamentId) return
        fetch(`/api/tournaments/${tournamentId}/groups`)
            .then(response => response.json())
            .then(data => {
                setExistingGroups(data.data.map(x => x.category))
            })
            .catch(error => {
                console.error('Error fetching next fixtures:', error)
            })
    }, [tournamentId])
    
    const pitches = ['Z1', 'Z2', 'Z3', 'Z4', 'Z5', 'Z6', 'Z7', 'Z8']

    return (
        <div className={styles.tournamentLayout}>
            <div className={styles.sidePanel}>
                <SideSection title="Tournament">
                    <div className={styles.tournamentTitle}>{title}</div>
                </SideSection>

                <SideSection title="Categories">
                    <GroupCategorySelector />
                </SideSection>

                <SideSection title="Pitches">
                            
                </SideSection>
            </div>
            <EditSection>
                <GroupCategoryEditor>{children}</GroupCategoryEditor>
            </EditSection>
            
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