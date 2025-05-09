import './LoginHeader.scss'; // Import the component's styles
import whistleImage from '../../../interfaces/mobile/public/pp-whistle.png';

const LoginHeader = ({ version, showBackButton, onBackClick }) => {
  const isRC = (version.includes('_RC'));
  return (
    <div className="app-header">
      <div className="logo-container">
        <img src={whistleImage} className="whistle" alt="Pitch Perfect Whistle" />
      </div>
      <div className="title-group">
        <span className="app-name">Pitch Perfect</span>
        <div className="version-line">{
          isRC
            ? <span style={{ color: 'red', whiteSpace: 'nowrap', fontWeight: 'bold' }} className="app-version">
              <span>RELEASE CANDIDATE &nbsp;</span>
              <span style={{ color: 'white' }}>{version.replace('_RC', '')}</span>
            </span>
            : <span className="app-version">v{version || '?.?.?'}</span>
        }</div>
      </div>
      {showBackButton && (
        <span className="back-icon-span" onClick={onBackClick}>
          <i className="pi pi-arrow-circle-left"></i>
        </span>
      )}
    </div>
  )
};

export default LoginHeader;
