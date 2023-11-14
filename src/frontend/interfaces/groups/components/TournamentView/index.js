import { useState, useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
import GroupStandings from "./GroupStandings"
import styles from './TournamentView.module.scss'

const TournamentView = () => {
    console.log('TournamentView is starting')
    const { tournamentId } = useParams()

    const location = useLocation()

    const [groups, setGroups] = useState([])
    const [standings, setStandings] = useState([])
    const [nextMatches, setNextMatches] = useState([])
    const [tournament, setTournament] = useState({})

    useEffect(() => {
        setTournament(location.state.tournament)
        fetch(`/api/fixtures/nextup/${tournamentId}`)
            .then(response => response.json())
            .then(data => {
                setNextMatches(data.data)
            })
            .catch(error => {
                console.error('Error fetching next fixtures:', error)
            })

        fetch(`/api/group/standings/${tournamentId}`)
            .then(response => response.json())
            .then(data => {
                setGroups(data.groups)
                setStandings(data.data)
                console.log(data)
            })
            .catch(error => {
                console.error('Error fetching standings', error)
            })
    }, [])
    return (
        <div className={styles.tournamentView}>
            <article>
                <h2>
                    <div>Upcoming</div>
                    <div>fixtures</div>
                </h2>
                {
                    groups
                        .slice(0, 3)
                        .map((group, id) => {
                            console.log({nextMatches})
                            return <>
                                <section>
                                    <h3>{group}</h3>
                                    <div>
                                        {
                                            (nextMatches || [])
                                                .filter((match) => match.category === group)
                                                .slice(0, 3)
                                                .map((match, i) => {
                                                    const { scheduledTime, team1, team2, goals1, goals2, points1, points2, umpiringTeam } = match
                                                    return (
                                                        <div key={`match${i}`} className={styles.nextArea}>
                                                            <div>
                                                                <span>{scheduledTime}</span>
                                                                <span>{team1}</span>
                                                                <span>vs</span>
                                                                <span>{team2}</span>
                                                            </div>
                                                            {
                                                                (goals1 && goals2) && <div>
                                                                    <span></span>
                                                                    <span>{goals1}-{points1}</span>
                                                                    <span></span>
                                                                    <span>{goals2}-{points2}</span>
                                                                </div>
                                                            }
                                                        </div>
                                                    )
                                                })
                                        }
                                    </div>
                                </section>
                            </>
                        })
                }
            </article>
            <article>
                <h2>Standings</h2>
                {groups.filter(x => x.startsWith('Men')).map((group, id) => {
                    return (
                        <section key={`g${id}`}>
                            <GroupStandings standings={standings.filter((team) => team.category === group)} />
                        </section>
                    )
                })}
            </article>
        </div>

    )
}

export default TournamentView