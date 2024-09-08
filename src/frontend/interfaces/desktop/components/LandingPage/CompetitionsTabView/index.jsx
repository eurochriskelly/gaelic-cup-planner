import { useState } from 'react';
import BigView from '../../BigView';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

function CompetitionsTabView() {
  const [competitions, setCompetitions] = useState([
    { name: "Setup competition ...", code: "Mens", ready: false },
  ]);
  const [newCompetitionName, setNewCompetitionName] = useState('');

  const addNewCompetition = () => {
    if (newCompetitionName.trim()) {
      setCompetitions([
        ...competitions.slice(0, -1),
        { name: newCompetitionName.toUpperCase(), code: '', ready: true },
        { name: "Setup another ...", code: "Mens", ready: false }
      ]);
      setNewCompetitionName(''); // Clear the input field after adding
    }
  };

  return <>
    <h1>Competitions</h1>
    <TabView>{
      competitions.map((competition, index) => (
        <TabPanel key={index} header={competition.name}>
          {
            competitions.length === 1 && !competition.ready && (
              <p>No competitions added yet</p>
            )
          }
          {
            competition.ready
            ? <BigView competition={competition} />
            : <>
              <InputText 
                placeholder="Enter name of competition" 
                value={newCompetitionName}
                onChange={(e) => setNewCompetitionName(e.target.value)}
              />
              <Button onClick={addNewCompetition}>Add a competition</Button>
            </> 
          }
        </TabPanel>
      ))
    }</TabView>
  </>
}

export default CompetitionsTabView;

