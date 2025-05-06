import { useRef } from 'react';
import { useAppContext } from "../../../../shared/js/Provider";

import TournamentInfo from "./TournamentInfo";
import { TabView, TabPanel } from 'primereact/tabview';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import TeamsTabView from './TeamsTabView';
import VenuesTabView from './VenuesTabView';
import CompetitionsTabView from './CompetitionsTabView';

import './LandingPage.scss';

export default LandingPage;

function LandingPage () {
  const { tournamentId } = useAppContext();
  const toast= useRef(null);

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

  return (
    <main className={`desktop LandingPage`}>
      <header className='flex flex-column md:flex-row justify-content-between my-5'>
        <h1 className='mr-1' style={{marginRight: '10px'}}>Pitch Perfect</h1>
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
          <TabPanel header="Venues">
            <VenuesTabView />
          </TabPanel>
          <TabPanel header="Team Management">
            <TeamsTabView />
          </TabPanel>
          <TabPanel header="Competitions">
            <CompetitionsTabView />
          </TabPanel>
        </TabView>
      </section>
    </main>
  );
};

function UploadCsv() {
  const onUpload = ({ files }) => {
    // Assuming the first file is the one you want to read
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      // Define the onload event handler
      reader.onload = (event) => {
        const fileContent = event.target.result;
        console.table(fileContent.split('\n').map(line => line.split(';')));
      };
      // Read the file as text
      reader.readAsText(file);
    }
  };
  return (
    <div>
      <FileUpload
        name="schedule"
        customUpload={true}
        uploadHandler={onUpload}
        mode="basic"
        accept=".csv"
        auto={true}
        maxFileSize={1000000} // 1MB
        chooseLabel="Select CSV"
      />
    </div>
  );
};
