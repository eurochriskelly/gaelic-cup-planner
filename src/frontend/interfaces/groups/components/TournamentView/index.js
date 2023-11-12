import { useState, useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
import styles from './TournamentView.module.scss'

const TournamentView = () => {
    console.log('TournamentView is starting')
    const { tournamentId } = useParams()

    const location = useLocation() 

    const [ groups, setGroups ] = useState([])
    const [ standings, setStandings ] = useState([])
    const [ tournament, setTournament ] = useState({})

    useEffect(() => {
        setTournament(location.state.tournament)
        fetch(`/api/group/standings/${tournamentId}`)
            .then(response => response.json())
            .then(data => {
                setGroups(data.groups)
                setStandings(data.data)
                console.log(data)
            })
            .catch(error => {
                console.error('Error fetching data:', error)
            })
    }, [])
    return (
        <div className={styles.tournamentView}>
            <h2>{tournament.title}</h2>
            <article>
                {groups.filter(x => x.startsWith('Men')).map((group, id) => {
                    let lastGroup = -1
                    return (
                        <section key={`g${id}`}>
                            <h3>{group}</h3>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>Team</th>
                                        <th>MP</th>
                                        <th>W</th>
                                        <th>D</th>
                                        <th>L</th>
                                        <th>PF</th>
                                        <th>PD</th>
                                        <th>Pts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standings
                                        .filter((team) => team.category === group)
                                        .map((team) => {
                                            if (lastGroup !== team.grp) {
                                                lastGroup = team.grp
                                                return (
                                                    <tr key={team.id}>
                                                        <td colSpan="9" className="group-header">Group {team.grp}</td>
                                                    </tr>
                                                )
                                            }
                                            return (
                                                <tr key={team.id}>
                                                    <td>{team.team}</td>
                                                    <td>{team.MatchesPlayed}/{team.MatchesPlanned}</td>
                                                    <td>{team.Wins}</td>
                                                    <td>{team.Draws}</td>
                                                    <td>{team.Losses}</td>
                                                    <td>{team.PointsFrom}</td>
                                                    <td>{team.PointsDifference}</td>
                                                    <td>{team.TotalPoints}</td>
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                        </section>
                    )
                })}
            </article>
        </div>
    )
}

export default TournamentView