import './LoginHeader.scss'; // Import the component's styles
import whistleImage from '../../../interfaces/mobile/public/pp-whistle.png';

const LoginHeader = ({ version, showBackButton, onBackClick }) => (
  <div className="app-header">
    <div className="header-content">
      <img src={whistleImage} className="whistle" alt="Pitch Perfect Whistle" />
      {/* Conditionally render back button */}
      {showBackButton && (
        <span className="back-icon-span" onClick={onBackClick}>
          <i className="pi pi-arrow-circle-left"></i>
        </span>
      )}
    </div>
    <div className="title-group">
      <h1>Pitch perfect</h1>
      <h2>v{version || '?.?.?'}</h2>
    </div>
  </div>
);

export default LoginHeader;
