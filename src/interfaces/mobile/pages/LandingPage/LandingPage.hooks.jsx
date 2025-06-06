import { useState, useEffect } from 'react';
const defaultDate = {
  Date: '2028-01-01T00:00:00Z'
}

export const useFetchTournament = (tid) => {
  const [tournInfo, setTournInfo] = useState(defaultDate);
  useEffect(() => {
    if (!tid) return; // Add this line
    fetch(`/api/tournaments/${tid}`)
      .then((response) => response.json())
      .then((data) => setTournInfo(data.data || defaultDate))
      .catch((error) => {
        setTournInfo(defaultDate)
        console.error(`Error fetching tournament info for [${tid}]`, error);  
      });
  }, [tid]);

  return { tournInfo }
}

export const useFetchFilters = (tournamentId, userRole, selectedFilters = {}) => {
  const [filterChoices, setFilterChoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tournamentId || !userRole) {
      setIsLoading(false);
      return;
    }

    const fetchFilters = async () => {
      setIsLoading(true);
      try {
        // Get the selected categories to fetch specific filters
        const selectedCategories = Object.keys(selectedFilters).join(',');
        const url = `/api/tournaments/${tournamentId}/filters?role=${userRole}${selectedCategories ? `&category=${selectedCategories}` : ''}`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch filters: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && Array.isArray(data.data)) {
          // Transform API data to match the format expected by FilterWidget
          const formattedFilters = data.data.map(filter => ({
            icon: filter.icon || `${filter.category}Icon`,
            category: filter.category,
            choices: filter.choices || [],
            allowMultiselect: filter.multiSelect || false,
            selected: selectedFilters[filter.category] || null,
            default: filter.default || null
          }));
          
          setFilterChoices(formattedFilters);
        } else {
          setFilterChoices([]);
        }
      } catch (err) {
        console.error('Error fetching filters:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilters();
  }, [tournamentId, userRole, selectedFilters]);

  return { filterChoices, isLoading, error };
};
