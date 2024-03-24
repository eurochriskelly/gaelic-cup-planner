import React from "react";
import styles from "./FixturesPreview.module.scss";

const FixturesPreview = ({ teams, group, groupMgr }) => {
    switch (teams.length) {
        case 0:
            return <div className={styles.fixturesPreview}>No fixtures</div>;
        case 1:
        case 2:
            return <div className={styles.fixturesPreview}>Too few teams to generate fixtures</div>;
        case 3:
        case 4:
        case 5:
            return (
                <div>
                    <h4>fixtures for group: {group}</h4>
                    <div className={styles.fixturesPreview}>{
                        groupMgr.matchesTable(group).map((match, index) => (
                            <div key={index} className={styles.match}>
                                <span className={styles.team1}>{match.team1}</span>
                                <span className={styles.vs}>vs</span>
                                <span className={styles.team2}>{match.team2}</span>
                            </div>
                        ))
                    }</div>
                </div>
            )
        default:
            return <div className={styles.fixturesPreview}>Too many teams to generate fixtures</div>
    }
}

export default FixturesPreview;