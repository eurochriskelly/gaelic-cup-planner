import './OnAirLight.scss';

const OnAirLight = ({ status }) => {
  // status can be 'ready', 'in-progress', 'unavailable', 'warning'
  // We'll map these to colors: green, red, orange
  let lightColorClass = 'orange'; // Default to orange

  if (status === 'ready') {
    lightColorClass = 'green';
  } else if (status === 'in-progress') {
    lightColorClass = 'red';
  }
  // 'unavailable' and 'warning' will use the default 'orange'

  return (
    <div className="on-air-light-container">
      <div className={`on-air-light ${lightColorClass}`}></div>
    </div>
  );
};

export default OnAirLight;
