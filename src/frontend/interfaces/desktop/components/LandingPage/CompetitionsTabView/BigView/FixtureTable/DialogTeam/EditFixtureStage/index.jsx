import { useState } from 'react';
import { ListBox } from 'primereact/listbox';
import { Dropdown } from 'primereact/dropdown';

function EditFixtureStage({
    stage = 'group',
    stageOrder = 1,
    teams = [
        { name: 'Team 1', group: 1 },
        { name: 'Team 2', group: 1 },
        { name: 'Team 3', group: 2 },
        { name: 'Team 4', group: 2 },
        { name: 'Team 5', group: 2 },
        { name: 'Team 6', group: 2 }
    ],
    setStage = () => { }
}) {
    const stages = ['group', 'playoffs', 'knockout'];
    const [selectedStage, setSelectedStage] = useState({ name: stage, code: stage });
    const [selectedNumber, setSelectedNumber] = useState(stageOrder);

    const numbers = [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 }
    ];
    return (
        <div>
            <h3>Stage</h3>
            <ListBox
                onChange={(e) => {
                    console.log(`this is the value: ${JSON.stringify(e.value)}`);
                    setSelectedStage(e.value);
                }}
                value={selectedStage}
                options={stages.map(s => ({ name: s, code: s }))}
                optionLabel="name"
                className="w-full md:w-14rem" />

            {selectedStage.code === 'group' && (
                <div>
                    <h3>Group</h3>
                    <div className='grid grid-cols-2'>
                        <div className='w-1'>
                            <Dropdown
                                value={selectedNumber}
                                options={numbers}
                                onChange={(e) => setSelectedNumber(e.value)} // Remove .name
                                placeholder="Select a number"
                            />
                        </div>
                        <div className='w-full'>
                            <h3>Teams in group</h3>
                            {teams
                                .filter(t => +t.group === +selectedNumber)
                                .map(t => {
                                    return <div className='p-2 m-2 w-96'>{t.name}</div>;
                                })
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditFixtureStage;
