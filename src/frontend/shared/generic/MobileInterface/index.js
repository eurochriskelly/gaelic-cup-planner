import React from 'react';
import './MobileInterface.css';

const MobileInterface = ({
  children
}) => {
  return (
    <main className="MobileInterface">
      {children}
    </main>
  )
};

export default MobileInterface;

