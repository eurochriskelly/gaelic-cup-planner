import { Dropdown } from 'primereact/dropdown';
import { ListBox } from 'primereact/listbox';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { on } from 'process';

export function DialogCalcTeam({
    data,
}) {

    return (
        <section>
            <article>
                <h3>Dialog calc</h3>
                <p>Dialog content</p>
            </article>
            <div style={{ height: '150px' }}>
                <pre>
                    {data && JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </section>
    );
}

export function DialogPickTeam({
    data,
    current = null,
    onHide, // Accept onHide as a prop
  }) {
    const groupTeams = data?.groupTeams || [];
  
    const customStyles = {
      dropdown: {
        color: 'black',
        backgroundColor: 'white',
      },
      option: {
        color: 'black',
        backgroundColor: 'white',
      },
    };
 console.log(data) 
    return (
      <ListBox
        value={data.rowData[data.field]}
        options={groupTeams}
        onChange={(e) => {
          console.log(e.value);
          onHide(); // Close dialog when selection is made
        }}
        placeholder="Select a Team"
        style={customStyles.dropdown}
        panelStyle={customStyles.option}
        itemTemplate={(option) => <span>{option}</span>}
      />
    );
  }
