import { useState } from 'react';
import { useAppContext } from "../../../../shared/js/Provider";
import BigView from '../BigView';
import TournamentInfo from "./TournamentInfo";
import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import './LandingPage.scss';

export default LandingPage;

function LandingPage () {
  const { tournamentId } = useAppContext();
  return (
    <main className={`.desktop LandingPage`}>
      <header>
        <TournamentInfo tournamentId={tournamentId} />
      </header>
      <section>
        <TabView>
          <TabPanel header="By competition">
            <ByCompetition />
          </TabPanel>
          <ByPitch />
          <TabPanel header="By pitch">
            <ByPitch />
          </TabPanel>
        </TabView>
      </section>
    </main>
  );
};

function ByCompetition() {
  const [selectedCompetition, setSelectedCompetition] = useState('Mens');
  const [competitions, setCompetitions] = useState([
    { name: "Mens", code: "Mens" },
    { name:"Womens", code: "Womens" },
    { name:"Youth", code: "Youth"},
  ]);
  return (
    <>
      <Dropdown 
        value={selectedCompetition} 
        onChange={(e) => setSelectedCity(e.value)}
        options={competitions} 
        optionLabel="name" 
        placeholder="Select a competition" 
        className="w-full md:w-14rem" />
      <BigView />
    </>
  );
}

function ByPitch () {
  return (
    <>
      <div>ok</div>
    </>
  );
}
