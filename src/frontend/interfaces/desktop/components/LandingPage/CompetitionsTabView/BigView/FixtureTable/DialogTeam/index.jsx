import { useState, useEffect, act } from 'react';
import { Chip } from 'primereact/chip';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './DialogTeam.scss';

// sub-components
import EditTimeAndPlace from './EditTimeAndPlace';
import EditFixtureStage from './EditFixtureStage';
import EditReferee from './EditReferee';
import EditTeam from './EditTeam';

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
        group: 1,
        startTime: '10:15',
        pitch: 'pitch 1',
        team1: 'team abc',
        team2: 'team def',
        umpiringTeam: 'teambury hearts fc',
        referee: 'J. Malone',
        duration: 60,
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

    const handleSave = (newFixtureState) => {
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
                                <Info width={2}>{fixtureState.stage}</Info>
                                {fixtureState.stage === 'group' ?
                                    <>
                                        <Label>Group</Label>
                                        <Info width={1}>{fixtureState.group}</Info>
                                    </>
                                    : <>
                                        <Label>round</Label>
                                        <Info width={3}>{fixtureState.group}</Info>
                                        <Label>#</Label>
                                        <Info width={1}>{fixtureState.group}</Info>
                                    </>
                                }
                            </DisplayRow>
                            <DisplayRow label="Start time" {...commonProps}>
                                <Info width={2}>{fixtureState.startTime}</Info>
                                <Label>pitch</Label>
                                <Info width={2}>{fixtureState.pitch}</Info>
                            </DisplayRow>
                            <DisplayRow label="Team 1" {...commonProps}>
                                <Info width={4}>{fixtureState.team1}</Info>
                            </DisplayRow>
                            <DisplayRow label="Team 2" {...commonProps}>
                                <Info width={4}>{fixtureState.team2}</Info>
                            </DisplayRow>
                            <DisplayRow label="Umpiring Team" {...commonProps}>
                                <Info width={4}>{fixtureState.umpiringTeam}</Info>
                            </DisplayRow>
                            <DisplayRow label="Referee" {...commonProps}>
                                <Info width={3}>{fixtureState.referee}</Info>
                            </DisplayRow>
                            <DisplayRow label="Duration" {...commonProps}>
                                <Info width={2}>{fixtureState?.duration || '0 m'}</Info>
                            </DisplayRow>
                        </Display>
                    </div>
                </SplitterPanel>

                {/* Drawer for editing */}
                <SplitterPanel size={75} onHide={() => setShowDrawer(false)} className={`${showDrawer && 'open'} bg-slate-200 m-0`}>
                    <div className='m-0 w-96'>
                        <div className='mb-2 m-5'>{
                            showDrawer
                                ? <CustomEditDrawer {...commonProps} />
                                : <Skeleton width="96%" height="520px" className='m-2' />
                        }</div>
                    </div>
                </SplitterPanel>
            </Splitter>
            <Button className={'float-right mt-4 mr-6 w-96'} disabled={showDrawer} label="Save & Close" onClick={handleSave} />
        </div>
    );
}

function CustomEditDrawer({
    fixtureState,
    activeField,
    selectedPitch = 'Pitch 1',
    availablePitches = ['Pitch 1', 'Pitch 2', 'Pitch 3', 'Pitch 4'],
    ref = 'J.D. Vance',
    referees = ['J.D. Vance', 'J.K. Rowling', 'J.R.R. Tolkien', 'J.R. Smith', 'J.R. Ewing'],
}) {
    const commonProps = { fixtureState, activeField };
    switch (activeField.toUpperCase()) {
        case 'STAGE':
            return <EditFixtureStage {...commonProps} />;
        case 'START TIME':
            return <EditTimeAndPlace {...commonProps} />;
        case 'REFEREE':
            return <EditReferee {...commonProps} referee={ref} referees={referees} />;
        case 'TEAM 1':
            return <EditTeam {...commonProps} team={'team1'} />;
        case 'TEAM 2':
            return <EditTeam {...commonProps} team={'team2'} />;
        case 'UMPIRING TEAM':
            return <EditTeam {...commonProps} team={'umpiringTeam'} />;
        case 'DURATION':
            return <EditDuration {...commonProps} />;
        default:
            return <div>Unknown section</div>
    }
}

function Label({ children }) {
    return <label className='text-slate-400 text-right'>{children.toUpperCase()}:</label>;
}
function Info({ children, width = 1 }) {
    let w = '';
    switch (width) {
        case 1:
            w = 'w-12';
            break
        case 2:
            w = 'w-24';
            break
        case 3:
            w = 'w-48';
            break
        case 4:
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
                    <col style={{ width: '100px' }} />
                </colgroup>
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    );
}
function DisplayRow({ label, children, editable = true, ...rest }) {
    const { handleEditClick, fixtureState, handleSave, showDrawer, activeField } = rest
    const isOpen = activeField === label;
    return (
        <tr className={`p-field ${editable && 'editable'} ${isOpen ? 'open' : activeField ? 'locked' : 'unlocked'}`}>
            <td className='text-right'><Label>{label}</Label></td>
            <td className="p-inputgroup"><div>{children}</div></td>
            <td className=''>
                {editable && !isOpen && !activeField && <span className='inline-block w-full float-right'>
                    <span>&nbsp;</span>
                    <Button
                        className={`p-button-rounded p-button-text ${isOpen && 'open'} float-right`}
                        icon='pi pi-pencil'
                        onClick={() => handleEditClick(label, !isOpen)}
                    />
                </span>
                }
                {editable && isOpen && <span className='inline-block w-full'>
                    <Button
                        className={`p-button-rounded p-button-text p-cancel text-white ${isOpen && 'open'} float-right`}
                        icon='pi pi-times'
                        onClick={() => handleEditClick(label, !isOpen)}
                    />
                    <Button
                        className={`p-button-rounded p-button-text p-save bg-green-500 text-white ${isOpen && 'open'} float-right`}
                        icon='pi pi-check'
                        onClick={() => handleEditClick(label, !isOpen)}
                    />
                </span>
                }
            </td>
        </tr>
    );
}
