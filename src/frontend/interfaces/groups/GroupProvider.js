import React, { createContext, useEffect, useState, useContext } from 'react';

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
  const [mediaType, setMediaType] = useState(null);
   useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const handleMediaQueryChange = (event) => {
      setMediaType(event.matches ? 'phone' : 'desktop');
    };

    handleMediaQueryChange(mediaQuery);
    mediaQuery.addListener(handleMediaQueryChange);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);
  return (
    <GroupContext.Provider value={{ mediaType }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => useContext(GroupContext);
