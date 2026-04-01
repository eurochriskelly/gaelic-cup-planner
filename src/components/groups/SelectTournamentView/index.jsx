import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MobileSelect from "../../../shared/generic/MobileSelect";
import MainCard from "../../..//shared/generic/MainCard";
import { useAppContext } from "../../../shared/js/Provider";
import './SelectTournamentView.scss';

const SelectTournamentView = () => {
  const { tournamentId } = useParams();
  const { sections } = useAppContext();
  const navigate = useNavigate();
  // const { tournamentId } = useParams();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    console.log('Fetching categories for tournament', tournamentId)
    fetch(`/api/tournaments/${tournamentId}/categories`)
      .then((response) => response.json())
      .then((data) => {
        const payload = Array.isArray(data) ? data : data?.data?.categories || data?.data;
        setCategories(Array.isArray(payload) ? payload : []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setCategories([]);
      });
  }, []);

  const handle = {
    select: (cat) => {
      const category = categories.find((t) => t.category === cat);
      navigate(`/tournament/${tournamentId}/category/${cat}`, {
        state: { category },
      });
    },
    back: () => {},
  };

  const minimumCardCount = 4;
  const targetCardCount = Math.max(
    minimumCardCount,
    Math.ceil((categories.length || 0) / 2) * 2
  );
  const placeholderCount = Math.max(0, targetCardCount - categories.length);

  return (
    <MobileSelect sections={sections} active={0} className="select-tournament-page">
      <div>Select competition</div>
      {categories?.map(
        ({ category, latestStage, totalGames, currentGame, brackets }, i) => (
          <MainCard
            key={`mc-${i}`}
            id={category}
            heading={`${category}`}
            onSelect={handle.select}
          >
            <div className="selectTournamentView">
              <table>
                <tbody>
                  <tr>
                    <td>Stage</td>
                  <td>{latestStage}</td>
                </tr>
                <tr>
                  <td>Game #</td>
                  <td>{currentGame}</td>
                </tr>
                <tr>
                  <td>Total matches</td>
                  <td>{totalGames}</td>
                </tr>
                <tr>
                  <td>Brackets</td>
                  <td>
                    <div className="pills">
                      {brackets?.length > 0 ? brackets.map((b, i) => (
                          <span key={`bracket-${i}`} className="pill">
                            {b}
                          </span>
                        )) : <span className="no-brackets">—</span>}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </MainCard>
        )
      )}
      {Array.from({ length: placeholderCount }).map((_, i) => (
        <div
          key={`competition-placeholder-${i}`}
          data-placeholder
          className="competition-placeholder-tile"
        />
      ))}
    </MobileSelect>
  );
};

export default SelectTournamentView;
