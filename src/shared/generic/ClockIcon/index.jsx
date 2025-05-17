import './ClockIcon.scss';

const ClockIcon = ({ 
  started, 
  played, 
  scheduled, 
  size = 52,
  focus, 
  layout = 'side',
  delay 
}) => {
  let strokeColor = "white";
  let fillColor = "#888";
  let circleColor = "none";
  let timeColor = "#888";
  let timeWeight = "normal";
  let swid = 1;

  const st = (s) => {
    /* splt aaa bbb ccc */
    if (!s) return null;
    const parts = s?.split("T");
    if (parts.length !== 2) return "";
    return parts[1].split(":").slice(0, 2).join(":");
  };

  const shortTime = st(started) || scheduled;

  if (started && !played) {
    fillColor = "green";
    strokeColor = "white";
    swid = 5;
    circleColor = "green";
    timeColor = "black";
    timeWeight = "bold";
  }

  if (!started && !played) {
    fillColor = "white";
    circleColor = "#999";
    strokeColor = "#666";
  }

  if (!started && !played && focus) {
    if (st(new Date().toISOString()) > scheduled) {
      //timeColor = 'red'
      fillColor = "red";
      circleColor = "red";
    } else {
      fillColor = "#cf9428";
      circleColor = "#cf9428";
    }
    strokeColor = "white";
  }

  const [hour, minute] = scheduled.split(":").map(Number);
  const minuteAngle = minute * 6; // 60 minutes, 360 degrees
  const hourAngle = (hour % 12) * 30 + minute * 0.5; // 12 hours, 360 degrees, plus a little for the minutes

  // SVG viewBox and circle parameters
  const vbSize = 24;
  const vbCenter = vbSize / 2; // 12
  const maxStrokePossible = 5; // Based on swid = 5 when started
  // Radius calculated so that the circle + half of its max stroke width fits within vbCenter
  const circleRadius = vbCenter - (maxStrokePossible / 2); // 12 - 2.5 = 9.5

  // Hand lengths, relative to the new circleRadius
  const minuteHandLength = circleRadius - 1.5; // e.g., 9.5 - 1.5 = 8
  const hourHandLength = circleRadius - 4;   // e.g., 9.5 - 4 = 5.5

  const minuteHandEndY = vbCenter - minuteHandLength; // 12 - 8 = 4
  const hourHandEndY = vbCenter - hourHandLength;     // 12 - 5.5 = 6.5

  return (
    <span className={`ClockIcon m-0 ${layout === 'top' ? 'clock-layout-top' : 'clock-layout-side'}`}>
      <svg width={size} height={size} viewBox={`0 0 ${vbSize} ${vbSize}`}>
        <circle
          cx={vbCenter}
          cy={vbCenter}
          r={circleRadius}
          stroke={circleColor}
          strokeWidth={swid}
          fill={fillColor}
        ></circle>
        <path
          d={`M ${vbCenter},${vbCenter} L ${vbCenter},${minuteHandEndY}`} // Minute hand
          stroke={strokeColor}
          strokeWidth="1" // Thinner hand
          transform={`rotate(${minuteAngle} ${vbCenter} ${vbCenter})`}
        ></path>
        <path
          d={`M ${vbCenter},${vbCenter} L ${vbCenter},${hourHandEndY}`} // Hour hand
          stroke={strokeColor}
          strokeWidth="2" // Thicker hand
          transform={`rotate(${hourAngle} ${vbCenter} ${vbCenter})`}
        ></path>
      </svg>
      <span
        style={{
          fontWeight: timeWeight,
          color: timeColor,
        }}
      >
        <span style={{ fontSize: '4rem' }}>{scheduled}</span>
        <span>{delay ? `*` : ''}</span>
      </span>
    </span>
  );
};

export default ClockIcon;
