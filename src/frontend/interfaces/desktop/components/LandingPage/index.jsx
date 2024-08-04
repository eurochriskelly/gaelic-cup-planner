import { useState, useRef } from 'react';
import { useAppContext } from "../../../../shared/js/Provider";
import BigView from '../BigView';
import TournamentInfo from "./TournamentInfo";
import { TabView, TabPanel } from 'primereact/tabview';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import TeamsTabView from './TeamsTabView';

import './LandingPage.scss';

export default LandingPage;

function LandingPage () {
  const { tournamentId } = useAppContext();
  const toast= useRef(null);

  ////////////
  const uploadHandler = ({ files }) => {
    console.log('Uploading files:', files);
    // Process files here
    uploadFile(files);
  };

  const uploadFile = (files) => {
    // Your logic to handle files
    // For example, reading file data and processing it
    const reader = new FileReader();
    reader.onload = (event) => {
      console.log('File content:', event.target.result);
      // Further processing of file content
    };
    reader.readAsText(files[0]);
  };
  /////////
  return (
    <main className={`.desktop LandingPage`}>
      <header className='flex flex-column md:flex-row justify-content-between my-5'>
        <h1 className='mr-3'>Pitch Perfect</h1>
        <button className='btn btn-primary' onClick={() => console.log('fee')}>Save</button>
        <div>
          <Toast ref={toast} />
          <UploadCsv />
        </div>
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


function UploadCsv() {
    const onUpload = (e) => {
        console.log('File uploaded:', e.files);
    };

    return (
        <div>
            <h2>Upload CSV</h2>
            <FileUpload
                name="file"
                url="/api/upload"
                onUpload={onUpload}
                accept=".csv"
                maxFileSize={1000000} // 1MB
                chooseLabel="Select CSV"
                uploadLabel="Upload"
            />
        </div>
    );
};
