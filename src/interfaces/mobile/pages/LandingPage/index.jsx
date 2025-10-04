import Cookies from "js-cookie";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../shared/js/Provider";
import { useFetchTournament, useFetchPitches } from './LandingPage.hooks';
import NavFooter from '../../../../shared/generic/NavFooter';
import FilterWidget from './FilterWidget';
import ResetIcon from '../../../../shared/icons/icon-reset.svg?react';
import LogoutIcon from '../../../../shared/icons/icon-logout.svg?react';
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
  } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const persistedFilters = filterSelections && typeof filterSelections === "object"
    ? filterSelections
    : {};

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

  return (
    <main className={`mobile LandingPage${isScrolled ? ' shrink' : ''}`}>
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
          <button className='icon-button' onClick={handle.disconnect}>
            <LogoutIcon className="icon" />
            <span className="label">Log Out</span>
          </button>
          {+tournamentId === 1 && (
            <button className='icon-button sudo' onClick={handleResetClick}>
              <ResetIcon className="icon" />
              <span className="label">Reset Tournament</span>
            </button>
          )}
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
