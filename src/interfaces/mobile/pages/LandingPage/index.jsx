import Cookies from "js-cookie";
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../shared/js/Provider";
import { useFetchTournament, useFetchPitches, useFetchTournamentFixtures } from './LandingPage.hooks';
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { tournInfo } = useFetchTournament(tournamentId);
  const { pitches, isLoading: isLoadingPitches, error: pitchesError } = useFetchPitches(tournamentId);
  const { fixtures: tournamentFixtures } = useFetchTournamentFixtures(tournamentId);
  const {
    versionInfo,
    filterSelections,
    updateFilterSelections,
    userName,
    userRole,
    setUserNameAndCookie,
    resetUserContext,
  } = useAppContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const nameInputRef = useRef(null);
  const landingPageRef = useRef(null);

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
    if (showNamePrompt || showResetConfirm) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [showNamePrompt, showResetConfirm]);

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

    const currentActivePitch = normaliseId(existingPitchSelectionRaw.active || persistedFilters.activePitch);
    const active = flattened.includes(currentActivePitch) ? currentActivePitch : primary;

    updateFilterSelections({
      ...persistedFilters,
      pitches: { primary, additional, active },
      Pitches: flattened,
    });

    console.log('[LandingPage] cookie after update (async)', {
      after: Cookies.get('ppFilterSelections'),
    });
  };

  // New: Add scroll listener to toggle shrink class
  useEffect(() => {
    const element = landingPageRef.current;
    if (!element) return;

    const handleScroll = () => {
      setIsScrolled(element.scrollTop > 50); // Shrink after scrolling 50px
    };
    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, []);

  const handle = {
    resetTournament: async () => {
      const button = document.querySelector('.sudo');
      button?.classList.add('active');
      try {
        await API.resetTournament(tournamentId);
      } finally {
        button?.classList.remove('active');
      }
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

  const handleResetClick = () => {
    console.log('Reset Tournament clicked');
    if (!canResetTournament) return;
    setShowResetConfirm(true);
  };

  const handleResetCancel = () => {
    setShowResetConfirm(false);
  };

  const handleResetConfirm = async () => {
    if (!canResetTournament) {
      setShowResetConfirm(false);
      return;
    }
    setIsResetClicked(true);
    await handle.resetTournament();
    setShowResetConfirm(false);
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

  const scheduleViewMode = persistedFilters.scheduleViewMode === 'normal' ? 'normal' : 'large';

  const handleScheduleViewModeChange = (nextMode) => {
    updateFilterSelections({
      ...persistedFilters,
      scheduleViewMode: nextMode === 'normal' ? 'normal' : 'large',
    });
  };

  const tournamentStatus = (tournInfo?.Status || tournInfo?.status || '').trim().toLowerCase();
  const tournamentDate = typeof tournInfo?.Date === 'string' ? tournInfo.Date.slice(0, 10) : '';
  const now = new Date();
  const firstMatchStart = getFirstMatchStart(tournamentFixtures, tournamentDate);
  const resetMillisecondsRemaining = firstMatchStart ? firstMatchStart.getTime() - now.getTime() : 0;
  const resetHoursRemaining = formatHoursRemaining(resetMillisecondsRemaining);
  const userRoleKey = (userRole || '').trim().toLowerCase();
  const canResetTournament = (
    userRoleKey === 'organizer' &&
    tournamentStatus === 'in-design' &&
    resetMillisecondsRemaining > 0
  );
  const roleModeLabel = `${(userRole || 'spectator').toUpperCase()} MODE`;

  return (
    <main className={`mobile LandingPage${isScrolled ? ' shrink' : ''}`} ref={landingPageRef}>
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
      {showResetConfirm && (
        <div className="reset-confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="resetConfirmTitle">
          <div className="reset-confirm-modal">
            <h2 id="resetConfirmTitle">Reset tournament?</h2>
            <p>
              This will clear all progress. Progress can be cleared for {resetHoursRemaining} more {resetHoursRemaining === '1' ? 'hour' : 'hours'} but not after tournament starts!
            </p>
            <div className="reset-confirm-actions">
              <button type="button" className="cancel" onClick={handleResetCancel}>
                Cancel
              </button>
              <button type="button" className="confirm" onClick={handleResetConfirm} disabled={isResetClicked}>
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="LandingPage__content" aria-hidden={showNamePrompt || showResetConfirm}>
        {/* New: Add banner container */}
        <div className="banner-container">
          <img src="/images/pitch-perfect.png" alt="Tournament Banner" className="banner-image" />
          <div className="banner-footer-bar">
            <div className="banner-title">{t('landingPage_heading', 'Pitch Perfect')}</div>
            {versionInfo?.mobile && (
              <div className="banner-version">{`v${versionInfo.mobile}`}</div>
            )}
          </div>
          <div className="role-mode-banner">
            <i className="pi pi-users role-mode-icon" aria-hidden="true" />
            <span>{roleModeLabel}</span>
          </div>
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
                <div className="user-info">
                  <span className="label user-name-label">{userName}</span>
                  {userRole && <span className="user-role-label">{userRole}</span>}
                </div>
              </>
            ) : (
              <>
                <ResetUserIcon className="icon" />
                <span className="label">Reset User</span>
              </>
            )}
          </button>
          {canResetTournament && (
            <button className='icon-button reset-tournament sudo' onClick={handleResetClick}>
              <ResetIcon className="icon" />
              <span className="label">Reset Tournament</span>
            </button>
          )}
          <button className='icon-button logout' onClick={handle.disconnect}>
            <LogoutIcon className="icon" />
            <span className="label">LEAVE</span>
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
            <div className="schedule-view-mode" aria-label="Schedule size">
              <span>Schedule size</span>
              <div className="schedule-view-mode__buttons" role="group">
                <button
                  type="button"
                  className={scheduleViewMode === 'large' ? 'active' : ''}
                  onClick={() => handleScheduleViewModeChange('large')}
                >
                  Large
                </button>
                <button
                  type="button"
                  className={scheduleViewMode === 'normal' ? 'active' : ''}
                  onClick={() => handleScheduleViewModeChange('normal')}
                >
                  Normal
                </button>
              </div>
            </div>
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

const getFirstMatchStart = (fixtures = [], tournamentDate = '') => {
  const starts = fixtures
    .map((fixture) => getFixtureStart(fixture, tournamentDate))
    .filter(Boolean)
    .sort((a, b) => a.getTime() - b.getTime());

  return starts[0] || null;
};

const getFixtureStart = (fixture = {}, tournamentDate = '') => {
  const timestamp = fixture.scheduled || fixture.plannedStart || fixture.startTime || fixture.StartTime;
  const parsedTimestamp = parseDate(timestamp);
  if (parsedTimestamp) return parsedTimestamp;

  const time = fixture.scheduledTime || fixture.plannedStartTime || fixture.plannedStart || fixture.startTime || fixture.StartTime || fixture.time || fixture.Time;
  if (!tournamentDate || !time) return null;

  const [year, month, day] = tournamentDate.split('-').map(Number);
  const [hours, minutes] = `${time}`.split(':').map(Number);
  if (![year, month, day, hours, minutes].every(Number.isFinite)) return null;

  return new Date(year, month - 1, day, hours, minutes);
};

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatHoursRemaining = (milliseconds) => {
  const hours = Math.max(0, milliseconds / (60 * 60 * 1000));
  const flooredToTenth = Math.floor(hours * 10) / 10;
  const safeHours = Math.max(0.1, flooredToTenth);

  return Number.isInteger(safeHours) ? `${safeHours}` : safeHours.toFixed(1);
};
