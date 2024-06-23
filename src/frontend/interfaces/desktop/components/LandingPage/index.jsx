import { useState } from 'react';
import { useAppContext } from "../../../../shared/js/Provider";
import BigView from '../BigView';
import TournamentInfo from "./TournamentInfo";
import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import TeamsTabView from './TeamsTabView';
import './LandingPage.scss';

export default LandingPage;

function LandingPage () {
  const { tournamentId } = useAppContext();
  return (
    <main className={`.desktop LandingPage`}>
      <header>
        <h1>Pitch Perfect</h1>
      </header>
      <section>
        <TabView>
          <TabPanel header="Tournament Info">
            <TournamentInfo tournamentId={tournamentId} />
          </TabPanel>
          <TabPanel header="Teams">
            <TeamsTabView />
          </TabPanel>
          <TabPanel header="Competitions">
            <CompetitionsTabView />
          </TabPanel>
          <TabPanel header="Fixtures">
            <FixturesTabView />
          </TabPanel>
          <TabPanel header="Pitches">
            <PitchTabView />
          </TabPanel>
        </TabView>
      </section>
    </main>
  );
};

function PitchTabView() {
  return (
    <div>foo</div> 
  );
}

function FixturesTabView() {
  return (
    <TabView>
      <TabPanel header="By Competition">
        <ByCompetition />
      </TabPanel>
      <TabPanel header="By Pitch">
        <ByPitch />
      </TabPanel>
    </TabView>
  );
}

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

function CompetitionsTabView() {
  return (
    <div>foo</div> 
  );
}