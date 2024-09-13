import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { useTournament } from '../../../TournamentContext';
import { useTournamentInfo, useRegions } from './TournamentInfo.hooks'; // Update the import path if necessary

import './TournamentInfo.scss';

function Row({ label, children, spans = [] }) {
  return (
    <tr>
      <td>{label}</td>
      {React.Children.map(children, (child, index) => (
        <td colSpan={spans[index] || 1}>{child}</td>
      ))}
    </tr>
  );
}

function TournamentInfo({ tournamentId }) {
  const tournament = useTournament();
  const {
    tournInfo, setTournInfo, originalInfo, 
    date, setDate, originalDate, region
  } = useTournamentInfo(tournamentId);
  console.log('tournament', tournament);
  const { filteredRegions, searchRegion } = useRegions();

  const isDirty = (field) => {
    switch (field) {
      case 'title':
        return tournInfo.title !== originalInfo.title;
      case 'location':
        return tournInfo.location !== originalInfo.location;
      case 'date':
        return date !== originalDate;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    // Implement your submission logic here
    console.log('Submitting:', tournInfo, date);
  };

  return (
    <div className='TournamentInfo'>
      <table>
        <tbody>
          <Row label="Title" spans={[3]}>
            <InputText
              value={tournament.description}
              onChange={(e) => console.log(e)}
              className={isDirty('title') ? 'dirty' : ''} />
          </Row>
          <Row label="Date">
            <Calendar
              value={tournament.startDate} dateFormat='yy-mm-dd'
              onChange={(e) => setDate(e.value)}
              className={isDirty('date') ? 'dirty' : ''} />
          </Row>
          <Row>
            <label>Region</label>
            <label>Country</label>
            <label>City</label>
          </Row>
          <Row label="Location">
            <AutoComplete
              value={tournament.location.region}
              suggestions={filteredRegions} 
              completeMethod={searchRegion} 
              field="name" 
              dropdown 
              onChange={(e) => setRegion(e.value)}
            />
            <InputText
              value={tournament.location.country}
              onChange={(e) => setTournInfo({ ...tournInfo, location: e.target.value })}
              className={isDirty('location') ? 'dirty' : ''} />
            <InputText
              value={tournament.location.city}
              onChange={(e) => setTournInfo({ ...tournInfo, location: e.target.value })}
              className={isDirty('location') ? 'dirty' : ''} />
          </Row>
        </tbody>
      </table>
    </div>
  );
}

export default TournamentInfo;
