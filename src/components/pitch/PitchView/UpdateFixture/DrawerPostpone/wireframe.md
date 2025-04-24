# Design

## Wireframe

    Title:        Reschedule match
    Select Pitch: [ Pitches select   (v)]       <--- this is a pitch select dropbox
    Place:        ( ) before (*) after          <--- this is a radio choice
    Fixture:      [ list of fixutres (v)]       <--- this is a drop down with a list of fixtures
    

## General react form

   const [selPitch, setSelPitch] = useState(null);
   const [placement, setPlacement] = useState('after')
   const [filterFixtures, setFilteredFixtures] = useState([])
   <div>
       <div className="title">Reschedule match</div>
       <SelectFromList list={list} onChange={somefunction} placeholderText={'Select pitch'} />
       <div>
           { /* radio choice goes here */ }
       </div>
       <SelectFromList list={fixtures.filter(filterFixtures)} onChange={somefunction} placeholderText={'Select pitch'} />
       <div className="formSubmission">
           <button onClick={doSubmit}>Re-schedule</button>
           <button onClick={doCancel}>Cancel</button>
       </div>
   </div>



