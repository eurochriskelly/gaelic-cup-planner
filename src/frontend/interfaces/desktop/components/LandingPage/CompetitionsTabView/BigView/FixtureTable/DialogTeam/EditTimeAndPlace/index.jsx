import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

function EditTimeAndPlace(props) {
    const {
        pitches = ['Pitch 1', 'Pitch 2', 'Pitch 3'],
        currPitch = 'Pitch 1',
        fixtures = [
            {
                matchId: 1,
                startTime: '10:00',
                team1: 'Team 1',
                team2: 'Team 2',
            },
            {
                matchId: 2,
                startTime: '12:00',
                team1: 'Team 4',
                team2: 'Team 2',
            }
        ],
    } = props;
    const actions = [
        'Move before fixture',
        'Move after fixture',
        'Swap with fixture'
    ];
    const [isDirty, setIsDirty] = useState(false);
    const cleanValues = {
        selectedTime: new Date(),
        selectedAction: actions[0],
        selectedFixture: null,
        selectedPitch: currPitch,
    };
    const dirtyCheck = (action, value) => {
        if (value === cleanValues[action]) {
            setIsDirty(false);
            return value;
        }  
        setIsDirty(true);
        return value;
    }
    const [selectedTime, setSelectedTime] = useState(cleanValues.selectedTime);
    const [selectedPitch, setSelectedPitch] = useState(cleanValues.selectedPitch);
    const [selectedAction, setSelectedAction] = useState(cleanValues.selectedAction);
    const [selectedFixture, setSelectedFixture] = useState(cleanValues.selectedFixture);
    return (
        <div>
            <h3>Start time</h3>
            <Calendar
                className='w-full md:w-14rem'
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.value)}
                timeOnly
                hourFormat="24"
                showTime
                dateFormat="HH:mm"
            />
            <div>
                <div className='w-full md:w-14rem text-center m-2'>OR..</div>
                <div>
                    <Dropdown
                        className='w-full md:w-14rem'
                        placeholder='Select action'
                        value={selectedAction}
                        onChange={(e) => dirtyCheck('action', e?.value)}
                        options={actions.map(a => ({ label: a, value: a }))}
                    />
                </div>
                <div>
                    <Dropdown
                        className='w-full md:w-14rem'
                        placeholder='Select fixture'
                        value={selectedFixture}
                        onChange={(e) => {
                            setSelectedFixture(e?.value)
                        }}
                        options={fixtures.map(f => ({
                            label: `M${f.matchId}@${f.startTime} ${f.team1} vs ${f.team2}`,
                            value: f.matchId,
                        }))}
                    />
                </div>
            </div>
            <h3>Pitch</h3>
            <Dropdown
                value={selectedPitch}
                onChange={(e) => {
                    console.log(`this is the value: ${e}`)
                    setSelectedPitch(e?.value)
                }}
                options={pitches.map(p => ({ label: p, value: p }))}
                placeholder="Select a pitch"
                className="w-full md:w-14rem"
            />
        </div>
    );
}

export default EditTimeAndPlace;
/*
    <pre>
        selected time: {selectedTime.toString()}
        <br />
        selected pitch: {selectedPitch}
        <br />
        selected action: {selectedAction}
    </pre>
*/