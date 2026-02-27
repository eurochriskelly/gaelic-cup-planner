import './OnAirLight.scss';

const OnAirLight = ({ status }) => {
  let lightColorClass = 'gray';

  if (status === 'in-progress') {
    lightColorClass = 'red';
  } else if (status === 'ready') {
    lightColorClass = 'green';
  } else if (status === 'warning') {
    lightColorClass = 'orange';
  }

  return (
    <div className="on-air-light-container">
      <div className={`on-air-light ${lightColorClass}`}></div>
    </div>
  );
};

export default OnAirLight;
