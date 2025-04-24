// Helper function to format date parts
const formatDateParts = (dateString) => {
  if (!dateString) {
    return { year: 'YYYY', dayMonth: 'DD/MMM' };
  }
  try {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) { // Check if date is valid
        return { year: 'Invalid', dayMonth: 'Date' };
    }
    const year = dateObj.getFullYear();
    // Pad day with leading zero if needed (though DD format usually doesn't)
    const day = String(dateObj.getDate()).padStart(2, '0');
    // Get month abbreviation and uppercase it
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return { year, dayMonth: `${day}/${month}` };
  } catch (error) {
    console.error("Error formatting date:", error);
    return { year: 'Error', dayMonth: 'Date' };
  }
};

// Reusable component for displaying tournament information in a card
const TournamentCard = ({ title, location, date, onClick }) => {
  // Determine if the card should be clickable based on whether onClick is provided
  const isClickable = typeof onClick === 'function';
  const cardClass = `tournamentCard ${isClickable ? 'clickable' : ''}`;

  const { year, dayMonth } = formatDateParts(date);

  return (
    <div className={cardClass} onClick={isClickable ? onClick : undefined}>
      <div className="date-line">
        <span className="year">{year}</span>
        <span className="day-month">{dayMonth}</span>
      </div>
      <h3 className="title">{title || 'Tournament Title'}</h3>
      {location && <p className="location">{location}</p>}
    </div>
  );
};

export default TournamentCard;
