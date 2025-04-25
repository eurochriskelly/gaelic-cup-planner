import './LoginHeader.scss'; // Import the component's styles
import whistleImage from '../../../interfaces/mobile/public/pp-whistle.png';

const LoginHeader = ({ version, showBackButton, onBackClick }) => (
  <div className="app-header">
    <div className="logo-container">
      <img src={whistleImage} className="whistle" alt="Pitch Perfect Whistle" />
    </div>
    <div className="title-container">
      <span className="app-name">Pitch Perfect</span>
      <span className="app-version">v{version || '?.?.?'}</span>
      {showBackButton && (
        <span className="back-icon-span" onClick={onBackClick}>
          <i className="pi pi-arrow-circle-left"></i>
        </span>
      )}
    </div>
  </div>
);

export default LoginHeader;
