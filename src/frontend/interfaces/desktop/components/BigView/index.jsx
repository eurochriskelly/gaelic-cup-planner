import { useEffect, useState, useTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ReactGrid } from "@silevis/reactgrid";
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import "@silevis/reactgrid/styles.scss";
import './BigView.scss';

const BigView = ({
  competition,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tournamentId, category } = useParams();
  const [fixtures, setFixtures] = useState([]);
  const base = `/tournament/${(tournamentId || 1)}`;
  const jump = {
    design: () => navigate(`${base}/selectCategory`),
  };

  useEffect(() => {
    fetch(`/api/tournaments/${tournamentId}/fixtures`)
      .then((response) => response.json())
      .then((data) => {
        console.log(`Fetched fixtures for ${competition.name}:`)
        setFixtures(data.data.filter(x => x.category.toLowerCase() === competition.name.toLowerCase()))
      })
      .catch((error) => {
        console.error("Error fetching tournament info:", error);
      });
  }, []);

  return (
    <section>
      <h1>Competitions</h1>
      <div>
        <h2>Groups</h2>
        <TeamGroups />
      </div>
      <div>
        <h2>Fixtures</h2>
        <TabView>
          <TabPanel key={1} header="ALL">
            <FixtureTable fixtures={fixtures} />
          </TabPanel>
          <TabPanel key={2} header="Groups">
            <FixtureTable fixtures={fixtures} />
          </TabPanel>
          <TabPanel key={2} header="Playoffs">
            <FixtureTable fixtures={fixtures} />
          </TabPanel>
          <TabPanel key={2} header="Playoffs">
            <FixtureTable fixtures={fixtures} />
          </TabPanel>
        </TabView>
      </div>
    </section>
  );
};

function FixtureTable({ fixtures }) {
  const getColumns = () => [
    { columnId: "id", width: 50 },
    { columnId: "time", width: 50 },
    { columnId: "pitch", width: 90 },
    { columnId: "stage", width: 120 },
    { columnId: "grp", width: 20 },
    { columnId: "team1", width: 150 },
    { columnId: "goals1", width: 20 },
    { columnId: "points1", width: 30 },
    { columnId: "score1", width: 30 },
    { columnId: "score2", width: 30 },
    { columnId: "goals2", width: 20 },
    { columnId: "points2", width: 30 },
    { columnId: "team2", width: 150 },
    { columnId: "umpireTeam", width: 150 },
  ];

  const headerRow = {
    rowId: "header",
    cells: [
      { type: "header", text: "Match" },
      { type: "header", text: "Time" },
      { type: "header", text: "Pitch" },
      { type: "header", text: "Stage" },
      { type: "header", text: "#" },
      { type: "header", text: "Team 1" },
      { type: "header", text: "G" },
      { type: "header", text: "P" },
      { type: "header", text: "T" },
      { type: "header", text: "T" },
      { type: "header", text: "G" },
      { type: "header", text: "P" },
      { type: "header", text: "Team 2" },
      { type: "header", text: "Umpiring" },
    ]
  };

  const getRows = (fixtures) => [
    headerRow,
    ...fixtures.map((fixture, idx) => {
      const { id, pitch, groupNumber, scheduledTime, team1, goals1, points1, stage, goals2, points2, team2, umpireTeam } = fixture;
      const teamOptions = [
        {
          label: 'Foo',
          value: 'Foo',
        },
        {
          label: 'Bar',
          value: 'Bar',
        },
        {
          label: team1,
          value: team1,
        }
      ]
      return {
        rowId: idx,
        cells: [
          { type: "text", text: `${id}`.substring(2)},
          { type: "text", text: scheduledTime },
          { type: "text", text: pitch },
          { type: "text", text: stage },
          { type: "text", text: `${groupNumber}`},
          { type: "dropdown", values: teamOptions, selectedValue: team1},
          { type: "text", text: `${goals1}`},
          { type: "text", text: `0${points1}`.substr(-2) },
          { type: "text", text: `${points1 + (3 * goals1)}` },
          { type: "text", text: `${points2 + (3 * goals2)}` },
          { type: "text", text: `${goals2}` },
          { type: "text", text: `0${points2}`.substr(-2) },
          { type: "text", text: team2 },
          { type: "text", text: umpireTeam },
        ]
      }
    })
  ];
  const rows = getRows(fixtures);
  const columns = getColumns();
  return <ReactGrid rows={rows} columns={columns} />
}

function TeamGroups() {
  const [mostTeams, setMostTeams] = useState(1);
  const [groups, setGroups] = useState([
    { key: "A", teams: [], ready: false },
    { key: "B", teams: [], ready: false },
    { key: "C", teams: [], ready: false },
    { key: "D", teams: [], ready: false },
    { key: "E", teams: [], ready: false },
    { key: "F", teams: [], ready: false },
    { key: "G", teams: [], ready: false },
  ]);
  const getColumns = () => [
    { columnId: "group", width: 100 },
    { columnId: "team1", width: 190 },
    { columnId: "team2", width: 190 },
    { columnId: "team3", width: 190 },
    { columnId: "team4", width: 190 },
    { columnId: "team5", width: 190 },
    { columnId: "team6", width: 190 },
  ];
  const getRows = () => [
    ...groups 
      .filter((x, i, lst) => {
        if (i) console.log(lst[i - 1])
        return i ? lst[i-1].teams.length : true
      })
      .map((group, id) => {
        return { 
          id, 
          group: group.key,
          team1: group.teams[0],
          team2: group.teams[1],
          team3: group.teams[2],
          team4: group.teams[3],
          team5: group.teams[4],
          team6: group.teams[5],
        }
      })
  ]
  const textEditor = (options) => {
    return <InputText
      type="text" value={options.value}
      onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()} />;
  };
  const cellEditor = (options) => {
    if (options.field === 'price') return priceEditor(options);
    else return textEditor(options);
  }
  const onCellEditComplete = (e) => {
    console.log(e)
    const newgroups = groups.map((group) => {
      if (group.key === e.data?.group) {
        group.teams = e.data;
      }
      return group;
    });
    setGroups(newgroups);
  }
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return (
    <DataTable value={getRows()} size={'large'} editMode={'cell'} tableStyle={{ minWidth: '50rem' }}>
      {
        getColumns().map((col) => {
          return <Column 
            key={col.columnId} field={col.columnId} 
            header={capitalize(col.columnId)}
            editor={(options) => cellEditor(options)} 
            onCellEditComplete={onCellEditComplete} 
            style={{ width: `${col.width}px` }} />
        })
      }
    </DataTable>
  )
}

export default BigView;

