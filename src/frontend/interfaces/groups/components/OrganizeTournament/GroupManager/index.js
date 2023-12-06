// GroupManager.js
import React, { useState, useEffect } from 'react';
import GroupManagerHelper from './GroupManager.class';
import FixturesPreview from './FixturesPreview';
import styles from './GroupManager.module.scss';

const GroupManager = () => {
    const [teamList, setTeamList] = useState([]);
    const [oldTeamName, setOldTeamName] = useState('');
    const [newTeamName, setNewTeamName] = useState('');
    const [newGroup, setNewGroup] = useState('');
    const [editIndex, setEditIndex] = useState(-1);
    const groupLetters = 'ABCDEFGH'.split('');

    const groupMgr = new GroupManagerHelper();

    const onChange = () => {
        groupMgr.teams = teamList;
    }

    useEffect(() => {
        onChange(teamList);
    }, [teamList, onChange]);

    const addTeam = (group) => {
        const newTeam = {
            name: newTeamName,
            group: group,
            _order: Math.max(...teamList.map(t => t._order || 0), 0) + 1,
        };
        setTeamList([
            ...teamList.filter(x => x.name).filter(x => x.name !== newTeamName),
            newTeam
        ]);
        setNewTeamName('');
    };

    const moveItem = (index, direction) => {
        debugger
        const newTeamList = [...teamList];
        const positionChange = direction === 'up' ? -1 : 1;
        const itemToMove = newTeamList.splice(index, 1)[0];
        newTeamList.splice(index + positionChange, 0, itemToMove);

        // Adjust the order
        newTeamList.forEach((team, i) => {
            team._order = i + 1;
        });

        setTeamList(newTeamList.filter(x => x.name));
    };

    const deleteItem = (index) => {
        const newTeamList = [...teamList];
        newTeamList.splice(index, 1);
        setTeamList(newTeamList.filter(x => x.name));
    };


    const editItem = index => {
        setEditIndex(index);
        setNewTeamName(teamList[index].name);
        setOldTeamName(teamList[index].name);
        setNewGroup(teamList[index].group);
    };

    const saveEdit = index => {
        let newList = [...teamList];
        newList[index] = { ...newList[index], name: newTeamName, group: newGroup };
        setTeamList(newList.filter(x => x.name));
        setEditIndex(-1);
        setNewTeamName('');
        setNewGroup('');
    };

    const groupedTeams = teamList.reduce((acc, team) => {
        (acc[team.group] = acc[team.group] || []).push(team);
        return acc;
    }, {});

    return (
        <div className={styles.groupManager}>
            <div className={styles.inputArea}>
                <input
                    type="text"
                    placeholder="Team name"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                />
                <div className={styles.groupButtons}>
                    {groupLetters.map((letter, index) => (
                        <button
                            key={letter}
                            onClick={() => addTeam(letter)}
                            disabled={!newTeamName}
                            className={styles.groupButton}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>
            {Object.entries(groupedTeams).map(([group, teams]) => (
                <div key={group} className={styles.group}>
                    <section>
                        <div className={styles.groupHeader}>{group}</div>
                        {teams.map((team, index) => (
                            <div className={styles.teamRow} key={team.name}>
                                <div className={styles.teamName}>{team.name}</div>
                                <div className={styles.teamActions}>
                                    {editIndex === index ? (
                                        <button onClick={() => saveEdit(index)}>Save</button>
                                    ) : (
                                        <>
                                            <button onClick={() => editItem(index)}>Edit</button>
                                            <button onClick={() => moveItem(index, 'up')}>↑</button>
                                            <button onClick={() => moveItem(index, 'down')}>↓</button>
                                            <button onClick={() => deleteItem(index)}>✕</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>
                    <section>
                        <FixturesPreview teams={teams} group={group} groupMgr={groupMgr} />
                    </section>
                </div>

            ))}
        </div>
    );
};

export default GroupManager;
