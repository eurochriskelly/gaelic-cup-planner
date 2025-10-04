import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../shared/js/Provider";
import { useFetchTournament, useFetchPitches } from './LandingPage.hooks';
import NavFooter from '../../../../shared/generic/NavFooter';
import FilterWidget from './FilterWidget';
import ResetIcon from '../../../../shared/icons/icon-reset.svg?react';
import LogoutIcon from '../../../../shared/icons/icon-logout.svg?react';
import ResetUserIcon from '../../../../shared/icons/icon-team.svg?react';
import API from "../../../../shared/api/endpoints";
import './LandingPage.scss';

const LandingPage = () => {
  const { tournamentId } = useParams();
  const [isResetClicked, setIsResetClicked] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { tournInfo } = useFetchTournament(tournamentId);
  const { pitches, isLoading: isLoadingPitches, error: pitchesError } = useFetchPitches(tournamentId);
  const {
    versionInfo,
    filterSelections,
    updateFilterSelections,
    userName,
    setUserNameAndCookie,
    resetUserContext,
  } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const nameInputRef = useRef(null);

  const persistedFilters = filterSelections && typeof filterSelections === "object"
    ? filterSelections
    : {};

  const [nameInput, setNameInput] = useState(() => userName || "");
  const [showNamePrompt, setShowNamePrompt] = useState(() => !userName);

  useEffect(() => {
    setNameInput(userName || "");
    setShowNamePrompt(!userName);
  }, [userName]);

  useEffect(() => {
    if (showNamePrompt && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showNamePrompt]);

  useEffect(() => {
    if (showNamePrompt) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [showNamePrompt]);

  const normaliseId = (id) => (id === null || id === undefined ? null : `${id}`);

  const normaliseAdditional = (values = [], primary) => {
    const list = Array.isArray(values) ? values : [values].filter(Boolean);
    const result = [];
    const seen = new Set();
    list.forEach((value) => {
      const id = normaliseId(value);
      if (!id || id === primary || seen.has(id)) return;
      seen.add(id);
      result.push(id);
    });
    return result;
  };

  const existingPitchSelectionRaw = persistedFilters.pitches || {
    primary: null,
    additional: [],
  };

  console.log('[LandingPage] cookie snapshot', {
    cookie: Cookies.get('ppFilterSelections'),
    persistedFilters,
  });

  const legacyPitchList = Array.isArray(persistedFilters.Pitches)
    ? persistedFilters.Pitches
    : [];

  const primaryFromRaw = normaliseId(existingPitchSelectionRaw.primary);
  const primaryFromLegacy = normaliseId(legacyPitchList[0]);
  const derivedPrimary = primaryFromRaw || primaryFromLegacy || null;

  const existingPitchSelection = {
    primary: derivedPrimary,
    additional: normaliseAdditional(
      existingPitchSelectionRaw.additional?.length
        ? existingPitchSelectionRaw.additional
        : legacyPitchList.slice(derivedPrimary ? 1 : 0),
      derivedPrimary,
    ),
  };

  const arraysEqual = (a = [], b = []) => (
    a.length === b.length && a.every((value, index) => value === b[index])
  );

  const handlePitchSelectionChange = (selection) => {
    const primary = normaliseId(selection.primary);
    const additional = normaliseAdditional(selection.additional || [], primary);

    if (
      primary === existingPitchSelection.primary &&
      arraysEqual(additional, existingPitchSelection.additional)
    ) {
      console.log('[LandingPage] skip update (selection unchanged)', {
        selection,
        existingPitchSelection,
      });
      return;
    }

    const flattened = Array.from(new Set([primary, ...additional].filter(Boolean)));

    console.log('[LandingPage] update cookie', {
      before: Cookies.get('ppFilterSelections'),
      nextSelection: { primary, additional },
      flattened,
    });

    updateFilterSelections({
      ...persistedFilters,
      pitches: { primary, additional },
      Pitches: flattened,
    });

    console.log('[LandingPage] cookie after update (async)', {
      after: Cookies.get('ppFilterSelections'),
    });
  };

  // New: Add scroll listener to toggle shrink class
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50); // Shrink after scrolling 50px
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handle = {
    resetTournament: async () => {
      const button = document.querySelector('.sudo');
      button.classList.add('active');
      await API.resetTournament(tournamentId);
      button.classList.remove('active');
    },
    resetUser: () => {
      resetUserContext?.();
      setNameInput("");
      setShowNamePrompt(true);
      console.log('[LandingPage] user reset – cookies cleared');
    },
    disconnect: () => {
      Cookies.remove("tournamentId");
      navigate("/", { replace: true });
    }
  };

  const handleResetClick = async () => {
    console.log('Reset Tournament clicked');
    setIsResetClicked(true);
    await handle.resetTournament();
    setTimeout(() => {
      setIsResetClicked(false);
    }, 200);
  };

  const handleNameSubmit = (event) => {
    event.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setUserNameAndCookie?.(trimmed);
    setShowNamePrompt(false);
  };

  return (
    <main className={`mobile LandingPage${isScrolled ? ' shrink' : ''}`}>
      {showNamePrompt && (
        <div className="name-prompt-overlay" role="dialog" aria-modal="true" aria-labelledby="namePromptTitle">
          <div className="name-prompt-modal">
            <h2 id="namePromptTitle">Welcome pitch coordinator.</h2>
            <p>Please enter your name and then select the pitch(es) you are coordinating.</p>
            <form className="name-prompt-form" onSubmit={handleNameSubmit}>
              <input
                ref={nameInputRef}
                type="text"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder="Your name"
                aria-label="Your name"
              />
              <button type="submit" disabled={!nameInput.trim()}>
                Save & Continue
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="LandingPage__content" aria-hidden={showNamePrompt}>
        {/* New: Add banner container */}
        <div className="banner-container">
          <img src="/images/pitch-perfect.png" alt="Tournament Banner" className="banner-image" />
          <h1>
            <div className='version-info'>Pitch Perfect. V{versionInfo.mobile.replace(/%/g, '')}</div>
            <div>{t('landingPage_heading', 'Pitch Perfect')}</div>
          </h1>
        </div>
        <header>
          <table>
            <tbody>
              <Row label="date">{tournInfo.Date?.substring(0, 10)}</Row>
              <Row label="title">{tournInfo.Title}</Row>
              <Row label="location">{tournInfo.Location}</Row>
            </tbody>
          </table>
        </header>
        <section className="icon-grid">
          { false && // This is a placeholder for the actual condition
            <div>
              <h2 className="role-selection-heading">Choose your role:</h2>
              <div className="role-selection">
                {['CCO', 'Coordinator', 'Referee', 'Coach'].map((role) => (
                <div key={role} className="role-card" onClick={() => console.log(`Selected role: ${role}`)}>
                  <span className="role-name">{role}</span>
                </div>
              ))}
            </div>
          </div>
        }
        <div className="main-actions">
          <button className='icon-button reset-user' onClick={handle.resetUser}>
            {userName ? (
              <>
                <i className="pi pi-pencil edit-icon" aria-hidden="true" />
                <span className="label user-name-label">{userName}</span>
              </>
            ) : (
              <>
                <ResetUserIcon className="icon" />
                <span className="label">Reset User</span>
              </>
            )}
          </button>
          {+tournamentId === 1 && (
            <button className='icon-button reset-tournament sudo' onClick={handleResetClick}>
              <ResetIcon className="icon" />
              <span className="label">Reset Tournament</span>
            </button>
          )}
          <button className='icon-button logout' onClick={handle.disconnect}>
            <LogoutIcon className="icon" />
            <span className="label">Log Out</span>
          </button>
        </div>

          <div className="filter-schedule">
            <FilterWidget
              pitches={pitches}
              isLoading={isLoadingPitches}
              error={pitchesError}
              initialSelection={existingPitchSelection}
              onSelectionChange={handlePitchSelectionChange}
            />
          </div>
        </section>
        <NavFooter /> 
      </div>
    </main>
  );
};

function Row({ label, children }) {
  return (
    <tr>
      <td>{label}</td>
      <td>{children}</td>
    </tr>
  );
}

export default LandingPage;
