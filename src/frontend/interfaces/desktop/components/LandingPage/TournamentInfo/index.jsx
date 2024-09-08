import  { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { useTournament } from '../../../TournamentContext';

import './TournamentInfo.scss';

function TournamentInfo({ tournamentId }) {
  const tournament = useTournament();
  const [tournInfo, setTournInfo] = useState({ title: '', location: '' });
  const [originalInfo, setOriginalInfo] = useState({});
  const [date, setDate] = useState(null);
  const [originalDate, setOriginalDate] = useState(null);
  const [region, setRegion] = useState(null);
  const [filteredRegions, setFilteredRegions] = useState([]);

  const regions = [
    { name: 'North America' },
    { name: 'South America' },
    { name: 'Europe' },
    { name: 'Asia' },
    { name: 'Africa' },
    { name: 'Australia' }
  ];

  useEffect(() => {
    fetch(`/api/regions`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
      })
    fetch(`/api/tournaments/${tournamentId}`)
      .then((response) => response.json())
      .then((data) => {
        const fetchedInfo = {
          title: data.data.Title,
          location: data.data.Location
        };
        setTournInfo(fetchedInfo);
        setOriginalInfo(fetchedInfo);
        const fetchedDate = data.data.Date?.substring(0, 10);
        setDate(fetchedDate);
        setOriginalDate(fetchedDate);
      })
      .catch((error) => console.error("Error fetching tournament info:", error));
  }, [tournamentId]);

  const searchRegion = (event) => {
    setTimeout(() => {
      let _filteredRegions;
      if (!event.query.trim().length) {
        _filteredRegions = [...regions];
      } else {
        _filteredRegions = regions.filter((region) =>
          region.name.toLowerCase().startsWith(event.query.toLowerCase())
        );
      }
      setFilteredRegions(_filteredRegions);
    }, 250);
  };

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
    console.log('Submitting:', tournInfo, date, region);
  };

  return (
    <div className='TournamentInfo'>
      <table>
        <tbody>
          <Row label="Title" spans={[3]}>
            <InputText value={tournInfo.title} onChange={(e) => setTournInfo({ ...tournInfo, title: e.target.value })} className={isDirty('title') ? 'dirty' : ''} />
          </Row>
          <Row label="Date">
            <Calendar value={date} dateFormat='yy-mm-dd' onChange={(e) => setDate(e.value)} className={isDirty('date') ? 'dirty' : ''} />
            <Calendar value={date} dateFormat='yy-mm-dd' onChange={(e) => setDate(e.value)} className={isDirty('date') ? 'dirty' : ''} />
          </Row>
          <Row>
            <label>Region</label>
            <label>Country</label>
            <label>City</label>
          </Row>

          <Row label="Location">
            <AutoComplete 
              value={region} 
              suggestions={filteredRegions} 
              completeMethod={searchRegion} 
              field="name" 
              dropdown 
              onChange={(e) => setRegion(e.value)}
            />
            <InputText value={tournInfo.location} onChange={(e) => setTournInfo({ ...tournInfo, location: e.target.value })} className={isDirty('location') ? 'dirty' : ''} />
            <InputText value={tournInfo.location} onChange={(e) => setTournInfo({ ...tournInfo, location: e.target.value })} className={isDirty('location') ? 'dirty' : ''} />
          </Row>
        </tbody>
      </table>
    </div>
  );
}

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

export default TournamentInfo;
