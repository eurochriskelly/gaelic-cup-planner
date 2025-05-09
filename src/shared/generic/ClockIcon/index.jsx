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

  return (
    <span className={`ClockIcon m-0 ${layout === 'top' ? 'clock-layout-top' : 'clock-layout-side'}`}>
      <svg width={size} height={size} viewBox="0 0 25 25">
        <circle
          cx="15"
          cy="15"
          r="7"
          stroke={circleColor}
          strokeWidth={swid}
          fill={fillColor}
        ></circle>
        <path
          d={`M 15,15 L 15,8`} // Minute hand, adjusted for length
          stroke={strokeColor}
          strokeWidth="1"
          transform={`rotate(${minuteAngle} 15 15)`}
        ></path>
        <path
          d={`M 15,15 L 15,11`} // Hour hand, shorter and thicker
          stroke={strokeColor}
          strokeWidth="2"
          transform={`rotate(${hourAngle} 15 15)`}
        ></path>
      </svg>
      <span
        style={{
          lineHeight: "3.5rem",
          fontWeight: timeWeight,
          color: timeColor,
        }}
      >
        <span>{scheduled}</span>
        <span>{delay ? `*` : ''}</span>
      </span>
    </span>
  );
};

export default ClockIcon;
