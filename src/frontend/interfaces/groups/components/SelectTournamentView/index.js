import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MobileInterface from "../../../../shared/generic/MobileInterface";
import MobileSelect from "../../../../shared/generic/MobileSelect";
import MainCard from "../../../../shared/generic/MainCard";
import { sections } from "../../../../../../config/config";

const tournamentId = 9;

const SelectTournamentView = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch(`/api/tournaments/${tournamentId}/categories`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCategories(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handle = {
    select: (cat) => {
      console.log("Selected category is ", cat);
      const category = categories.find((t) => t.category === cat);
      navigate(`/tournament/${tournamentId}/category/${cat}`, { state: { category} });
    },
    back: () => {},
  };

  return (
    <MobileInterface>
      <MobileSelect sections={sections}>
        <div>Select competition</div>
        {categories.map(
          ({ category, stage, totalGames, currentGame, brackets }) => (
            <MainCard id={category} heading={`${category}`} onSelect={handle.select}>
              <table>
                <tbody>
                  <tr>
                    <td>Stage</td>
                    <td>{stage}</td>
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
    </MobileInterface>
  );
};

export default SelectTournamentView;
