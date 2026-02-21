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

  return (
    <div>
      <div className="sel-comp">Select competition</div>
      <MobileSelect sections={sections} active={0}>
        <div className="sel-comp"></div>
        {categories?.map(
          ({ category, latestStage, totalGames, currentGame, brackets }, i) => (
            <MainCard
              key={`mc-${i}`}
              id={category}
              heading={`${category}`}
              onSelect={handle.select}
            >
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
            </MainCard>
          )
        )}
      </MobileSelect>
    </div>
  );
};

export default SelectTournamentView;
