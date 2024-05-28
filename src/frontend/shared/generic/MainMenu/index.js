import React, { useState } from "react";
import './MainMenu.css';

const MainMenu = ({ 
  sections = [],
  selected = 0
}) => {
  const startTitle = sections.length ? sections[selected].title : '';
  const [title, setTitle] = useState(startTitle)
  const [visibleMenu, setVisibleMenu] = useState(false);
  const handle = {
    hamburger: () => {
      setVisibleMenu(!visibleMenu);
    },
    action: (sec) => {
      setTitle(sec.title);
      if (sec.action) sec.action();
      setVisibleMenu(false);
    }
  }
  return (
    <header className="MainMenu no-select">
      <h1>
        <span className="circled">&#x26BD;</span>
        <span>{title}</span>
        <span className="no-select" onClick={handle.hamburger}>
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
