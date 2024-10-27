import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { ListBox } from 'primereact/listbox';

function EditReferee({
    referee,
    referees,
    setReferee = () => { },
    updateFixture = () => { }
}) {
    const [selectedReferee, setSelectedReferee] = useState({ name: referee, code: referee });
    // todo: order referees by most likely to be selected
    // this is based on whether they are reffing other matches in the same 
    // competition and/or on the same pitch
    return (
        <div>
            <h3>Select Referee</h3>
            <ListBox
                value={selectedReferee}
                onChange={(e) => setSelectedReferee(e.value)}
                options={referees.map(r => ({ name: r, code: r }))}
                optionLabel="name"
                className="w-full md:w-14rem"
            />
        </div>
    );
}

export default EditReferee;