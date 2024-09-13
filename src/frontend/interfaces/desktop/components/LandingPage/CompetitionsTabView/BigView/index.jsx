import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { TabView, TabPanel } from 'primereact/tabview';
import TeamGroupings from "./TeamGroupings";
import FixtureTable from "./FixtureTable";
import "@silevis/reactgrid/styles.scss";
import './BigView.scss';

const COLOR_LIST = [
  '#FFCDD2', '#F8BBD0', '#E1BEE7', '#D1C4E9', '#C5CAE9',
  '#BBDEFB', '#B3E5FC', '#B2EBF2', '#B2DFDB', '#C8E6C9',
  '#DCEDC8', '#F0F4C3', '#FFF9C4', '#FFECB3', '#FFE0B2',
  '#FFCCBC', '#D7CCC8', '#CFD8DC', '#F5F5F5', '#E0E0E0',
  '#BDBDBD', '#9E9E9E', '#757575', '#616161', '#424242',
  '#212121', '#F44336', '#E91E63', '#9C27B0', '#673AB7',
  '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688',
  '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107',
  '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B',
  '#FF8A80', '#EA80FC', '#8C9EFF', '#80D8FF', '#A7FFEB'
  // Add more colors if needed
];

const BigView = ({
  competition,
  pitches,
  venues
}) => {
  const { groups = [] } = competition?.data
  const navigate = useNavigate();
  const { tournamentId, category } = useParams();
  const [fixtures, setFixtures] = useState([]);
  const base = `/tournament/${(tournamentId || 1)}`;
  const jump = { design: () => navigate(`${base}/selectCategory`) };

  useEffect(() => {
    fetch(`/api/tournaments/${tournamentId}/fixtures`)
      .then((response) => response.json())
      .then((data) => {
        setFixtures(data.data.filter(x => x.category.toLowerCase() === competition.name.toLowerCase()))
      })
      .catch((error) => {
        console.error("Error fetching tournament info:", error);
      });
  }, []);

  // Utility function to create the participants object
  const createParticipants = (teams, colorList) => {
    const participants = {};
    teams.forEach((team, index) => {
      participants[team] = colorList[index % colorList.length];
    });
    return participants;
  };

  return <>
    <section>
      <div>
        <h2>
          <i className="pi pi-check"></i>
          <span>Define competition groups</span>
        </h2>
        <TeamGroupings
          competition={competition}
          pitches={pitches}
          venues={venues} />
      </div>
      <div>
        <h2>Organize Fixtures</h2>
        <TabView>
          <TabPanel key={2} header="Groups">{
              groups?.map((group, index) => {
                const filtered = fixtures
                      .filter(f => f.groupNumber === (index + 1))
                      .filter(f => f.stage.toLowerCase() === 'group');
                return <>
                  <h3>Group {index + 1}</h3>
                  <FixtureTable
                    fixtures={filtered}
                    removeFields={['groupNumber', 'stage']}
                    participants={createParticipants(groups.reduce((p, n) => [...p, ...n], []), COLOR_LIST)}
                    teams={groups[index]}
                    umpires={groups.reduce((p, n) => [...p, ...n], [])}
                    group={group}
                  />
                </>
            })
          }</TabPanel>
          <TabPanel key={2} header="Playoffs">
            <FixtureTable fixtures={fixtures} />
          </TabPanel>
          <TabPanel key={2} header="Knockouts">
            <FixtureTable
              participants={createParticipants(groups.reduce((p, n) => [...p, ...n], []), COLOR_LIST)}
              fixtures={fixtures.filter(f => f.stage.toLowerCase() !== 'group')}
            />
          </TabPanel>
          <TabPanel key={1} header="ALL">
            <FixtureTable 
              participants={createParticipants(groups.reduce((p, n) => [...p, ...n], []), COLOR_LIST)}
              fixtures={fixtures} />
          </TabPanel>
        </TabView>
      </div>
    </section>
  </>
};



export default BigView;

