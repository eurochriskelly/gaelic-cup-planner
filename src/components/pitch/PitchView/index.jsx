import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/js/Provider";
import { useFixtureContext } from "./FixturesContext";
import MobileLayout from "../../../shared/generic/MobileLayout";
import Fixture from "./Fixture";
import UpdateFixture from "./UpdateFixture";
import KanbanView from "./Kanban"; // Import the new KanbanView
import './PitchView.scss';

const PitchView = () => {
  const { fixtures, fetchFixtures, nextFixture, pitchId, tournamentId } = useFixtureContext(); // Ensure pitchId, tournamentId from context if needed by KanbanView directly, or it uses useParams
  const { sections } = useAppContext();
  let tabNames = ["Kanban", "Next", "Finished" ] // , "Unplayed"]; // Added Kanban
  tabNames = [ "Next", "Finished", "Unplayed"]; // Added Kanban
  //

  const navigate = useNavigate();
  // State to track the fixture currently being interacted with
  const [currentFocusFixtureId, setCurrentFocusFixtureId] = useState(null);

  // Set the initial focus when the component loads and finds the first nextFixture
  useEffect(() => {
    if (nextFixture && !currentFocusFixtureId) {
      setCurrentFocusFixtureId(nextFixture.id);
    }
    // If nextFixture becomes null (e.g., all played), clear focus? Or keep last focus?
    // For now, only setting initial focus.
  }, [nextFixture]); // Depend on the initially loaded nextFixture

  // Function to explicitly move focus to the next unplayed fixture
  const moveToNextFixture = async () => {
    const currentFocusIndex = fixtures.findIndex(f => f.id === currentFocusFixtureId);
    let nextUnplayedFixture = null;

    // Search *after* the current index first
    for (let i = currentFocusIndex + 1; i < fixtures.length; i++) {
      if (!fixtures[i].played) {
        nextUnplayedFixture = fixtures[i];
        break;
      }
    }
    // If not found after, search from the beginning up to the current index
    if (!nextUnplayedFixture && currentFocusIndex > 0) { // Check currentFocusIndex > 0
      for (let i = 0; i < currentFocusIndex; i++) {
        if (!fixtures[i].played) {
          nextUnplayedFixture = fixtures[i];
          break;
        }
      }
    }

    if (nextUnplayedFixture) {
      console.log("PitchView: Moving to next unplayed fixture:", nextUnplayedFixture);
      setCurrentFocusFixtureId(nextUnplayedFixture.id);
    } else {
      // Handle case where no *other* unplayed fixture is found
      // Maybe check if the *current* one is still unplayed?
      const currentFixtureStillUnplayed = fixtures[currentFocusIndex] && !fixtures[currentFocusIndex].played;
      if (!currentFixtureStillUnplayed) {
        setCurrentFocusFixtureId(null); // Truly no more unplayed fixtures
        console.log("PitchView: No more unplayed fixtures.");
        // Optionally navigate away or show a message
      } else {
        // Stay on the current fixture if it's the only unplayed one left
        console.log("PitchView: Current fixture is the last unplayed one.");
      }
    }
  };


  // This logic is for the list-based tabs, Kanban will render its own content.
  // We filter out "Kanban" for this specific displayFixtures logic.
  const listTabNames = tabNames.filter(t => t.toLowerCase() !== "kanban");

  let displayFixtures = listTabNames.map((tab) => {
    return fixtures
      .filter((f) => {
        const focusFixture = currentFocusFixtureId && currentFocusFixtureId === f.id;
        switch (tab.toLowerCase()) {
          case "next":
            return focusFixture;
          case "finished":
            return f.played;
          case "unplayed":
            return !f.played && !focusFixture;
          // No default case needed as we are iterating over known tab names
        }
        return false; // Should not happen
      })
      .map((f) => ({ ...f, tab: tab.toLowerCase() }));
  });

  // Create an object for easier access, e.g., displayFixtures.next
  const processedListFixtures = {};
  listTabNames.forEach((tabName, index) => {
    processedListFixtures[tabName.toLowerCase()] = displayFixtures[index];
  });

  const handle = {
    back: () => {
      const path = `/tournament/${tournamentId}/selectPitch`;
      navigate(path);
    },
  };

  return (
    <MobileLayout
      sections={sections}
      onBack={handle.back}
      active={1}
      tabNames={tabNames}
    >
      <span>
        <span className="type-pitch">{pitchId}</span>
      </span>
      {tabNames.map((tab, i) => (
        <div key={`tab-${i}`} className="pitchView"> {/* This div is part of MobileLayout's tab content */}
          {tab.toLowerCase() === "kanban" ? (
            <KanbanView />
          ) : (
            <div className="fixturesBody">
              <div className="fixturesArea">
                {processedListFixtures[tab.toLowerCase()] && processedListFixtures[tab.toLowerCase()].length > 0 ? (
                  processedListFixtures[tab.toLowerCase()].map((fixture) => {
                    const isFocusFixture = currentFocusFixtureId && currentFocusFixtureId === fixture.id;
                    return (
                      <div
                        key={fixture.id}
                        className={isFocusFixture ? "focusFixture h-98" : ""}
                      >
                        <Fixture fixture={fixture} onUpdate={fetchFixtures} view={isFocusFixture ? 'next' : fixture.played ? 'finished' : 'unplayed'} />
                        {isFocusFixture && <UpdateFixture fixture={nextFixture} moveToNextFixture={moveToNextFixture} />}
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
          )}
        </div>
      ))}
    </MobileLayout>
  );
};

export default PitchView;
