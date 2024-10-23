import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { ListBox } from 'primereact/listbox';

function EditReferee({
    referee,
    referees,
    setReferee = () => { }
}) {
    // todo: order referees by most likely to be selected
    // this is based on whether they are reffing other matches in the same 
    // competition and/or on the same pitch
    return (
        <div>
            <h3>Select Referee</h3>
            <ListBox
                value={referee}
                onChange={(e) => setReferee(e.value)}
                options={referees.map(r => ({ name: r, code: r }))}
                optionLabel="name"
                className="w-full md:w-14rem"
            />
        </div>
    );
}

export default EditReferee;