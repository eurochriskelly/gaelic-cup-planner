import React, { useEffect, useState } from 'react';
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
        console.log('fetching groups')
        fetch(`/api/tournaments/${tournamentId}/groups`)
            .then(response => response.json())
            .then(data => {
                setExistingGroups(data.data.map(x => x.category))
            })
            .catch(error => {
                console.error('Error fetching next fixtures:', error)
            })
    }, [tournamentId])

    return (
        <div className={styles.tournamentLayout}>
            <div className={styles.sidePanel}>
                <div >
                    <div className={styles.sideLabel}>Tournament:</div>
                    <div className={styles.tournamentTitle}>{title}</div>
                </div>
                <div className={styles.groupsSection}>
                    <div>ggg {group}</div>
                    <div className={styles.sideLabel}>Categories:</div>
                    <div className={`${styles.groupItem} ${group === 'Mens senior' ? styles.active : ''}`}>
                        Mens senior
                    </div>
                    {/* Add other groups here as needed */}
                    <div className={styles.groupItem}>Ladies junior</div>
                    <div className={styles.groupItem}>Ladies intermediate</div>
                    <div className={styles.groupItem}>Ladies senior</div>
                </div>
            </div>
            <div className={styles.groupDetailsSection}>
                {children}
            </div>
        </div>
    );
};

export default TournamentLayout;
