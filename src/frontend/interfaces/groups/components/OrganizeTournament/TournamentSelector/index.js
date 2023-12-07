import React, { useEffect, useState } from "react"
import AutocompleteSelect from "~/src/frontend/shared/generic/AutocompleteSelect"

const TournamentSelector = ({
    selectedTournament,
    setTournament
}) => {
    const [existingTournaments, setExistingTournaments] = useState([])

    useEffect(() => {
        setExistingTournaments([
            'Pan euros 2023 The Hague',
            'Pan euros 2024 Copenhagen',
            'Benenux round 1 2023',
            'Benenux round 2 2023',
            'Benenux round 3 2023',
            'Benenux round 4 2023',
            'Benenux round 1 2024',
            'Benenux round 2 2024',
            'Benenux round 3 2024',
            'Benenux round 4 2024',
            'foododd', 'baides', 'diarqe', 'abersy',
            'dalway', 'erbeds', 'goelos'
        ])
    }, [])

    const actions = {
        selectAction: (tournament) => {
            console.log('selectAction', tournament)
            setTournament(tournament)
        }
    }
    return selectedTournament ? (
        <h3>
            <span>Selected tournament: {selectedTournament}</span>
            <button onClick={() => setTournament(null)}>Change</button>
        </h3>
    ) : (
        <div>
            <h3>Tournament Selector</h3>
            <AutocompleteSelect
                options={existingTournaments}
                limit={8}
                selectAction={actions.selectAction}
            />
        </div>
    )
}

export default TournamentSelector