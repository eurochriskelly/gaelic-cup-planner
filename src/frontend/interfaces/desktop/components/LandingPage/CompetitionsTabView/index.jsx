import { useEffect, useState } from 'react'; import BigView from './BigView';
import { useTournament } from "../../../TournamentContext";

import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './CompetitionsTabView.scss';

function CompetitionsTabView()
{
  const { categories, pitches, venues }  = useTournament();
  const [competitions, setCompetitions] = useState([]);
  const [newCompetitionName, setNewCompetitionName] = useState('');
  const addNewCompetition = () => {
    if (newCompetitionName.trim()) {
      setCompetitions([
        ...competitions,
        { name: newCompetitionName.toUpperCase(), code: '', ready: true },
      ]);
      setNewCompetitionName(''); // Clear the input field after adding
    }
  };
  useEffect(() => {
    const comp = Object.keys(categories).map(key => {
      return {
        name: key.toUpperCase(),
        code: '',
        teams: categories[key].groups,
        data: categories[key],
        ready: false,
      }
    });
    console.log('CompetitionsTabView:', comp);
    setCompetitions(comp);
  }, []);

  return <section className='CompetitionsTabView'>
    <div>
      <h1>Competitions</h1>
      <AddCompetition 
        newCompetitionName={newCompetitionName}
        setNewCompetitionName={setNewCompetitionName}
        addNewCompetition={addNewCompetition} />
    </div>
    {
      competitions.length > 0 && (
        <TabView>{
          competitions.map((competition, index) => (
            <TabPanel key={`tp-${index}`} header={competition.name}>
              <BigView competition={competition} pitches={pitches} venues={venues} />
            </TabPanel>
          ))
        }</TabView>
      )
    }
  </section>
}

function AddCompetition({
  newCompetitionName,
  setNewCompetitionName,
  addNewCompetition
}) {
  return <div>
    <InputText
      value={newCompetitionName}
      onChange={(e) => setNewCompetitionName(e.target.value)}
      placeholder="Enter competition name"
    />
    <Button label="Add Competition" onClick={addNewCompetition} />
  </div>
}

export default CompetitionsTabView;

