import React, { useEffect, useState } from 'react';
import { DD } from '~/src/frontend/shared/js/log'
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
    const list = ['Mens seniore', 'Mens intermediate', 'Mens junior']
    return (
        <div className={styles.tournamentLayout}>
            <div className={styles.sidePanel}>
                <div >
                    <div className={styles.sideLabel}>Tournament:</div>
                    <div className={styles.tournamentTitle}>{title}</div>
                </div>
                    <div className={styles.groupsSection}>
                        <div>Group: [{group}]</div>
                        <div className={styles.sideLabel}>Categories:</div>
                        <div>{list.map(x => (
                            <div
                                key={x}
                                className={`${styles.groupItem} ${group === x ? styles.active : ''}`}
                                onClick={() => {
                                    DD('From TournamentLayout, group selected:', x)
                                    setGroup(x)
                                }}>{x}</div>
                        ))}</div>
                        <div className={styles.groupItem}>Ladies senior</div>
                    </div>
                </div>
            <div className={styles.groupDetailsSection}>{children}</div>
        </div>
    );
};

export default TournamentLayout;
