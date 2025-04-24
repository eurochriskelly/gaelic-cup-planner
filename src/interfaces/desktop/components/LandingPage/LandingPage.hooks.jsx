import { useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/js/Provider";

import { useState } from 'react';
import { useAppContext } from '../../../../shared/js/Provider';

export const useFetchTournament = () => {
  const { tournamentId } = useAppContext();
  const [tournInfo, setTournInfo] = useState({});
  const base = `/tournament/${tournamentId}`;

  useEffect(() => {
    fetch(base)
      .then((response) => response.json())
      .then((data) => setTournInfo(data.data))
      .catch((error) => console.error("Error fetching tournament info:", error));
  }, [tournamentId]);

  return { tournInfo };
}
