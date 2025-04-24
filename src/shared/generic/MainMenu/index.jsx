import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../js/Provider";
import HomeIcon from "../../icons/icon-home-max1.svg?react";

import "./MainMenu.scss";

const MainMenu = ({ selected = 0, height = '9rem' }) => {
  const { tournamentId } = useParams();
  const { sections } = useAppContext();
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
    <header className="MainMenu no-select" style={{ height }}>
      <h1 style={{ height }}>
        <span className="hamburger" onClick={handle.hamburger} >
          <HomeIcon width={86} height={86} />
        </span>
        <span className="title">{title}</span>
        <span className="circled"></span>
      </h1>
    </header>
  );
};

export default MainMenu;
