import { useState} from "react";
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import './TeamGroupings.scss';

function TeamGroupings({
  competition,
  pitches,
  venues
}) {
  console.log('TeamGroupings:', competition, "xx", pitches, "yy", venues);
  const { name, code, teams = [], data, ready } = competition;

  const [groups, setGroups] = useState([
    { key: "G1", teams: [], ready: false },
    { key: "G2", teams: [], ready: false },
    { key: "G3", teams: [], ready: false },
    { key: "G4", teams: [], ready: false },
    { key: "G5", teams: [], ready: false },
    { key: "G6", teams: [], ready: false },
    { key: "G6", teams: [], ready: false },
  ]);
  const getColumns = () => [
    { columnId: "group", width: 100 },
    { columnId: "A", width: 190 },
    { columnId: "B", width: 190 },
    { columnId: "C", width: 190 },
    { columnId: "D", width: 190 },
    { columnId: "E", width: 190 },
    { columnId: "F", width: 190 },
  ];
  const getRows = () => {
    if (!teams || teams.length === 0) return []
    return [
      ...teams
        .map((group, id) => {
          return { 
            id, 
            group: `G${id+1}`, 
            A: group[0] || "",
            B: group[1] || "",
            C: group[2] || "",
            D: group[3] || "",
            E: group[4] || "",
            F: group[5] || "",
          }
        })
    ]
  }
  const textEditor = (options) => {
    return <InputText
      type="text" value={options.value}
      onChange={(e) => options.editorCallback(e.target.value)}
      onKeyDown={(e) => e.stopPropagation()}
    />;
  };
  const onCellEditComplete = (e) => {
    const newgroups = groups
      .map((group) => {
        if (group.key === e.newRowData?.group) {
          group.teams = [
            e.newRowData.team1,
            e.newRowData.team2,
            e.newRowData.team3,
            e.newRowData.team4,
            e.newRowData.team5,
            e.newRowData.team6,
          ].filter(x => x)
        }
        return group;
      });
    setGroups(newgroups);
  }
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return (
    <section className="TeamGroupings"> 
      <DataTable value={getRows()} size={'large'} editMode={'cell'} tableStyle={{ minWidth: '50rem' }}>{
        getColumns().map((col, index) => {
          return <Column 
            key={`dc-col-${index}`} field={col.columnId} 
            header={capitalize(col.columnId)}
            editor={(options) => textEditor(options)} 
            onCellEditComplete={onCellEditComplete} 
            style={{ width: `${col.width}px` }} />
        })
      }</DataTable>
    </section>
  )
}

export default TeamGroupings;
