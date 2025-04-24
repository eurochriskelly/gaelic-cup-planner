import React from 'react';
import './LoginHeader.scss'; // Import the component's styles

const LoginHeader = ({ version }) => (
  <div className="app-header">
    <h1>Pitch perfect</h1>
    <h2>v{version || '?.?.?'}</h2>
  </div>
);

export default LoginHeader;
