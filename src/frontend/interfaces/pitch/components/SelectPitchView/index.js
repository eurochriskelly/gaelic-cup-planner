import React, { useEffect } from "react"
import SelectPitch from "./SelectPitch"

const SelectPitchView = () => {
    let pitches = []
    const [pitchData, setPitchData] = useState([]); // useState hook to store data
    useEffect(() => {
        // Define the API call here
        async function fetchData() {
          try {
            google.script.run
            .withSuccessHandler(setPitchData)
            .getListOfPitches()
            
            setData(jsonData);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
    
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
        /* Add an on-click event */
        />
        {
            pitches.map(pitch =>
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