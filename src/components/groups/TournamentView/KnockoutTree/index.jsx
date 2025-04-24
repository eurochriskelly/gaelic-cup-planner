import './KnockoutTree.scss';

const KnockoutTree = ({
  title = 'cup',
  quarters1,
  quarters2,
  quarters3,
  quarters4,
  semis1,
  semis2,
  finals
}) => {
  const TeamIfPresent = (team) => {
    if (team) {
      return <div className="present">
        <div>Team 1</div>
        <div>vs</div>
        <div>Team 2</div>
      </div>
    }
    return <div className="not-present"></div>
  }
  return (
    <article className="KnockoutTree">
      <table>
        <colgroup>
          <col style={{width:"12.5%"}}/>
          <col style={{width:"12.5%"}}/>
          <col style={{width:"12.5%"}}/>
          <col style={{width:"12.5%"}}/>
          <col style={{width:"12.5%"}}/>
          <col style={{width:"12.5%"}}/>
          <col style={{width:"12.5%"}}/>
          <col style={{width:"12.5%"}}/>
        </colgroup>
        <tbody>
          <tr><td colSpan={8} className="groupHeader">{title}</td></tr>
          <PlaceholderRow
            startAt={0}
            contents={<TeamIfPresent team={quarters1} />}
            paint={[
              [4, 1, "r"],
              [4, 1, "t"],
              [4, 2, "r"],
            ]}
          />
          <PlaceholderRow
            startAt={2}
            contents={<TeamIfPresent team={semis1} />}
            paint={[
              [4, 2, "r"],
              [6, 1, "t"],
              [6, 1, "r"],
              [6, 2, "r"],
            ]}
          />
          <PlaceholderRow
            startAt={0}
            contents={<TeamIfPresent team={quarters2} />}
            paint={[
              [4, 0, "r"],
              [4, 1, "t"],
              [6, 1, "r"],
              [6, 0, "r"],
              [6, 2, "r"],
            ]}
          />
          <PlaceholderRow
            startAt={4}
            contents={<TeamIfPresent team={finals} />}
            paint={[[6, 2, "r"]]}
          />
          <PlaceholderRow
            startAt={0}
            contents={<TeamIfPresent team={quarters3} />}
            paint={[
              [4, 1, "r"],
              [4, 1, "t"],
              [4, 2, "r"],
              [6, 0, "r"],
              [6, 1, "r"],
              [6, 2, "r"],
            ]}
          />
          <PlaceholderRow
            startAt={2}
            contents={<TeamIfPresent team={semis2} />}
            paint={[
              [4, 1, "r"],
              [4, 1, "t"],
              [4, 2, "r"],
              [6, 1, "t"],
              [6, 0, "r"],
            ]}
          />
          <PlaceholderRow
            startAt={0}
            contents={<TeamIfPresent team={quarters4} />}
            paint={[
              [4, 0, "r"],
              [4, 1, "t"],
            ]}
          />
        </tbody>
      </table>
    </article>
  );
};

export default KnockoutTree;

function PlaceholderRow({ startAt, contents, paint = [], color = "white" }) {
  const renderRows = () => {
    const rows = [];
    const paintMap = {};

    paint.forEach(([col, row, direction]) => {
      if (!paintMap[row]) paintMap[row] = {};
      if (!paintMap[row][col]) paintMap[row][col] = {};
      paintMap[row][col][direction] = true;
    });

    for (let row = 0; row < 3; row++) {
      const cells = [];
      for (let col = 0; col < 8; col++) {
        if (row < 2 && col >= startAt && col < startAt + 4) {
          if (col === startAt && row === 0) {
            cells.push(
              <td
                key={`${row}-${col}`}
                rowSpan="2"
                colSpan="4"
                className="team-name"
                style={{
                  border: "1px solid black",
                  background: "rgba(255,255,255, 0.3)",
                  marginLeft: "1rem",
                  fontSize: "1.8rem",
                  textTransform: 'uppercase',
                  color: "white",
                }}
              >
                {contents}
              </td>
            );
          }
        } else {
          const line = "5px solid " + color;
          const style = {};
          if (paintMap[row] && paintMap[row][col]) {
            if (paintMap[row][col]["r"]) style.borderRight = line;
            if (paintMap[row][col]["b"]) style.borderBottom = line;
            if (paintMap[row][col]["t"]) style.borderTop = line;
            if (paintMap[row][col]["l"]) style.borderLeft = line;
          }
          cells.push(
            <td key={`${row}-${col}`} style={style}>
              &nbsp;
            </td>
          );
        }
      }
      rows.push(<tr key={row}>{cells}</tr>);
    }
    return rows;
  };

  return <>{renderRows()}</>;
}
