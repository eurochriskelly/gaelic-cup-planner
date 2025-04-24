import './LoginHeader.scss'; // Import the component's styles
import whistleImage from '../../../interfaces/mobile/public/pp-whistle.png';

const LoginHeader = ({ version, showBackButton, onBackClick }) => (
  <div className="app-header">
    {/* Conditionally render back button */}
    {showBackButton && (
      <span className="back-icon-span" onClick={onBackClick}>
        <img src={whistleImage} className="whistle" alt="Pitch Perfect Whistle" />
        <i className="pi pi-arrow-circle-left"></i>
      </span>
    )}
    <h1>Pitch perfect</h1>
    <h2>v{version || '?.?.?'}</h2>
  </div>
);

export default LoginHeader;
