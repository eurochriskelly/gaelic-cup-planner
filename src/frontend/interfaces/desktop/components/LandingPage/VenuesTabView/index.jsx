import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import "./VenuesTabView.scss";

function VenuesTabView() {
  return (
    <section className="VenuesTabView">
      <table>
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

  return (
    <tbody>
      {/* First Row: Main Headers */}
      <tr className='head'>
        <td colSpan={3}>Venue</td>
        <td>Longitude</td>
        <td>Pitch 1</td>
        <td>Pitch 2</td>
        <td>Pitch 3</td>
      </tr>
      
      {/* Second Row: Partially Header, partially data */}
      <tr>
        <td colSpan={3} rowSpan={3}>
          <div>
            <div>Enter a name for this venue</div>
            <InputText value={venueName} onChange={(e) => setVenueName(e.target.value)} className={'ok'} />
          </div>
        </td>
        <td>
          <InputText value={'23.81'} onChange={(e) => 'xx'} className={'ok'} />
        </td>
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
      </tr>
      
      {/* Third Row: Headers for the coordinates */}
      <tr className='head'>
        <td>Longitude</td>
        <td>Pitch 4</td>
        <td>Pitch 5</td>
        <td>Pitch 6</td>
      </tr>
      
      {/* Fourth Row: Data */}
      <tr>
        <td>
          <InputText value={'23.21'} onChange={(e) => 'xx'} className={'ok'} />
        </td>
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
  );
}

function PitchIfPrevious({ show, value, onChange }) {
  return (
    <td>
      {show && (
        <InputText
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={'ok'}
        />
      )}
    </td>
  );
}

export default VenuesTabView;
