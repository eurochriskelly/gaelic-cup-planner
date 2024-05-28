import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileInterface from "../../../../shared/generic/MobileInterface";
import MainCard from "../../../../shared/generic/MainCard";
import { Description } from "@storybook/blocks";

const SelectTournamentView = () => {
  console.log("ok wonet");
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  useEffect(() => {
    fetch("/api/tournaments")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTournaments(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const onSelect = (tournamentId) => {
    console.log("Selected tournament", tournamentId);
    const tournament = tournaments.find((t) => t.id === tournamentId);
    console.log("Selected tournament", tournament);
    navigate(`/tournaments/${tournamentId}`, { state: { tournament } });
  };

  const sections = [
    {
      title: "live competitation status",
      name: "competitions",
      action: () => {
        console.log("foo fah");
      },
    },
    {
      title: "field coordination",
      name: "pitches",
      action: () => {
        console.log("fee faw");
      },
    },
  ];
  const cardInfo = [
    { 
      name: "LGFA_JNR",
      description: "LGFA Junior",
      numTeams: 4,
      numGroups: 1, 
      numCups: 1,
      stage: 'preliminary',
      matchesLeftInStage: 3
    },
    { 
      name: "LGFA_SNR",
      description: "LGFA Junior",
      numTeams: 4,
      numGroups: 1,
      numCups: 1,  
      stage: 'knockouts',
      matchesLeftIrStage: 3
    }
  ];
  return (
    <MobileInterface
      title="Live tournament updates"
      topTitle="Select competition"
      tabNames={["upcoming", "standings", "knockouts"]}
      sections={sections}
      // FIXME: only pass selected card
      cardInfo={cardInfo}
      viewType="topview">
      <IfTournamentSelected />
      <IfShowCards tournaments={tournaments} />
    </MobileInterface>
  );
};

export default SelectTournamentView;

// IMPL

function IfTournamentSelected() {
  return <div>
    <div> foo bar</div>
    <div>fee boar</div>
    <div>fwee burr</div>
  </div>
}

function IfShowCards ({
  tournaments = []
}) {
  return <div>
    {
      cardInfo.map(card => {
        
      })
    }
    {tournaments.map(({ Id, Title, Date, Tournament }) => (
      <MainCard id={Id} heading={Title}>
        <div>
          <div>
            <span>Date</span>
            <span>{Date?.substring(0, 10)}</span>
          </div>
          <div>
            <span>Location</span>
            <span>{Location}</span>
          </div>
        </div>
      </MainCard>
    ))}
  </div> 
}
