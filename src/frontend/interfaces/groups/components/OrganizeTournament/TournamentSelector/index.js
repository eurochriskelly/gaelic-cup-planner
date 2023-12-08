import React, { useEffect, useState } from "react"
import AutocompleteSelect from "~/src/frontend/shared/generic/AutocompleteSelect"

const TournamentSelector = ({
    tournamentId,
    tournamentTitle,
    setTournament
}) => {
    const [existingTournaments, setExistingTournaments] = useState([])

    useEffect(() => {
        fetch(`/api/tournaments`)
            .then(response => response.json())
            .then(data => {
                setExistingTournaments(data.data)
            })
            .catch(error => {
                console.error('Error fetching next fixtures:', error)
            })
    }, [])

    const setTournamentByTitle = (title) => {
        const tournament = existingTournaments.find(x => x.Title === title)
        setTournament(tournament)
    }

    return tournamentId ? (
        <h3>
            <span>Selected tournament: {tournamentTitle}</span>
            <button onClick={() => setTournament(null)}>Change</button>
        </h3>
    ) : (
        <div>
            <h3>Tournament Selector</h3>
            <AutocompleteSelect
                options={existingTournaments.map(x => x.Title)}
                limit={8}
                selectAction={setTournamentByTitle}
            />
        </div>
    )
}

export default TournamentSelector