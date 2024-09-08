import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import "./VenuesTabView.scss";
import { useTournament } from '../../../TournamentContext';

function VenuesTabView() {
  const tournament = useTournament();
  return (
    <section className="VenuesTabView">
      <p>Add venues and pitches</p>
      <table>
        <Rows />
        <Rows />
      </table>
    </section>
  );
}

function Rows() {
  const [venueName, setVenueName] = useState('A nice place');
  const [pitchValues, setPitchValues] = useState(['', '', '', '', '', '']);

  const handlePitchChange = (index, value) => {
    const newPitchValues = [...pitchValues];
    newPitchValues[index] = value;
    setPitchValues(newPitchValues);
  };

  return <tbody>
      {/* First Row: Main Headers */}
      <tr className='head'>
        <td colSpan={4}>Enter name for this venue</td>
        <td>Longitude</td>
        <td>Latitude</td>
      </tr>
      
      <tr> 
        <td colSpan={4}>
          <InputText value={venueName} onChange={(e) => setVenueName(e.target.value)} className={'ok'} />
        </td>
        <td>
          <InputText value={venueName} onChange={(e) => setVenueName(e.target.value)} className={'ok'} />
        </td>
        <td>
          <InputText value={venueName} onChange={(e) => setVenueName(e.target.value)} className={'ok'} />
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
          show={!!venueName}
          value={pitchValues[0]}
          onChange={(value) => handlePitchChange(0, value)}
        />
        <PitchIfPrevious
          show={!!pitchValues[0]}
          value={pitchValues[1]}
          onChange={(value) => handlePitchChange(1, value)}
        />
        <PitchIfPrevious
          show={!!pitchValues[1]}
          value={pitchValues[2]}
          onChange={(value) => handlePitchChange(2, value)}
        />
        <PitchIfPrevious
          show={!!pitchValues[2]}
          value={pitchValues[3]}
          onChange={(value) => handlePitchChange(3, value)}
        />
        <PitchIfPrevious
          show={!!pitchValues[3]}
          value={pitchValues[4]}
          onChange={(value) => handlePitchChange(4, value)}
        />
        <PitchIfPrevious
          show={!!pitchValues[4]}
          value={pitchValues[5]}
          onChange={(value) => handlePitchChange(5, value)}
        />
      </tr>
    </tbody>
}

function PitchIfPrevious({ show, value, onChange }) {
  return (
    <td>
        <InputText
          value={value}
          disabled={!show}
          onChange={(e) => onChange(e.target.value)}
          className={'ok'}
        />
    </td>
  );
}

export default VenuesTabView;
