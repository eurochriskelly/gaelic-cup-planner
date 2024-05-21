import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../../shared/api/pitch";
import Fixture from "./Fixture";
import PitchViewHeader from "./PitchViewHeader";
import UpdateFixture from "./UpdateFixture";

const PitchView = () => {
  const { pitchId, tournamentId } = useParams();

  const [fixtures, setFixtures] = useState([]);
  const [nextFixture, setNextFixture] = useState(null);
  const [fixtureFilter, setFixtureFilter] = useState("next");
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
    actions.fetchFixtures()
  }, []);
  const displayFixtures = fixtures.filter((f) => {
    const focusFixture = nextFixture && nextFixture.id === f.id;
    switch (fixtureFilter.toLowerCase()) {
      case "next": return focusFixture;
      case "finished": return f.played;
      case "unplayed": return !f.played && !focusFixture;
      default: return true;
    }
  })
  return (
    <>
      <h1>Field Coordinator</h1>
      <div className="pitchView">
        <PitchViewHeader
          pitchId={pitchId}
          backToSelection={() => navigate(`/tournaments/${tournamentId}`)}
          changeTab={setFixtureFilter}
        />
        <div className="fixturesBody">
          <div className="fixturesArea">
            {displayFixtures.length 
            ? displayFixtures
              .map((fixture, i) => {
                const focusFixture = nextFixture && nextFixture.id === fixture.id;
                return (
                  <div
                    key={fixture.id}
                    className={focusFixture ? "focusFixture" : ""}>
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
            : <div className="noFixtures">No <span>{fixtureFilter}</span> fixtures left to display</div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default PitchView;
