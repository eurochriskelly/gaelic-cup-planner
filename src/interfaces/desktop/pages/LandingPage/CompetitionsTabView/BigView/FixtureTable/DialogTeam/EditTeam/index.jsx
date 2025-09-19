import { useState} from 'react';
import { Dropdown } from 'primereact/dropdown';
import { ListBox } from 'primereact/listbox';
import { RadioButton } from 'primereact/radiobutton';
import { Accordion, AccordionTab } from 'primereact/accordion';

export function EditTeam({
    fixtureState,
    groupTeams = [],
    whichTeam = 'team1'
}) {
    console.log('fixtureState', fixtureState);
    const isGroupStage = fixtureState.stage === 'group';
    return (
        isGroupStage 
        ? <GroupTeamSelect currentTeam={fixtureState[whichTeam]} />
        : <KnockoutTeamSelect />
    );
};

export default EditTeam;

function GroupTeamSelect({
    teamsInGroup = [],
    teamsInTournament = [],
    currentTeam = ''
}) {
    const [selectedTeam, setSelectedTeam] = useState({ name: currentTeam, code: currentTeam });
    return (
        <ListBox
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.value)}
            options={teamsInGroup.map(t => ({ name: t, code: t }))}
            optionLabel="name"
            className="w-full md:w-14rem"
        />
    )
}

function KnockoutTeamSelect() {
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
            <Accordion>
                <AccordionTab header={`Placement`}>
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
                </AccordionTab>
                <AccordionTab header={`Round`}>
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
                </AccordionTab>
            </Accordion>
        </div>
    )
}