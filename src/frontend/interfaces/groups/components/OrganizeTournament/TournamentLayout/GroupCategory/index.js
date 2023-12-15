import React, { useEffect, useState } from 'react';
import { DD } from '~/src/frontend/shared/js/log'

export const GroupCategorySelector = () => {
    const categories = ['Mens senior', 'Mens intermediate', 'Mens junior']
    return (
        <div>{categories.map(x => (
            <div
                key={x}
                className={`${styles.groupItem} ${group === x ? styles.active : ''}`}
                onClick={() => {
                    DD('From TournamentLayout, group selected:', x)
                    setGroup(x)
                }}>{x}</div>
        ))}</div>
    )
}

export const GroupCategoryEditor = () => {
    return (
        <div className={styles.groupDetailsSection}>
            <h3>Define groups for [{group}]</h3>
            <div>{children}</div>
        </div>
    ) 
}