import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../../shared/api/pitch";
import MobileLayout from "../../../../shared/generic/MobileLayout";
import Fixture from "./Fixture";
import UpdateFixture from "./UpdateFixture";
import { sections } from "../../../../../../config/config";

const PitchView = () => {
  const { pitchId, tournamentId } = useParams();

  const tabNames = ["Next", "Finished", "Unplayed"];

  const [fixtures, setFixtures] = useState([]);
  const [nextFixture, setNextFixture] = useState(null);
  const navigate = useNavigate();

  const actions = {
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

  useEffect(() => {
    console.log('please we must')
    actions.fetchFixtures();
  }, []);

  let displayFixtures = tabNames.map((tab) => {
    return fixtures
      .filter((f) => {
        const focusFixture = nextFixture && nextFixture.id === f.id 
        switch (tab.toLowerCase()) {
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
      .map(f => ({...f, tab: tab.toLowerCase()}))
  });
  displayFixtures = {
    next: displayFixtures[0],
    finished: displayFixtures[1],
    unplayed: displayFixtures[2]
  }
  return (
    <MobileLayout
      sections={sections}
      onBack={() => console.log("back back")}
      selected={1}
      tabNames={tabNames}
    >
      <span>
        <span>Pitch:</span>
        <span>{pitchId}</span>
      </span>
      {tabNames.map((tab, i) => {
        return (
          <div key={`tab-${i}`} className="pitchView">
            <div className="fixturesBody">
              <div className="fixturesArea">
                {displayFixtures[tab.toLowerCase()].length ? (
                  displayFixtures[tab.toLowerCase()].map((fixture) => {
                    const focusFixture =
                      nextFixture && nextFixture.id === fixture.id;
                    return (
                      <div
                        key={fixture.id}
                        className={focusFixture ? "focusFixture" : ""}
                      >
                        <Fixture fixture={fixture} isFocus={focusFixture} />
                        {nextFixture && nextFixture.id === fixture.id && (
                          <UpdateFixture
                            fixture={fixture}
                            fixtures={fixtures}
                            updateFixtures={actions.fetchFixtures}
                            startMatch={actions.startMatch}
                          />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="noFixtures">
                    No <span>{tab}</span> fixtures left to display
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </MobileLayout>
  );
};

export default PitchView;
