import 'primeicons/primeicons.css'; // if not already imported
import { Link } from 'react-router-dom';

// Helper function to format date parts
const formatDateParts = (dateString) => {
  if (!dateString) {
    return { weekday: 'WEEKDAY', dayMonth: 'DD/MMM' };
  }
  try {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) { // Check if date is valid
        return { weekday: 'INVALID', dayMonth: 'DATE' };
    }
    const weekday = dateObj.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
    // Pad day with leading zero if needed (though DD format usually doesn't)
    const day = String(dateObj.getDate()).padStart(2, '0');
    // Get month abbreviation and uppercase it
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return { weekday, dayMonth: `${day}/${month}` };
  } catch (error) {
    console.error("Error formatting date:", error);
    return { weekday: 'ERROR', dayMonth: 'DATE' };
  }
};

// Reusable component for displaying tournament information in a card
const TournamentCard = ({ title, location, date, href, onClick }) => {
  // Determine if the card should be clickable based on whether onClick is provided
  const isClickable = typeof onClick === 'function';
  const cardClass = `tournamentCard ${isClickable ? 'clickable' : ''}`;

  const { weekday, dayMonth } = formatDateParts(date);

  const content = (
    <>
      <div className="date-column">
        <div className="calendar-icon">
          <i className="pi pi-calendar"></i>
        </div>
        <div className="weekday">{weekday}</div>
        <div className="day-month">{dayMonth}</div>
      </div>
      <div className="content-column">
        <h3 className="title">{title || 'Tournament Title'}</h3>
        {location && <p className="location">{location}</p>}
      </div>
    </>
  );

  if (href) {
    return (
      <Link className={cardClass} to={href} onClick={isClickable ? onClick : undefined}>
        {content}
      </Link>
    );
  }

  if (isClickable) {
    return (
      <button type="button" className={cardClass} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <div className={cardClass}>
      {content}
    </div>
  );
};
export default TournamentCard;
