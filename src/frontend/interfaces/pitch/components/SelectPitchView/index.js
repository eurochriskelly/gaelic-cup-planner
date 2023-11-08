import React, { useEffect, useState } from "react"
import SelectPitch from "./SelectPitch"

const SelectPitchView = () => {
    console.log('SelectPitchView')
    const [pitchData, setPitchData] = useState([]); // useState hook to store data

    async function fetchData() {
        try {
            console.log('Fetching data...')
            google.script.run
                .withSuccessHandler(data => {
                    console.log('Getting pitch data')
                    setPitchData(data)
                })
                .getListOfPitches()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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
                    key={pitch.id} {...pitch}
                    onChoosePitch={() => {
                        console.log('clicked')
                    }}
                />
            )
        }
    </>
}

export default SelectPitchView