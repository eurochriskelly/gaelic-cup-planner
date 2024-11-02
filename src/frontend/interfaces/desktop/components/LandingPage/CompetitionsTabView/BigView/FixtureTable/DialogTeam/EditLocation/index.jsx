import { useState } from 'react';
import { ListBox } from 'primereact/listbox';

function EditLocation({
    duration,
}) {

    return (
        <div>
            <h3>Enter duration of match</h3>
            <InputBox />
        </div>
    );
}

export default EditLocation;