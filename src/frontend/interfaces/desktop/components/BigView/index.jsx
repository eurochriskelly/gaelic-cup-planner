import { useEffect, useState, useTransition } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.scss";
import './BigView.scss';

const BigView = () => {
  const { t } = useTranslation();
  const tt = code => t(`landingPage_${code}`);
  const navigate = useNavigate();
  const { tournamentId, category } = useParams();
  const [fixtures, setFixtures] = useState([]);
  const base = `/tournament/${(tournamentId || 1)}`;
  const jump = {
    design: () => navigate(`${base}/selectCategory`),
  };

  useEffect(() => {
    fetch(`/api/tournaments/${tournamentId}/fixtures`)
      .then((response) => response.json())
      .then((data) => setFixtures(data.data.filter(x => x.category === 'Ladies')))
      .catch((error) => {
        console.error("Error fetching tournament info:", error);
      });
  }, []);


  const getColumns = () => [
    { columnId: "id", width: 50 },
    { columnId: "time", width: 50 },
    { columnId: "pitch", width: 90 },
    { columnId: "stage", width: 120 },
    { columnId: "grp", width: 20 },
    { columnId: "team1", width: 150 },
    { columnId: "goals1", width: 20 },
    { columnId: "points1", width: 30 },
    { columnId: "score1", width: 30 },
    { columnId: "score2", width: 30 },
    { columnId: "goals2", width: 20 },
    { columnId: "points2", width: 30 },
    { columnId: "team2", width: 150 },
    { columnId: "umpireTeam", width: 150 },
  ];

  const headerRow = {
    rowId: "header",
    cells: [
      { type: "header", text: "Match" },
      { type: "header", text: "Time" },
      { type: "header", text: "Pitch" },
      { type: "header", text: "Stage" },
      { type: "header", text: "#" },
      { type: "header", text: "Team 1" },
      { type: "header", text: "G" },
      { type: "header", text: "P" },
      { type: "header", text: "T" },
      { type: "header", text: "T" },
      { type: "header", text: "G" },
      { type: "header", text: "P" },
      { type: "header", text: "Team 2" },
      { type: "header", text: "Umpiring" },
    ]
  };

  const getRows = (fixtures) => [
    headerRow,
    ...fixtures.map((fixture, idx) => {
      const { id, pitch, groupNumber, scheduledTime, team1, goals1, points1, stage, goals2, points2, team2, umpireTeam } = fixture;
      console.log(team1)
      const teamOptions = [
        {
          label: 'Foo',
          value: 'Foo',
        },
        {
          label: 'Bar',
          value: 'Bar',
        },
        {
          label: team1,
          value: team1,
        }
      ]
      return {
        rowId: idx,
        cells: [
          { type: "text", text: `${id}`.substring(2)},
          { type: "text", text: scheduledTime },
          { type: "text", text: pitch },
          { type: "text", text: stage },
          { type: "text", text: `${groupNumber}`},
          { type: "dropdown", values: teamOptions, selectedValue: team1},
          { type: "text", text: `${goals1}`},
          { type: "text", text: `0${points1}`.substr(-2) },
          { type: "text", text: `${points1 + (3 * goals1)}` },
          { type: "text", text: `${points2 + (3 * goals2)}` },
          { type: "text", text: `${goals2}` },
          { type: "text", text: `0${points2}`.substr(-2) },
          { type: "text", text: team2 },
          { type: "text", text: umpireTeam },
        ]
      }
    })
  ];


  const rows = getRows(fixtures);
  const columns = getColumns();

  return (
    <section>
      <ReactGrid rows={rows} columns={columns} />
    </section>
  );
};

export default BigView;

