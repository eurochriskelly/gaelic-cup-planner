import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

const SelectTournamentView = () => {
    const navigate = useNavigate()
    const [tournaments, setTournaments] = useState([])
    useEffect(() => {
        fetch('/api/tournaments')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setTournaments(data.data)
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }, [])

    const onSelect = (tournamentId) => {
        console.log('Selected tournament', tournamentId)
        const tournament = tournaments.find(t => t.id === tournamentId)
        console.log('Selected tournament', tournament)
        navigate(`/tournament/${tournamentId}`, { state: { tournament } })
    }

    return (
        <div className='selectTournamentView'>
            <h2>Select a tournament</h2>
            <article>
                {tournaments.map(({Id, Title, Date, Tournament}) => (
                    <section key={Id} onClick={() => onSelect(Id)}>
                        <h3>{Title}</h3>
                        <div>
                            <div>
                                <span>Date</span>
                                <span>{Date?.substring(0,10)}</span>
                            </div>
                            <div>
                                <span>Location</span>
                                <span>{Location}</span>
                            </div>
                        </div>
                    </section>
                ))}
            </article>
        </div>
    )
}

export default SelectTournamentView
