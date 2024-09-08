import { useState} from "react";
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';

function TeamGroupings() {
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
      onChange={(e) => options.editorCallback(e.target.value)} onKeyDown={(e) => e.stopPropagation()}
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
    <DataTable value={getRows()} size={'large'} editMode={'cell'} tableStyle={{ minWidth: '50rem' }}>
      {
        getColumns().map((col) => {
          return <Column 
            key={col.columnId} field={col.columnId} 
            header={capitalize(col.columnId)}
            editor={(options) => textEditor(options)} 
            onCellEditComplete={onCellEditComplete} 
            style={{ width: `${col.width}px` }} />
        })
      }
    </DataTable>
  )
}

export default TeamGroupings;
