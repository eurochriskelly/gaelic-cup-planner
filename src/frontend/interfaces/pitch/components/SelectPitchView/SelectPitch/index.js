import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectPitch.module.scss";

const SelectPitch = ({
  pitch,
  type,
  location,
  category,
  team1,
  team2,
  scheduledTime,
  onChoosePitch,
}) => {
  const navigate = useNavigate();
  const navigateToPitch = () => {
    onChoosePitch();
    navigate(`/pitch/${pitch}`);
  };

  const stAllDone = category ? "" : styles.allDone;
  return (
    <div
      className={`${styles.allDone} ${styles.selectPitch}`}
      onClick={navigateToPitch}
    >
      <div className={styles.header}>
        <div className={styles.pitch}>{pitch}</div>
        <div className={styles.location}>{location}</div>
        <div className={styles.type}>{type?.toUpperCase()}</div>
      </div>
      {category ? (
        <div>
          <div className={styles.nextUp}>NEXT UP:</div>
          <div className={styles.details}>
            <div className={styles.category}>{category}</div>
            <div className={styles.time}>{`@${scheduledTime}`}</div>
          </div>
          <div className={styles.teams}>
            <div className={styles.team1}>{team1}</div>
            <div>vs</div>
            <div className={styles.team2}>{team2}</div>
          </div>
        </div>
      ) : (
        <div className={styles.noMoreFixtures}>
          <div>All scheduled games complete!</div>
        </div>
      )}
    </div>
  );
};

export default SelectPitch;
