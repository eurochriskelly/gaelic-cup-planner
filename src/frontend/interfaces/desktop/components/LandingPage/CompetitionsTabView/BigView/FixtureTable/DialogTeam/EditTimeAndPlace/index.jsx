import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { ListBox } from 'primereact/listbox';

function EditTimeAndPlace() {
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [selectedCity, setSelectedCity] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
    return (
        <div>
            <h3>Start time</h3>
            <Calendar
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.value)}
                timeOnly
                hourFormat="24"
                showTime
                dateFormat="HH:mm"
            />
            <h3>Location</h3>
            <ListBox
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.value)}
                options={cities}
                optionLabel="name"
                className="w-full md:w-14rem"
            />
        </div>
    );
}

export default EditTimeAndPlace;

/*

In many ways, running a league is a simpler problem to crack. You have known teams with a couple of games per day. Tracking 120 matches in a day is a more interesting puzzle to solve. 

By the way, I don't know if I mentioned this to you before, but when I did the ref course with you in Leuven, I was dead impressed by the ref reporting system you had created. I believe we think quite similarly and there aren't many like us out here. It might take a few goes 
*/