import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/js/Provider";
import { useFetchFixtures, useStartMatch } from "./PitchView.hooks";
import MobileLayout from "../../../shared/generic/MobileLayout";
import Fixture from "./Fixture";
import Focused from "./Focused";
import UpdateFixture from "./UpdateFixture";
import './PitchView.scss';

const PitchView = () => {
    const { pitchId, tournamentId } = useParams();
    const { sections } = useAppContext();
    const tabNames = ["Next", "Finished", "Unplayed"];

    const { fixtures, nextFixture, fetchFixtures } = useFetchFixtures(tournamentId, pitchId);
    const startMatch = useStartMatch(tournamentId, pitchId, fetchFixtures);
    const navigate = useNavigate();

    let displayFixtures = tabNames.map((tab) => {
        return fixtures
            .filter((f) => {
                const focusFixture = nextFixture && nextFixture.id === f.id;
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
            .map((f) => ({ ...f, tab: tab.toLowerCase() }));
    });

    displayFixtures = {
        next: displayFixtures[0],
        finished: displayFixtures[1],
        unplayed: displayFixtures[2],
    };

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
            {tabNames.map((tab, i) => {
                return (
                    <div key={`tab-${i}`} className="pitchView">
                        <div className="fixturesBody">
                            <div className="fixturesArea">
                                {displayFixtures[tab.toLowerCase()].length ? (
                                    displayFixtures[tab.toLowerCase()].map((fixture) => {
                                        const focusFixture = nextFixture && nextFixture.id === fixture.id;
                                        return <div key={fixture.id}>{
                                            focusFixture
                                                ? (
                                                    <Focused fixture={fixture} isFocus={focusFixture}>
                                                        <UpdateFixture
                                                            fixture={fixture}
                                                            fixtures={fixtures}
                                                            updateFixtures={fetchFixtures}
                                                            startMatch={startMatch}
                                                        />
                                                    </Focused>
                                                )
                                                : <Fixture fixture={fixture} isFocus={focusFixture} />
                                        }</div>
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
