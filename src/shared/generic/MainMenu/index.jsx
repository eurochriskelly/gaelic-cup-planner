import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../js/Provider";
import PitchIcon from "../../icons/icon-pitch-2.svg?react";

import "./MainMenu.scss";

const MainMenu = ({
  selected = 0,
  height = '9rem'
}) => {
  const { tournamentId, pitchId } = useParams();
  const { sections } = useAppContext();
  const navigate = useNavigate();

  const startTitle = sections.length
    ? sections[selected].title || 'pitch'
    : " ... ";
  const [title, setTitle] = useState(startTitle);
  const handle = {
    hamburger: () => {
      // todo: offer an alternative selection to 'by pitch' 
      navigate(`/tournament/${tournamentId}/selectPitch`);
    },
    action: (sec) => {
      if (sec.action) sec.action();
      navigate(sec.path);
      setTitle(sec.title);
    },
  };
  return (
    <div className="MainMenu no-select" style={{ height }}>
      <span style={{height: "100px", fontSize: "9rem"}} onClick={handle.hamburger} >
        <PitchIcon width={219} height={159} />&nbsp;
      </span>
      <span className="title">{pitchId.replace(/_/g, ' ')}</span>
    </div>
  );
};

export default MainMenu;
