import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import "./VenuesTabView.scss";
import { useTournament } from '../../../TournamentContext';

function VenuesTabView() {
  const tournament = useTournament();
  console.log('tournament', tournament.venues, tournament.pitches)
  const { venues, pitches } = tournament;
  return (
    <section className="VenuesTabView">
      <p>Add venues and pitches</p>
      <table>{
        venues.map((venue, index) => (
          <Rows
            key={index}
            venue={venue}
            pitches={pitches.filter(p => p.venue === index)}
          />
        ))
      }</table>
    </section>
  );
}

function Rows({
  key,
  venue,
  pitches
}) {
  console.log(pitches)
  const [venueName, setVenueName] = useState('A nice place');
  const [pitchValues, setPitchValues] = useState(['', '', '', '', '', '']);

  const handlePitchChange = (index, value) => {
    const newPitchValues = [...pitchValues];
    newPitchValues[index] = value;
    setPitchValues(newPitchValues);
  };

  return <tbody key={key}>
      {/* First Row: Main Headers */}
      <tr className='head'>
        <td colSpan={4}>Enter name for this venue</td>
        <td>Longitude</td>
        <td>Latitude</td>
      </tr>
      
      <tr> 
        <td colSpan={4}>
          <InputText
            value={venue.name}
            onChange={(e) => setVenueName(e.target.value)} 
            className={'ok'} />
        </td>
        <td>
          <InputText
            value={venue?.coordinates?.longitude}
            onChange={(e) => setVenueName(e.target.value)}
            className={'ok'} />
        </td>
        <td>
          <InputText
            value={venue?.coordinates?.latitude}
            onChange={(e) => setVenueName(e.target.value)}
            className={'ok'} />
        </td>
      </tr>
      <tr className='head'>
        <td>Pitch 1</td>
        <td>Pitch 2</td>
        <td>Pitch 3</td>
        <td>Pitch 4</td>
        <td>Pitch 5</td>
        <td>Pitch 6</td>
      </tr>
      <tr>
        <PitchIfPrevious
          id={1}
          show={!!venueName}
          value={pitches[0]?.name}
          onChange={(value) => handlePitchChange(0, value)}
        />
        <PitchIfPrevious
          id={1}
          show={!!pitches[0]?.name}
          value={pitches[1]?.name}
          onChange={(value) => handlePitchChange(1, value)}
        />
        <PitchIfPrevious
          id={1}
          show={!!pitches[1]?.name}
          value={pitches[2]?.name}
          onChange={(value) => handlePitchChange(2, value)}
        />
        <PitchIfPrevious
          id={1}
          show={!!pitches[2]?.name}
          value={pitches[3]?.name}
        />
        <PitchIfPrevious
          id={1}
          show={!!pitches[3]?.name}
          value={pitches[4]?.name}
        />
        <PitchIfPrevious
          id={1}
          show={!!pitches[4]?.name}
          value={pitches[5]?.name}
          onChange={(value) => handlePitchChange(5, value)}
        />
      </tr>
    </tbody>
}

function PitchIfPrevious({ show, value, onChange, id}) {
  return (
    <td>
      <div>
        <span style={{width:'90%'}}>
          <InputText
            value={value}
            disabled={!show}
            onChange={(e) => onChange(e.target.value)}
            className={'ok'}
          />
        </span>
      </div>
    </td>
  );
}

export default VenuesTabView;
