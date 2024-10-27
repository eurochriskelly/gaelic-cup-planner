import { useState } from 'react';
import { ListBox } from 'primereact/listbox';

function EditDuration({
    duration,
}) {

    return (
        <div>
            <h3>Enter duration of match</h3>
            <InputBox />
        </div>
    );
}

export default EditDuration;