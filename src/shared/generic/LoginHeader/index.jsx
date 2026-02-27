import './LoginHeader.scss';
import whistleImage from '../../../interfaces/mobile/public/images/banner.png';

const LoginHeader = ({ version, showBackButton, onBackClick }) => {
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
        <div className="version-line">
          <span className="app-version">v{version || '?.?.?'}</span>
        </div>
      </div>
    </div>
  )
};

export default LoginHeader;
