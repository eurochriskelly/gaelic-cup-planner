import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileInterface from "../../../../shared/generic/MobileInterface";
import MainCard from "../../../../shared/generic/MainCard";
import { sections } from "../../../../../../config/config";

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

  return (
    <MobileInterface
      title="Live tournament updates"
      topTitle="Select competition"
      tabNames={["upcoming", "standings", "knockouts"]}
      // FIXME: only pass selected card
      cardInfo={cardInfo}
      viewType="topview">
      <IfTournamentSelected />
      <IfShowCards tournaments={tournaments} />
      <MobileSelect sections={sections}>
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
