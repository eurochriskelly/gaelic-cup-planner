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
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [selectedPitch, setSelectedPitch] = useState(currPitch);
    const [selectedAction, setSelectedAction] = useState(actions[0]);
    const [selectedFixture, setSelectedFixture] = useState(null);
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
                        onChange={(e) => setSelectedAction(e?.value)}
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
            <pre>
                selected time: {selectedTime.toString()}
                <br />
                selected pitch: {selectedPitch}
                <br />
                selected action: {selectedAction}
            </pre>
        </div>
    );
}

export default EditTimeAndPlace;
