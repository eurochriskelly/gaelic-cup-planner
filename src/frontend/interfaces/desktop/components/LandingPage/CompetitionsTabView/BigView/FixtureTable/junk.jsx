
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


I have the following component:

      export function DialogPickTeam({
        data,
        onHide,
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
            }
        };

        return (
            <Dropdown
                value={null}
                options={groupTeams} // Array of strings
                onChange={(e) => {
                    console.log(e.value)
                    onHide();
                }}
                placeholder="Select a Team"
                style={customStyles.dropdown}
                panelStyle={customStyles.option}
                itemTemplate={(option) => <span>{option}</span>} // Handle the string directly in the template
            />
        );
    }


it is called as follows: 

      <dialog header={dialogdata?.iscalcfield ? 'team selection rule' : 'choose team'} visible={visibledialog} onhide={() => setvisibledialog(false)}>{
        dialogdata?.iscalcfield 
          ? <dialogcalcteam data={dialogdata} />
          : <dialogpickteam data={dialogdata} />
      }</dialog>

how can I make the dialog close when the users makes a selection?