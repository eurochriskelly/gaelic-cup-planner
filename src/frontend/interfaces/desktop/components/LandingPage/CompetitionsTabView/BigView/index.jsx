import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TabView, TabPanel } from 'primereact/tabview';
import { Accordion, AccordionTab } from 'primereact/accordion';
import TeamGroupings from "./TeamGroupings";
import FixtureTable from "./FixtureTable";
import StageSelector from "./StageSelector"
import { participantLookup } from "./colors";
import "@silevis/reactgrid/styles.scss";
import './BigView.scss';

const BigView = ({
  competition,
  pitches,
  venues,
  rules
}) => {
  const { groups = [] } = competition?.data
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const [fixtures, setFixtures] = useState([]);
  const base = `/tournament/${(tournamentId || 1)}`;

  // State for selected stages
  const [preliminaryStages, setPreliminaryStages] = useState([]);
  const [knockoutStages, setKnockoutStages] = useState([]);

  useEffect(() => {
    fetch(`/api/tournaments/${tournamentId}/fixtures`)
      .then((response) => response.json())
      .then((data) => {
        setFixtures(data.data
          .filter(x => x.category.toLowerCase() === competition.name.toLowerCase())
          .map(x => ({
            ...x,
            stageName: x.stage.split('_').shift(),
          }))
        )
      })
      .catch((error) => {
        console.error("Error fetching tournament info:", error);
      });
      setPreliminaryStages([
        rules?.preliminary?.groups && 'Group',
        rules?.preliminary?.playoffs && 'Playoffs',
      ].filter(x => x));
      setKnockoutStages([
        rules?.elimination?.brackets?.cup && 'Cup',
        rules?.elimination?.brackets?.shield && 'Shield',
        rules?.elimination?.brackets?.plate && 'Plate',
        rules?.elimination?.brackets?.spoon && 'Spoon',
      ].filter(x => x));
  }, []);

  const hname = (title, tag = 'users') => <span><i className={`pi pi-${tag}`}></i><span>{title}</span> </span>
  const order = ['cup', 'shd', 'plt', 'spn'];
  return <>
    <Accordion activeIndex={[0]}>
      <AccordionTab header={hname('Select Stages', 'tags')}>
        <StageSelector preliminaryStages={preliminaryStages} knockoutStages={knockoutStages} />
      </AccordionTab>
      <AccordionTab header={hname('Groups and Teams', 'users')}>
        <TeamGroupings
          competition={competition}
          participants={participantLookup(groups)}
          pitches={pitches}
          venues={venues} />
      </AccordionTab>
      <AccordionTab header={hname('Fixtures', 'calendar')}>
        <TabView>
          <TabPanel key={2} header="Groups">
            <FixtureTable
              fixtures={fixtures
                .filter(f => f.stage.toLowerCase() === 'group')
                .sort((a, b) => a.groupNumber - b.groupNumber)
              }
              groupField='groupNumber'
              removeFields={['groupNumber','stage', 'score1', 'score2']}
              participants={participantLookup(groups)}
              teams={groups.reduce((p, n) => [...p, ...n], [])}
              umpires={groups.reduce((p, n) => [...p, ...n], [])}
            />
          </TabPanel>
          {
            preliminaryStages.includes('Playoffs') && (
              <TabPanel key={2} header="Playoffs">
                <FixtureTable fixtures={fixtures} />
              </TabPanel>
            )
          }
          <TabPanel key={2} header="Knockouts">
            <FixtureTable
              fixtures={fixtures
                .filter(f => f.stage.toLowerCase() !== 'group')
                .sort((a, b) => {
                  const aPrefix = a.stage.split('_')[0];
                  const bPrefix = b.stage.split('_')[0];
                  return order.indexOf(aPrefix) - order.indexOf(bPrefix);
                })
              }
              groupField='stageName'
              removeFields={['groupNumber', 'stage', 'score1', 'score2']}
              participants={participantLookup(groups)}
              teams={groups.reduce((p, n) => [...p, ...n], [])}
            />
          </TabPanel>
          <TabPanel key={1} header="ALL">
            <FixtureTable 
              participants={participantLookup(groups)}
              fixtures={fixtures} />
          </TabPanel>
        </TabView>
      </AccordionTab>
    </Accordion>
  </>
};

export default BigView;

