import EditTimeAndPlace from '../EditTimeAndPlace';
import EditFixtureStage from '../EditFixtureStage';
import EditReferee from '../EditReferee';
import EditTeam from '../EditTeam';

function CustomEditDrawer({
    fixtureState,
    activeField,
    handleSave,
    selectedPitch = 'Pitch 1',
    availablePitches = ['Pitch 1', 'Pitch 2', 'Pitch 3', 'Pitch 4'],
    ref = 'J.D. Vance',
    referees = ['J.D. Vance', 'J.K. Rowling', 'J.R.R. Tolkien', 'J.R. Smith', 'J.R. Ewing'],
}) {
    const commonProps = { fixtureState, activeField, handleSave };
    switch (activeField) {
        case 'Start time':
            return <EditTimeAndPlace {...commonProps} />;
        case 'Stage':
            return <EditFixtureStage {...commonProps} />;
        case 'Referee':
            return <EditReferee {...commonProps} referee={ref} referees={referees} />;
        default:
            return <EditTeam {...commonProps} />;
    }
}

export default CustomEditDrawer;