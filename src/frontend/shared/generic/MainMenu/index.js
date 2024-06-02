import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "../../js/Provider";
import "./MainMenu.css";

const MainMenu = ({ selected = 0 }) => {
  const { tournamentId } = useParams();
  const { sections } = useContext();
  const navigate = useNavigate();

  const startTitle = sections.length ? sections[selected].title : " ... ";
  const [title, setTitle] = useState(startTitle);
  const handle = {
    hamburger: () => navigate(`/tournament/${tournamentId}`),
    action: (sec) => {
      if (sec.action) sec.action();
      navigate(sec.path);
      setTitle(sec.title);
    },
  };
  return (
    <header className="MainMenu no-select">
      <h1>
        <span className="hamburger" onClick={handle.hamburger} />
        <span>{title}</span>
        <span className="circled"></span>
      </h1>
    </header>
  );
};
export default MainMenu;
