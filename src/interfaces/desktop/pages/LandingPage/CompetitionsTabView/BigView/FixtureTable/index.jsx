// FixtureTable.js
import { useState, useEffect, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import chroma from "chroma-js";
import TeamSelect, { parseCode } from './TeamSelect';
import { DialogPickTeam } from './DialogTeam';
import './FixtureTable.scss';

function FixtureTable({ 
  fixtures: initialFixtures,
  removeFields = [],
  participants = {},
  groups = [],
  teams = [],
  umpires = [],
  referees = [],
  groupField = null
}) {
  console.log('values:', initialFixtures, 
    'teams', teams, 
    'umpires', umpires, 
    'referees', referees, 
    'groups', groups,
    'groupField', groupField
  );
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [expandedRows, setExpandedRows] = useState([]);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [dialogData, setDialogData] = useState(null);

  // Synchronize fixtures state with initialFixtures prop
  useEffect(() => {
    setFixtures(initialFixtures);
  }, [initialFixtures]);

  const openDialog = (rowData, field, optionsList) => {
    const obj = {
      rowData,
      field,
      isCalcField: rowData[field]?.startsWith('~'),
      optionsList
    }
    if (rowData.groupNumber) {
      console.log('field', field)
      if (field.startsWith('team')) {
        obj.groupTeams = groups[rowData.groupNumber - 1];
      } else {
        obj.groupTeams = teams
      }
    }
    setDialogData(obj);
    setVisibleDialog(true);
  };

  // Handle cell edit completion
  const onCellEditComplete = (e) => {
    const { newValue, rowData, field } = e;
    let updatedFixtures = fixtures.map(fixture => 
      fixture.id === rowData.id ? { ...fixture, [field]: newValue } : fixture
    );
    setFixtures(updatedFixtures);
  };

  // Editor for text fields
  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
        autoFocus
        style={{ width: '100%' }}
      />
    );
  };

  const showScore = (data, teamNr = 1) => {
    const g = data[`goals${teamNr}`];
    const p = data[`points${teamNr}`];
    const score = (g && p) ? (3 * g) + p : '##'
    const strs = [
      g || '#',
      '-',
      p ? ('0' + data[`points${teamNr}`]).substr(-2) : '##',
      ` / `,
      score
    ]
    return <div className={``}>{strs.join('')}</div>;
  }

  // Define columns with sorting and editors
  const fixw = w => ({ width: w, minWidth: w, maxWidth: w });
  const columns = [
    { 
      field: "id", 
      header: "#", 
      style: { ...fixw('40px') }, 
      sortable: true, 
      body: (data) => `${data.id}`.substring(2) 
    },
    { 
      field: "scheduledTime", 
      header: "Time", 
      style: { ...fixw('70px') }, 
      headerStyle: 'group', 
      sortable: true 
    },
    { 
      field: "team1", 
      header: "Team 1", 
      style: { ...fixw('200px'), textAlign: 'center' },
      headerStyle: 'group', 
      sortable: true, 
      className: 'team-cell', // Assign custom class to <td>
      body: (data) => <TeamSelect 
        openDialog={openDialog}
        rowData={data} 
        field='team1'
        participants={participants}
        optionsList={teams}
      />
    },
    { 
      field: "score1", 
      header: "Score", 
      headerStyle: 'group', 
      style: { ...fixw('75px'), backgroundColor: '#eee', padding: '0', textAlign: 'center' },
      body: (data) => showScore(data, 1) 
    },
    { 
      field: "score2", 
      header: "Score", 
      headerStyle: 'group', 
      style: { ...fixw('75px'), backgroundColor: '#eee', padding: '0', textAlign: 'center' },
      body: (data) => showScore(data, 2)
    },
    { 
      field: "team2", 
      header: "Team 2", 
      headerStyle: 'group', 
      style: { ...fixw('200px'), textAlign: 'center' },
      sortable: true, 
      className: 'team-cell', // Assign custom class to <td>
      body: (data) => <TeamSelect 
        openDialog={openDialog}
        rowData={data} 
        field='team2'
        participants={participants}
        optionsList={teams}
      />
    },
    { 
      field: "umpireTeam", 
      header: "Umpiring Team", 
      headerStyle: 'group',
      style: { ...fixw('150px') }, 
      sortable: true, 
      className: 'team-cell', // Assign custom class to <td>
      body: (data) => <TeamSelect 
        openDialog={openDialog}
        rowData={data} 
        field='umpireTeam'
        participants={participants}
        optionsList={teams}
      />
    },
    { 
      field: "pitch", 
      header: "Pitch", 
      style: { ...fixw('70px') }, 
      sortable: true, 
      editor: textEditor 
    },
    { 
      field: "stage", 
      header: "Stage", 
      style: { width: '120px' }, 
      sortable: true, 
      editor: textEditor 
    },
    { 
      field: "groupNumber", 
      header: "#", 
      style: { width: '50px' }, 
      sortable: true 
    },
    { 
      field: "referee", 
      header: "Referee", 
      style: { width: '150px' }, 
      sortable: true, 
      className: 'team-cell', // Assign custom class to <td>
      editor: (options) => dropdownEditor(options, 'referee', referees),
      body: (data) => {
        return (
          <a href="#" onClick={(e) => e.preventDefault()}>
            <div 
              className="team-cell-content" // Apply content class to inner <div>
              style={{ backgroundColor: '#eee' }}
            >
              {data.referee || '-'}
            </div>
          </a>
        );
      }
    },
  ]
    .filter(col => !removeFields.includes(col.field))
    .map(x => {
      if (!x.headerStyle) x.headerStyle = x.style
      if (x.headerStyle === 'group') x.headerStyle = {
        ...x.style,
        backgroundColor: '#7a989d',
        textAlign: 'center',
        padding: '0.4rem',
        borderRight: '1px solid #ccc',
        color: 'white'
      };
      const col = chroma('#00b6d4').darken(1.5).hex();
      return {
        ...x,
        headerStyle: { 
          ...x.headerStyle,
          borderBottom: `4px solid ${col}`,
          textAlign: 'center',
        }
      };
    })

  return (
    <section className="FixtureTable">
      <DataTable
        dataKey="id"
        value={fixtures.map(x => ({
          ...x, 
          team1Friendly: parseCode(x.team1)?.friendly,
          team2Friendly: parseCode(x.team2)?.friendly,
          umpireTeamFriendly: parseCode(x.umpireTeam)?.friendly,
        }))}
        expandedRows={expandedRows}
        rowGroupMode='subheader'
        groupRowsBy={groupField}
        rowGroupHeaderTemplate={(data) => <div className='rowhead'>{
          `${groupField.toUpperCase()} ${data[groupField]}`
        }</div>}
        editMode="cell" 
        onCellEditComplete={onCellEditComplete}
        sortMode="multiple"
      >{
        columns.map((col, index) => (
          <Column
            key={index + 1}
            field={col.field}
            header={col.header}
            editor={col.editor}
            className={col.className}
            headerStyle={col.headerStyle}
            style={
              index === 0 
              ? { background: 'a0b7bb'} 
              : col.style
            }
            body={col.body}
          />
      ))}</DataTable>

      {/* Dialog Component */}
      <Dialog header={dialogData?.isCalcField ? 'Team selection rule' : 'Modify fixture'} visible={visibleDialog} onHide={() => setVisibleDialog(false)}>{
        <DialogPickTeam data={dialogData} current={'Luxembourg A'} onHide={() => setVisibleDialog(false)} />
      }</Dialog>
    </section>
  );
}

export default FixtureTable;
