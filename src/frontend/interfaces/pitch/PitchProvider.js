import React, { createContext, useEffect, useState, useContext } from 'react';

const PitchContext = createContext();

export const PitchProvider = ({ children }) => {
    const [mediaType, setMediaType] = useState(null);
    const [tournamentId, setTournamentId] = useState(null);
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
        <PitchContext.Provider value={{ mediaType, tournamentId, setTournamentId }}>
            {children}
        </PitchContext.Provider>
    );
};

export const usePitchContext = () => useContext(PitchContext);
