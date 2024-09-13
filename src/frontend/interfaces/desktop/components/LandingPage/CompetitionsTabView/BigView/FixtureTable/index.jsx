// FixtureTable.js
import { useState, useEffect, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';  // Adjust theme as needed
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './FixtureTable.scss'; // Import the custom CSS

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

// Utility function to determine text color based on background brightness
const getTextColor = (bgColor) => {
  // Remove the hash symbol if present
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
  teams = [],
  umpires = [],
  referees = []
}) {
  const [fixtures, setFixtures] = useState(initialFixtures);

  // Synchronize fixtures state with initialFixtures prop
  useEffect(() => {
    setFixtures(initialFixtures);
  }, [initialFixtures]);

  // Generate a unique list of teams from fixtures, teams, umpires, referees
  const uniqueTeams = useMemo(() => {
    const teamSet = new Set();

    // Add teams from fixtures
    fixtures.forEach(fixture => {
      if (fixture.team1) teamSet.add(fixture.team1);
      if (fixture.team2) teamSet.add(fixture.team2);
      if (fixture.umpireTeam) teamSet.add(fixture.umpireTeam);
      if (fixture.referee) teamSet.add(fixture.referee);
    });

    // Add teams from props to ensure all possible teams are covered
    teams.forEach(team => teamSet.add(team));
    umpires.forEach(umpire => teamSet.add(umpire));
    referees.forEach(ref => teamSet.add(ref));

    return Array.from(teamSet);
  }, [fixtures, teams, umpires, referees]);

  // Assign a unique color to each team
  const teamColorMap = useMemo(() => {
    const map = {};
    uniqueTeams.forEach((team, index) => {
      map[team] = COLOR_LIST[index % COLOR_LIST.length];
    });
    return map;
  }, [uniqueTeams]);

  // Debugging: Log uniqueTeams and teamColorMap
  useEffect(() => {
    console.log('Unique Teams:', uniqueTeams);
    console.log('Team Color Map:', teamColorMap);
  }, [uniqueTeams, teamColorMap]);

  // Handle cell edit completion
  const onCellEditComplete = (e) => {
    const { newValue, rowData, field } = e;
    console.log('Edit Complete:', e);
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

    // Get the background color based on the current value
    const bgColor = teamColorMap[currentValue] || '#fff';
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
        }} // Inherit background and text color
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
    return <div className={``}>{[
      g || '#',
      '-',
      p ? ('0' + data[`points${teamNr}`]).substr(-2) : '##',
      `/`,
      score
    ].join('')}</div>;
  }

  // Define columns with sorting and editors
  const fixw = w => ({ width: w, minWidth: w, maxWidth: w })
  const columns = [
    { 
      field: "id", 
      header: "M#", 
      style: { ...fixw('40px') }, 
      sortable: true, 
      body: (data) => `${data.id}`.substring(2) 
    },
    { 
      field: "scheduledTime", 
      header: "Time", 
      style: { ...fixw('70px') }, 
      sortable: true 
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
      field: "team1", 
      header: "Team 1", 
      style: { width: '150px' }, 
      sortable: true, 
      className: 'team-cell', // Assign custom class to <td>
      editor: (options) => dropdownEditor(options, 'team1', teams),
      body: (data) => {
        const bgColor = teamColorMap[data.team1] || '#fff';
        const textColor = getTextColor(bgColor);
        return (
          <a href="#" onClick={(e) => e.preventDefault()}>
            <div 
              className="team-cell-content" // Apply content class to inner <div>
              style={{ 
                backgroundColor: bgColor, 
                color: textColor 
              }}
            >
              {data.team1}
            </div>
          </a>
        );
      }
    },
    { 
      field: "score1", 
      header: "Score", 
      style: { width: '70px', minWidth: '70px', maxWidth: '70px', backgroundColor: '#eee', padding: '0', textAlign: 'center' },
      headerStyle: { width: '70px', minWidth: '70px', maxWidth: '70px', backgroundColor: 'white' },
      body: (data) => showScore(data, 1) 
    },
    { 
      field: "team2", 
      header: "Team 2", 
      style: { width: '150px' }, 
      sortable: true, 
      className: 'team-cell', // Assign custom class to <td>
      editor: (options) => dropdownEditor(options, 'team2', teams),
      body: (data) => {
        const bgColor = teamColorMap[data.team2] || '#fff';
        const textColor = getTextColor(bgColor);
        return (
          <a href="#" onClick={(e) => e.preventDefault()}>
            <div 
              className="team-cell-content" // Apply content class to inner <div>
              style={{ 
                backgroundColor: bgColor, 
                color: textColor 
              }}
            >
              {data.team2}
            </div>
          </a>
        );
      }
    },
    { 
      field: "score2", 
      header: "Score", 
      style: { width: '70px', minWidth: '70px', maxWidth: '70px', backgroundColor: '#eee', padding: '0', textAlign: 'center' },
      headerStyle: { width: '70px', minWidth: '70px', maxWidth: '70px', backgroundColor: 'white' },
      body: (data) => showScore(data, 2)
    },
    { 
      field: "pitch", 
      header: "Pitch", 
      style: { ...fixw('70px') }, 
      sortable: true, 
      editor: textEditor 
    },
    { 
      field: "umpireTeam", 
      header: "Umpiring Team", 
      style: { width: '150px' }, 
      sortable: true, 
      className: 'team-cell', // Assign custom class to <td>
      editor: (options) => dropdownEditor(options, 'umpireTeam', umpires),
      body: (data) => {
        const bgColor = teamColorMap[data.umpireTeam] || '#fff';
        const textColor = getTextColor(bgColor);
        return (
          <a href="#" onClick={(e) => e.preventDefault()}>
            <div 
              className="team-cell-content" // Apply content class to inner <div>
              style={{ 
                backgroundColor: bgColor, 
                color: textColor 
              }}
            >
              {data.umpireTeam}
            </div>
          </a>
        );
      }
    },
    { 
      field: "referee", 
      header: "Referee", 
      style: { width: '150px' }, 
      sortable: true, 
      className: 'team-cell', // Assign custom class to <td>
      editor: (options) => dropdownEditor(options, 'referee', referees),
      body: (data) => {
        const bgColor = teamColorMap[data.referee] || '#fff';
        const textColor = getTextColor(bgColor);
        return (
          <a href="#" onClick={(e) => e.preventDefault()}>
            <div 
              className="team-cell-content" // Apply content class to inner <div>
              style={{ 
                backgroundColor: bgColor, 
                color: textColor 
              }}
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
    console.log('ss',x)
      return x
    })

  return (
    <section className="FixtureTable">
      <DataTable 
        value={fixtures} 
        dataKey="id" // Ensure this corresponds to a unique field
        responsiveLayout="scroll" 
        editMode="cell" 
        onCellEditComplete={onCellEditComplete}
        paginator 
        rows={10}
        sortMode="multiple"
      >
        {columns.map((col, index) => (
          <Column
            key={index}
            field={col.field}
            header={col.header}
            sortable={col.sortable}
            editor={col.editor}
            className={col.className} // Apply custom class to <td>
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
