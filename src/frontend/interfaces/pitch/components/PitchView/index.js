import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../../../shared/api/pitch";
import Fixture from "./Fixture";
import PitchViewHeader from "./PitchViewHeader";
import UpdateFixture from "./UpdateFixture";
import styles from "./PitchView.module.scss";

const PitchView = ({ backToSelection }) => {
  const { pitchId } = useParams();

  const [fixtures, setFixtures] = useState([]);
  const [nextFixture, setNextFixture] = useState(null);
  const [fixtureFilter, setFixtureFilter] = useState("next");

  const actions = {
    // Changing between tabs hides or shows a set of fixtures
    delayByOne: async (fixtureId) => {
      console.log("delayByOne");
    },
    delayUntilEnd: async (fixtureId) => {
      console.log("delayUntilEnd");
    },
    fetchFixtures: async () => {
      const { data } = await API.fetchFixtures(pitchId || 3);
      setFixtures(data);
      setNextFixture(data.filter((f) => !f.played).shift());
    },
    startMatch: async (fixtureId) => {
      await API.startMatch(fixtureId);
      const data = await API.fetchFixtures(pitchId);
      setFixtures(data.data);
    },
  };

  useEffect(() => actions.fetchFixtures(), []);
  return (
    <div className={styles.pitchView}>
      <PitchViewHeader
        pitchId={pitchId}
        backToSelection={backToSelection}
        changeTab={setFixtureFilter}
      />
      <div className={styles.fixturesBody}>
        <div className={styles.fixturesArea}>
          {fixtures
            .filter((f) => {
              const focusFixture = nextFixture && nextFixture.id === f.id;
              switch (fixtureFilter.toLowerCase()) {
                case "next":
                  return focusFixture;
                case "finished":
                  return f.played;
                case "unplayed":
                  return !f.played && !focusFixture;
                default:
                  return true;
              }
            })
            .map((fixture, i) => {
              const focusFixture = nextFixture && nextFixture.id === fixture.id;
              return (
                <div
                  key={fixture.id}
                  className={focusFixture ? "focusFixture" : ""}
                >
                  <Fixture fixture={fixture} isFocus={focusFixture} />
                  {nextFixture && nextFixture.id === fixture.id && (
                    <UpdateFixture
                      fixture={fixture}
                      updateFixtures={actions.fetchFixtures}
                      startMatch={actions.startMatch}
                      delayByOne={actions.delayByOne}
                      delayUntilEnd={actions.delayUntilEnd}
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PitchView;
