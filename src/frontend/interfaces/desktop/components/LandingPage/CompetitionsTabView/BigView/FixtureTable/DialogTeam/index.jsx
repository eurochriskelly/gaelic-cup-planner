import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { ListBox } from 'primereact/listbox';
import { RadioButton } from 'primereact/radiobutton';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './DialogTeam.scss';

export function DialogCalcTeam() {
    const [placement, setPlacement] = useState('winner');
    const [round, setRound] = useState('group');

    // State variables for dropdown selections
    const [bestOfOption, setBestOfOption] = useState('best of');
    const [placeOption, setPlaceOption] = useState('1st');
    const [groupOption, setGroupOption] = useState(3);
    const [cupTypeOption, setCupTypeOption] = useState('Cup');
    const [cupStageOption, setCupStageOption] = useState('Semis');
    const [cupNumberOption, setCupNumberOption] = useState(1);

    // Options for dropdowns
    const bestOfOptions = [
        { label: 'Best Of', value: 'best of' },
        { label: '2nd Of', value: '2nd of' },
        { label: '3rd Of', value: '3rd of' },
        { label: '3rd Last Of', value: '3rd last of' },
        { label: '2nd Last Of', value: '2nd last of' },
        { label: 'Last Of', value: 'last of' },
    ];

    const placeOptions = [
        { label: '1st', value: '1st' },
        { label: '2nd', value: '2nd' },
        { label: '3rd', value: '3rd' },
        { label: '4th', value: '4th' },
        { label: '5th', value: '5th' },
        { label: '6th', value: '6th' },
    ];

    const groupOptions = [1, 2, 3, 4, 5, 6].map((num) => ({ label: num.toString(), value: num }));

    const cupTypeOptions = [
        { label: 'Cup', value: 'Cup' },
        { label: 'Plate', value: 'Plate' },
        { label: 'Shield', value: 'Shield' },
        { label: 'Spoon', value: 'Spoon' },
    ];

    const cupStageOptions = [
        { label: '16s', value: '16s' },
        { label: 'Quarters', value: 'Quarters' },
        { label: 'Semis', value: 'Semis' },
        { label: 'Finals', value: 'Finals' },
        { label: '7th8ths', value: '7th8ths' },
        { label: '5th6ths', value: '5th6ths' },
        { label: '3rd4ths', value: '3rd4ths' },
    ];

    const cupNumberOptions = [1, 2, 3, 4, 5, 6, 7, 8].map((num) => ({ label: num.toString(), value: num }));

    return (
        <div className="placement-round-container">
            <div className="section">
                <h3>Placement</h3>
                <div className="option">
                    <RadioButton
                        inputId="winner"
                        value="winner"
                        name="placement"
                        onChange={(e) => setPlacement(e.value)}
                        checked={placement === 'winner'}
                    />
                    <label htmlFor="winner">Winner</label>
                </div>
                <div className="option">
                    <RadioButton
                        inputId="loser"
                        value="loser"
                        name="placement"
                        onChange={(e) => setPlacement(e.value)}
                        checked={placement === 'loser'}
                    />
                    <label htmlFor="loser">Loser</label>
                </div>
                <div className="option">
                    <RadioButton
                        inputId="place"
                        value="place"
                        name="placement"
                        onChange={(e) => setPlacement(e.value)}
                        checked={placement === 'place'}
                    />
                    <Dropdown
                        value={placeOption}
                        options={placeOptions}
                        onChange={(e) => setPlaceOption(e.value)}
                        placeholder="Select Place"
                        className="small-dropdown"
                        disabled={placement !== 'place'}
                    />
                    <span> Place</span>
                </div>
                <div className="option">
                    <RadioButton
                        inputId="bestOf"
                        value="bestOf"
                        name="placement"
                        onChange={(e) => setPlacement(e.value)}
                        checked={placement === 'bestOf'}
                    />
                    <Dropdown
                        value={bestOfOption}
                        options={bestOfOptions}
                        onChange={(e) => setBestOfOption(e.value)}
                        placeholder="Select Option"
                        className="large-dropdown"
                        disabled={placement !== 'bestOf'}
                    />
                </div>
            </div>

            <div className="section">
                <h3>Round</h3>
                <div className="option">
                    <RadioButton
                        inputId="group"
                        value="group"
                        name="round"
                        onChange={(e) => setRound(e.value)}
                        checked={round === 'group'}
                    />
                    <label htmlFor="group">Group</label>
                    <Dropdown
                        value={groupOption}
                        options={groupOptions}
                        onChange={(e) => setGroupOption(e.value)}
                        placeholder="Select Group"
                        className="small-dropdown"
                        disabled={round !== 'group'}
                    />
                </div>
                <div className="option">
                    <RadioButton
                        inputId="allGroups"
                        value="allGroups"
                        name="round"
                        onChange={(e) => setRound(e.value)}
                        checked={round === 'allGroups'}
                    />
                    <label htmlFor="allGroups">All Groups</label>
                </div>
                <div className="option">
                    <RadioButton
                        inputId="cupSemis"
                        value="cupSemis"
                        name="round"
                        onChange={(e) => setRound(e.value)}
                        checked={round === 'cupSemis'}
                    />
                    <Dropdown
                        value={cupTypeOption}
                        options={cupTypeOptions}
                        onChange={(e) => setCupTypeOption(e.value)}
                        placeholder="Select Type"
                        className="small-dropdown"
                        disabled={round !== 'cupSemis'}
                    />
                    <Dropdown
                        value={cupStageOption}
                        options={cupStageOptions}
                        onChange={(e) => setCupStageOption(e.value)}
                        placeholder="Select Stage"
                        className="medium-dropdown"
                        disabled={round !== 'cupSemis'}
                    />
                    <Dropdown
                        value={cupNumberOption}
                        options={cupNumberOptions}
                        onChange={(e) => setCupNumberOption(e.value)}
                        placeholder="#"
                        className="tiny-dropdown"
                        disabled={round !== 'cupSemis'}
                    />
                </div>
                <div className="option">
                    <RadioButton
                        inputId="match"
                        value="match"
                        name="round"
                        onChange={(e) => setRound(e.value)}
                        checked={round === 'match'}
                    />
                    <label htmlFor="match">Match</label>
                </div>
            </div>
        </div>
    );
};

export function DialogPickTeam({
    data,
    current = null,
    onHide, // Accept onHide as a prop
}) {
    const groupTeams = data?.groupTeams || [];
    const customStyles = {
        dropdown: {
            color: 'black',
            backgroundColor: 'white',
        },
        option: {
            color: 'black',
            backgroundColor: 'white',
        },
    };
    console.log(data)
    return (
        <ListBox
            value={data.rowData[data.field]}
            options={groupTeams}
            onChange={(e) => {
                console.log(e.value);
                onHide(); // Close dialog when selection is made
            }}
            placeholder="Select a Team"
            style={customStyles.dropdown}
            panelStyle={customStyles.option}
            itemTemplate={(option) => <span>{option}</span>}
        />
    );
}
