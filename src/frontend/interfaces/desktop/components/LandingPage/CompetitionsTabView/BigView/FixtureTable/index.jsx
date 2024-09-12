import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

function FixtureTable({ 
  fixtures,
  removeFields = [],
  teams = [],
  umpires = [],
  referees = []
}) {
  console.log('referees', referees)
  const teamBody = (name, teamList, rowData) => {
    const teamOptions = teamList.map(team => {
      return { label: team, value: team };
    })
    const options = teamList.includes(rowData[name])
      ? teamOptions
      : [...teamOptions, { label: rowData[name], value: rowData[name]}]
    return (
      <Dropdown
        value={rowData[name]}
        options={options}
        onChange={(e) => {
          console.log('this is it')
        }}
      />
    );
  }

  const textEditor = (options) => {
    return <InputText
      type="text" value={options.value}
      onChange={(e) => options.editorCallback(e.target.value)}
      onKeyDown={(e) => e.stopPropagation()}
    />;
  };

  const columns = [
    { field: "id", header: "M#", style: { width: '30px', maxWidth: '40px' }, body: (data) => `${data.id}`.substring(2) },
    { field: "scheduledTime", header: "Time", style: { width: '50px' } },
    { field: "pitch", header: "Pitch", style: { width: '110px', minWidth: '90px' } },
    { field: "stage", header: "Stage", style: { width: '120px' } },
    { field: "groupNumber", header: "#", style: { width: '20px' } },
    { field: "team1", header: "Team 1", style: { width: '150px' },
      // body: teamBody.bind(null, 'team1', teams) 
    },
    { field: "goals1", header: "G", style: { width: '20px' } },
    { field: "points1", header: "P", style: { width: '30px' }, body: (data) => `0${data.points1}`.substr(-2) },
    { field: "score1", header: "T", style: { width: '30px' }, body: (data) => `${data.points1 + (3 * data.goals1)}` },
    { field: "team2", header: "Team 2", style: { width: '150px' }, 
      // body: teamBody.bind(null, 'team2', teams)
    },
    { field: "goals2", header: "G", style: { width: '20px' } },
    { field: "points2", header: "P", style: { width: '30px' }, body: (data) => `0${data.points2}`.substr(-2) },
    { field: "score2", header: "T", style: { width: '30px' }, body: (data) => `${data.points2 + (3 * data.goals2)}` },
    { field: "umpireTeam", header: "Umpiring Team", style: { width: '150px' }, 
       // body: teamBody.bind(null, 'umpireTeam', umpires)
    },
    { field: "referee", header: "Referee", style: { width: '150px' }, 
      // body: teamBody.bind(null, 'referee', referees)
    },
  ].map(col => {
    return {
      ...col,
      fnEditComplete: (e) => {
        console.log('edit complete', e)
      },
      fnEditor: (options) => textEditor(options)
    }
  })

  // Filter out columns that are in the removeFields list

  const filteredColumns = columns.filter(col => !removeFields.includes(col.field));

  return <section className="FixtureTable">
    <DataTable value={fixtures} responsiveLayout="scroll">
      {filteredColumns.map((col, index) => (
        <Column
          key={index}
          field={col.field}
          header={col.header}
          editor={col.fnEditor} 
          onCellEditComplete={col.fnEditComplete}
          style={col.style}
          body={col.body}
        />
      ))}
    </DataTable>
  </section>
}

export default FixtureTable;
