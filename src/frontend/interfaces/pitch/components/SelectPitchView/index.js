import SelectPitch from "../SelectPitch"

const SelectPitchView = () => {
    let pitches = []
    
    google.script.run
        .withSuccessHandler(data => {
            pitches = data
        })
        .getListOfPitches()

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