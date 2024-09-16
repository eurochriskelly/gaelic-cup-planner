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
        setFixtures(data.data.filter(x => x.category.toLowerCase() === competition.name.toLowerCase()))
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
  console.log('preliminaryStages:', preliminaryStages)
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
          {
            preliminaryStages.includes('Group') && (
                <TabPanel key={2} header="Groups">{
                    groups?.map((group, index) => {
                      const filtered = fixtures
                            .filter(f => f.groupNumber === (index + 1))
                            .filter(f => f.stage.toLowerCase() === 'group');
                      return <>
                        <h3>Group {index + 1}</h3>
                        <FixtureTable
                          fixtures={filtered}
                          removeFields={['groupNumber', 'stage', 'score1', 'score2']}
                          participants={participantLookup(groups)}
                          teams={groups[index]}
                          umpires={groups.reduce((p, n) => [...p, ...n], [])}
                          group={group}
                        />
                      </>
                  })
                }</TabPanel>
            )
          }
          {
            preliminaryStages.includes('Playoffs') && (
              <TabPanel key={2} header="Playoffs">
                <FixtureTable fixtures={fixtures} />
              </TabPanel>
            )
          }
          <TabPanel key={2} header="Knockouts">
            <FixtureTable
              removeFields={['groupNumber', 'stage', 'score1', 'score2']}
              participants={participantLookup(groups)}
              fixtures={fixtures.filter(f => f.stage.toLowerCase() !== 'group')}
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

