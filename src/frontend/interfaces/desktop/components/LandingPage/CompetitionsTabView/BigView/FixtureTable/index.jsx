// FixtureTable.js
import { useState, useEffect, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import chroma from "chroma-js";

import './FixtureTable.scss'; // Import the custom CSS

// Utility function to determine text color?.based on background brightness
const getTextColor = (bgColor) => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? '#000' : '#fff';
};

function FixtureTable({ 
  fixtures: initialFixtures,
  removeFields = [],
  participants = {},
  teams = [],
  umpires = [],
  referees = [],
  groupField = null
}) {
  const [fixtures, setFixtures] = useState(initialFixtures);
  // Synchronize fixtures state with initialFixtures prop
  useEffect(() => {
    setFixtures(initialFixtures);
  }, [initialFixtures]);

  // Handle cell edit completion
  const onCellEditComplete = (e) => {
    const { newValue, rowData, field } = e;
    let updatedFixtures = fixtures.map(fixture => 
      fixture.id === rowData.id ? { ...fixture, [field]: newValue } : fixture
    );
    setFixtures(updatedFixtures);
  };

  // Editor for Dropdown fields
  const dropdownEditor = (options, field, optionsList) => {
    const { rowData } = options;
    const currentValue = rowData[field];
    const dropdownOptions = optionsList.map(option => ({
      label: option,
      value: option
    }));

    // Ensure the current value is included in the options
    if (currentValue && !dropdownOptions.some(opt => opt.value === currentValue)) {
      dropdownOptions.push({ label: currentValue, value: currentValue });
    }

    const bgColor = participants[currentValue]?.base || '#ddd';
    const textColor = getTextColor(bgColor);

    return (
      <Dropdown
        value={currentValue}
        options={dropdownOptions}
        onChange={(e) => options.editorCallback(e.value)}
        className="p-column-filter"
        autoFocus
        style={{ 
          backgroundColor: bgColor, 
          color: textColor, 
          width: '100%' 
        }}
      />
    );
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

  const bodyTeamDisplay = (teamName, data) => {
    const bgColor = participants[data[teamName]]?.light || 'white';
    const fgColor = participants[data[teamName]]?.vdark || 'black';
    if (!data[teamName]) {
      const lightGrey = '#c3c3c3';
      const darkGrey = '#a9a9a9';
      const stripeSize = '20px';
      const style = {
        backgroundImage: `linear-gradient(45deg, ${lightGrey} 25%, transparent 25%, transparent 50%, ${lightGrey} 50%, ${lightGrey} 75%, transparent 75%, transparent),
              linear-gradient(45deg, ${darkGrey} 25%, transparent 25%, transparent 50%, ${darkGrey} 50%, ${darkGrey} 75%, transparent 75%, transparent)`,
        backgroundSize: `${stripeSize} ${stripeSize}`,
        textAlign: 'center',
        color: '#aaa',
        letterSpacing: '0.2em',
        fontWeight: 'bold',
        padding: '15px',
      }
      return <div className={'empty-team'} style={style}>EMPTY</div>
    } else {
      return (
        <a href="#" onClick={(e) => e.preventDefault()}>
          <div 
            className="team-cell-content" // Apply content class to inner <div>
            style={{ 
              backgroundColor: bgColor, 
              color: fgColor,
              fontWeight: 'bold',
              textAlign: 'left',
            }}
          >
            {data[teamName].toUpperCase()}
          </div>
        </a>
      );
    }
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
      style: { ...fixw('200px'), textAlign: 'right' },
      headerStyle: 'group', 
      sortable: true, 
      className: 'team-cell', // Assign custom class to <td>
      editor: (options) => dropdownEditor(options, 'team1', teams),
      body: bodyTeamDisplay.bind(null, 'team1'),
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
      style: { ...fixw('200px'), textAlign: 'left' },
      sortable: true, 
      className: 'team-cell', // Assign custom class to <td>
      editor: (options) => dropdownEditor(options, 'team2', teams),
      body: bodyTeamDisplay.bind(null, 'team2'),
    },
    { 
      field: "umpireTeam", 
      header: "Umpiring Team", 
      headerStyle: 'group',
      style: { ...fixw('150px') }, 
      sortable: true, 
      className: 'team-cell', // Assign custom class to <td>
      editor: (options) => dropdownEditor(options, 'umpireTeam', umpires),
      body: (data) => {
        const textColor = participants[data.umpireTeam]?.dark || 'white';
        return (
          <a href="#" onClick={(e) => e.preventDefault()}>
            <div 
              className="team-cell-content" // Apply content class to inner <div>
              style={{ 
                color: textColor, 
                fontWeight: 'bold',
              }}
            >{data.umpireTeam}</div>
          </a>
        )
      }
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
              {data.referee}
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

  console.log('columns:', columns);

  return (
    <section className="FixtureTable">
      <DataTable
        value={fixtures.map(x => ({
          ...x, 
          team1: parseCode(x.team1)?.friendly || x.team1,
          team2: parseCode(x.team2)?.friendly || x.team2,
        }))}
        dataKey="id"
        rowGroupMode='subheader'
        groupRowsBy={groupField}
        rowGroupHeaderTemplate={(data) => <div className='rowhead'>{`${groupField.toUpperCase()} ${data[groupField]}`}</div>}
        editMode="cell" 
        onCellEditComplete={onCellEditComplete}
        sortMode="multiple"
      >
        {columns.map((col, index) => (
          <Column
            key={index}
            field={col.field}
            header={col.header}
            editor={col.editor}
            className={col.className}
            headerStyle={col.headerStyle}
            style={col.style}
            body={col.body}
          />
        ))}
      </DataTable>
    </section>
  );
}

export default FixtureTable;

function parseCode(
  code
) {
  const result = {
    friendly: code,
  };

  if (code?.startsWith('~group')) {
      const [groupPart, placePart] = code.split('/p:');
      const groupNumber = parseInt(groupPart.split(':')[1], 10);
      const placeNumber = parseInt(placePart, 10);

      result.type = 'group';
      result.group = groupNumber;
      result.place = placeNumber;
      result.friendly = `${placeNumber}${placeNumber === 1 ? 'st' : placeNumber === 2 ? 'nd' : placeNumber === 3 ? 'rd' : 'th'} place in group ${groupNumber}`;
  } else if (code?.startsWith('~match')) {
      const [matchPart, placePart] = code.split('/p:');
      const matchNumber = parseInt(matchPart.split(':')[1], 10);
      const placeNumber = parseInt(placePart, 10);

      result.type = 'match';
      result.match = matchNumber;
      result.place = placeNumber;
      result.friendly = `${placeNumber === 1 ? 'winner' : 'loser'} of match ${matchNumber}`;
  }

  return result;
}

