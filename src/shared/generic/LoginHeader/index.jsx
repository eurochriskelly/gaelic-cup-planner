import './LoginHeader.scss'; // Import the component's styles
import whistleImage from '../../../interfaces/mobile/public/pp-whistle.png';

const LoginHeader = ({ version, showBackButton, onBackClick }) => (
  <div className="app-header">
    <div className="logo-container">
      <img src={whistleImage} className="whistle" alt="Pitch Perfect Whistle" />
    </div>
    <div className="title-group">
      <span className="app-name">Pitch Perfect</span>
      <div className="version-line">
        <span className="app-version">v{version || '?.?.?'}</span>
      </div>
    </div>
    {showBackButton && (
      <span className="back-icon-span" onClick={onBackClick}>
        <i className="pi pi-arrow-circle-left"></i>
      </span>
    )}
  </div>
);

export default LoginHeader;
