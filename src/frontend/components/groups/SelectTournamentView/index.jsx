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
    fetch(`/api/tournaments/${tournamentId}/categories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
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
    <MobileSelect sections={sections} active={0}>
      <div>Select competition</div>
      {categories.map(
        ({ category, latestStage, totalGames, currentGame, brackets }) => (
          <MainCard
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
                      {brackets.map((b, i) => {
                        return (
                          <span key={`bracket-${i}`} className="pill">
                            {b}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </MainCard>
        )
      )}
    </MobileSelect>
  );
};

export default SelectTournamentView;
