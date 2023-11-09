import React, { useEffect, useState } from "react"
import SelectPitch from "./SelectPitch"

const SelectPitchView = () => {
    console.log('SelectPitchView')
    const [pitchData, setPitchData] = useState([]); // useState hook to store data

    async function fetchData() {
        console.log('Fetching data...')
        fetch('/api/pitches')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setPitchData(data.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        })
    }

    useEffect(() => {
        // Define the API call here
        // Call the API when the component is mounted
        fetchData();
    }, []);

    return <>
        <h2>Please select pitch</h2>
        <SelectPitch
            header={true}
            id="Id"
            location="Location"
            type="Type"
        />
        {
            pitchData.map(pitch =>
                <SelectPitch
                    key={pitch.pitch} {...pitch}
                    onChoosePitch={() => {
                        console.log('clicked')
                    }}
                />
            )
        }
    </>
}

export default SelectPitchView