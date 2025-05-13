import './LoginHeader.scss'; // Import the component's styles
import whistleImage from '../../../interfaces/mobile/public/images/banner.png';

const LoginHeader = ({ version, showBackButton, onBackClick }) => {
  const isRC = (version.includes('_RC'));
  return (
    <div className="app-header">
      <div className="logo-container">{
        <img src={whistleImage} className='whistle' /> 
      }</div>
      <div className="title-group">
        {showBackButton && (
          <span className="back-icon-span" onClick={onBackClick}>
            <i className="pi pi-arrow-circle-left"></i>
          </span>
        )}
        <div className="version-line">{
          isRC
            ? <span style={{ color: 'red', whiteSpace: 'nowrap', fontWeight: 'bold' }} className="app-version">
              <span>RELEASE CANDIDATE &nbsp;</span>
              <span style={{ color: 'white' }}>{version.replace('_RC', '')}</span>
            </span>
            : <span className="app-version">v{version || '?.?.?'}</span>
        }</div>
      </div>
    </div>
  )
};

export default LoginHeader;
