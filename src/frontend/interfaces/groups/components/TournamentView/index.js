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
    const [tournament, setTournament] = useState({})

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
            <article>
                <h2>
                    <div>Upcoming</div>
                    <div>fixtures</div>
                </h2>
                {
                    groups
                    .slice(0, 3)
                    .map((group, id) => {
                        return <>
                            <section>
                                <h3>{group}</h3>
                                <div>
                                    lo lo lo
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
                            <GroupStandings standings={standings.filter((team) => team.category === group)}   />
                        </section>
                    )
                })}
            </article>
        </div>

    )
}

export default TournamentView