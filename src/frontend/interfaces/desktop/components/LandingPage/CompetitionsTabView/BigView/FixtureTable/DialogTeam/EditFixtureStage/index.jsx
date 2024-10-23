import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { ListBox } from 'primereact/listbox';

function EditFixtureStage() {
    return (
        <div>
            <h3>Stage</h3>
            The fixture stage will go here
        </div>
    );
}

export default EditFixtureStage;


/*

I see there is quite some cross-over between the ref app and mine. 

One of my biggest hurdles has been getting the fixtures accurately into the system with the secondary goal of being able to do so right up until the last second. I've done some stuff like using AI agents to parse the fixtures and format it into my input format, but it still requires some manual work. Over the summer, I created a google spreadsheet that makes setting up competitions and fixtures easier. Now, i'm converting that to a web app to give me more control and flexibility. The goals is to have something very flexible and easy to use. It can create sane defaults and allow for easy overrides.
*/