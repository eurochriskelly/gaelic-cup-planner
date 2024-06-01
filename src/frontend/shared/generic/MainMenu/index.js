import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "../../js/Provider";
import './MainMenu.css';

const MainMenu = ({ 
  selected = 0
}) => {
  const { sections } = useContext();
  const navigate = useNavigate();

  const startTitle = sections.length ? sections[selected].title : ' ... ';
  const [title, setTitle] = useState(startTitle)
  const [visibleMenu, setVisibleMenu] = useState(false);
  const handle = {
    hamburger: () => {
      setVisibleMenu(!visibleMenu);
    },
    action: (sec) => {
      if (sec.action) sec.action();
      navigate(sec.path);
      setTitle(sec.title);
      setVisibleMenu(false);
    }
  }
  return (
    <header className="MainMenu no-select">
      <h1>
        <span className="circled"></span>
        <span>{title}</span>
        <span className="hamburger" onClick={handle.hamburger}>
          &#x2630;
        </span>
      </h1>
      <section className={visibleMenu ? 'visible' : 'not-visible'}>
        <div>
          {
            sections.map((s, i) => {
              return <div key={`sec_${i}`} onClick={handle.action.bind(null, s)}>{s.name}</div>
            }) 
          }
        </div>
      </section>
    </header>
  );
};

export default MainMenu;
