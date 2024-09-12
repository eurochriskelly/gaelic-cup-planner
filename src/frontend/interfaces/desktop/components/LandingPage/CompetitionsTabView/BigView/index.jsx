import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { TabView, TabPanel } from 'primereact/tabview';
import TeamGroupings from "./TeamGroupings";
import FixtureTable from "./FixtureTable";
import "@silevis/reactgrid/styles.scss";
import './BigView.scss';

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
            <FixtureTable fixtures={
              fixtures.filter(f => f.stage.toLowerCase() !== 'group')
            } />
          </TabPanel>
          <TabPanel key={1} header="ALL">
            <FixtureTable fixtures={fixtures} />
          </TabPanel>
        </TabView>
      </div>
    </section>
  </>
};



export default BigView;

