import './LoginHeader.scss';
import whistleImage from '../../../interfaces/mobile/public/images/banner.png';

const formatDateParts = (dateString) => {
  if (!dateString) {
    return { weekdayShort: '', dayMonth: '' };
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return { weekdayShort: '', dayMonth: '' };
  }

  const weekdayShort = date
    .toLocaleString('en-US', { weekday: 'short' })
    .toUpperCase();
  const day = String(date.getDate()).padStart(2, '0');
  const month = date
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase();

  return { weekdayShort, dayMonth: `${day}/${month}` };
};

const LoginHeader = ({ version, showBackButton, onBackClick, tournament }) => {
  const { weekdayShort, dayMonth } = formatDateParts(tournament?.Date);
  const hasTournament = Boolean(tournament);

  return (
    <div className={`app-header ${hasTournament ? 'app-header-with-tournament' : 'app-header-home'}`}>
      <div className="logo-container">
        <img src={whistleImage} className="whistle" alt="Pitch Perfect" />
        {showBackButton && (
          <button type="button" className="back-icon-span" onClick={onBackClick} aria-label="Back">
            <i className="pi pi-arrow-left" aria-hidden="true"></i>
          </button>
        )}
      </div>

      {hasTournament && (
        <div className="header-tournament">
          <div className="header-date">
            <div className="header-weekday">{weekdayShort}</div>
            <i className="pi pi-calendar" aria-hidden="true"></i>
            <div className="header-day-month">{dayMonth}</div>
          </div>
          <div className="header-event-copy">
            <div className="header-event-title">{tournament?.Title || 'Selected tournament'}</div>
            {tournament?.Location && (
              <div className="header-event-location">{tournament.Location}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
};

export default LoginHeader;
