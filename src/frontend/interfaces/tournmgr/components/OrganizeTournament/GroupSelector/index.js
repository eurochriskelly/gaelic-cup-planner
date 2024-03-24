// GroupManager.js
import React, { useState, useEffect } from 'react';
import AutocompleteSelect from "~/src/frontend/shared/generic/AutocompleteSelect"
import styles from './GroupSelector.module.scss';

const GroupSelector = ({
    selectedGroup,
    tournamentId,
    setGroup
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

    return selectedGroup ? (
        <h3>
            <span>Selected group: {selectedGroup}</span>
            <button onClick={() => setGroup(null)}>Change</button>
        </h3>
    ) : (
        <div>
            <h3>Group Selector</h3>
            <AutocompleteSelect
                options={existingGroups}
                limit={8}
                selectAction={setGroup}
            />
        </div>
    )
}

export default GroupSelector