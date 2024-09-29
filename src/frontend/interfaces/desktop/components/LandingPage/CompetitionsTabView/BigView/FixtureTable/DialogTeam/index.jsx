import { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Chip } from 'primereact/chip';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { RadioButton } from 'primereact/radiobutton';
import { Accordion, AccordionTab } from 'primereact/accordion';
// import { ListBox } from 'primereact/listbox';
// import { InputText } from 'primereact/inputtext';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './DialogTeam.scss';

export function DialogPickTeam({
    fixtureId = null,
    fixtures = {},
    competition = 'C1',
}) {
    const initialFixture = fixtureId !== null ? fixtures[fixtureId] : {};
    const [showDrawer, setShowDrawer] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [fixtureState, setFixtureState] = useState({
        match: competition + '/001',
        stage: 'group',
        group: '1',
        startTime: '10:15',
        pitch: 'pitch 1',
        team1: 'team abc',
        team2: 'team def',
        umpiringTeam: 'teambury hearts fc',
        referee: 'J.D. Vance'
    });

    // Populate fields if fixtureId is provided
    useEffect(() => {
        if (fixtureId !== null) {
            setFixtureState({ ...fixtureState, ...initialFixture });
        }
    }, [fixtureId]);

    const handleEditClick = (field, doShow = true) => {
        setActiveField(doShow ? field : null);
        setShowDrawer(doShow);
    };

    const handleSave = () => {
        setShowDrawer(false);
        setActiveField(null);
    };

    const commonProps = { handleEditClick, fixtureState, handleSave, showDrawer, activeField };

    return (
        <div>
            <Splitter className={`DialogPickTeam`} style={{ width: '1000px' }}>
                <SplitterPanel>
                    <div className='ml-4 mt-4 mb-4 '>
                        <Display>
                            <DisplayRow label="Match #" editable={false} {...commonProps}>
                                <div className='font-bold ml-4 mb-2 text-lg'>
                                    {fixtureState.match}
                                </div>
                            </DisplayRow>
                            <DisplayRow label="Stage" {...commonProps}>
                                <Info>{fixtureState.stage}</Info>
                                <Label>Group</Label>
                                <Info>{fixtureState.group}</Info>
                            </DisplayRow>
                            <DisplayRow label="startTime" {...commonProps}>
                                <Info>{fixtureState.startTime}</Info>
                                <Label>pitch</Label>
                                <Info>{fixtureState.pitch}</Info>
                            </DisplayRow>
                            <DisplayRow label="Team 1" {...commonProps}>
                                <Info width={3}>{fixtureState.team1}</Info>
                            </DisplayRow>
                            <DisplayRow label="Team 2" {...commonProps}>
                                <Info width={3}>{fixtureState.team2}</Info>
                            </DisplayRow>
                            <DisplayRow label="Umpiring Team" {...commonProps}>
                                <Info width={3}>{fixtureState.umpiringTeam}</Info>
                            </DisplayRow>
                            <DisplayRow label="Referee" {...commonProps}>
                                <Info width={2}>{fixtureState.referee}</Info>
                            </DisplayRow>
                        </Display>
                    </div>
                </SplitterPanel>

                {/* Drawer for editing */}
                <SplitterPanel size={75} onHide={() => setShowDrawer(false)} className={`${showDrawer && 'open'}`}>
                    <div className='m-4 w-96'>
                        <h2>Edit: <i>{activeField}</i></h2>
                        <div className='mb-2'>{
                            showDrawer
                                ? <DialogCalcTeam />
                                : <Skeleton width="96%" height="520px" className='m-2' />
                        }</div>
                    </div>
                </SplitterPanel>
            </Splitter>
            <Button className={'float-right mt-4 mr-6 w-96'} disabled={showDrawer} label="Save & Close" onClick={handleSave} />
        </div>
    );
}

function Label({ children }) {
    return <span className='text-slate-400 text-right'>{children.toUpperCase()}:</span>;
}
function Info({ children, width = 1 }) {
    let w = '';
    switch (width) {
        case 1:
            w = 'w-24';
            break
        case 2:
            w = 'w-48';
            break
        case 3:
            w = 'w-72';
            break
        default:
            w = 'w-24';
            break
    }
    return <Chip label={children} className={`font-bold bg-blue-100 m-2 p-1 pl-3 ${w}`} />;
}
function Display({ children }) {
    return (
        <div className='Display w-full bg-blue mb-6'>
            <table className='w-full border-collapse' style={{ width: '550px' }}>
                <colgroup>
                    <col style={{ width: '140px' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: '10%' }} />
                </colgroup>
                {children}
            </table>
        </div>
    );
}
function DisplayRow({ label, children, editable = true, ...rest }) {
    const { handleEditClick, fixtureState, handleSave, showDrawer, activeField } = rest
    const isOpen = activeField === label;
    return (
        <tr className={`p-field ${editable && 'editable'} ${isOpen && 'open'}`}>
            <td className='text-right'><Label>{label}</Label></td>
            <td className="p-inputgroup"><div>{children}</div></td>
            <td>{editable && (
                <Button
                    className={`p-button-rounded p-button-text bg-blue ${isOpen && 'open'}`}
                    icon={isOpen ? 'pi pi-check' : 'pi pi-pencil'}
                    onClick={() => handleEditClick(label, !isOpen)}
                />
            )}</td>
        </tr>
    );
}

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
            <Accordion>

                <AccordionTab header={'Select Round'}>
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
                <AccordionTab header={'Select Placement'}>
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
            </Accordion>
        </div>
    );
};