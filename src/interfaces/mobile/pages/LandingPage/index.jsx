import Cookies from "js-cookie";
import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../../shared/js/Provider";
import { useFetchTournament, useFetchPitches, useFetchTournamentFixtures } from './LandingPage.hooks';
import AuthenticatedBanner from '../../../../shared/generic/AuthenticatedBanner';
import NavFooter from '../../../../shared/generic/NavFooter';
import FilterWidget from './FilterWidget';
import ResetIcon from '../../../../shared/icons/icon-reset.svg?react';
import API from "../../../../shared/api/endpoints";
import './LandingPage.scss';

const SCHEDULE_TIP_COOKIE = 'ppHomeScheduleTipDismissed';
const COOKIE_OPTIONS = { path: "/" };

const LandingPage = () => {
  const { tournamentId } = useParams();
  const [isResetClicked, setIsResetClicked] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const { tournInfo, setTournInfo } = useFetchTournament(tournamentId);
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
  const coordinatorCodeRefs = useRef([]);

  const persistedFilters = filterSelections && typeof filterSelections === "object"
    ? filterSelections
    : {};

  const [nameInput, setNameInput] = useState(() => userName || "");
  const [showNamePrompt, setShowNamePrompt] = useState(() => !userName);
  const [tournamentDraft, setTournamentDraft] = useState(() => buildTournamentDraft(tournInfo));
  const [hasEditedTournamentDraft, setHasEditedTournamentDraft] = useState(false);
  const [isSavingTournament, setIsSavingTournament] = useState(false);
  const [tournamentSaveError, setTournamentSaveError] = useState('');
  const [showTournamentSettings, setShowTournamentSettings] = useState(false);
  const [showScheduleTip, setShowScheduleTip] = useState(false);
  const [isScheduleTipFading, setIsScheduleTipFading] = useState(false);
  const scheduleTipCookie = useMemo(
    () => buildScheduleTipCookieName(tournamentId, userRole, userName),
    [tournamentId, userRole, userName],
  );

  useEffect(() => {
    setNameInput(userName || "");
    setShowNamePrompt(!userName);
  }, [userName]);

  useEffect(() => {
    if (!hasEditedTournamentDraft) {
      setTournamentDraft(buildTournamentDraft(tournInfo));
    }
  }, [tournInfo, hasEditedTournamentDraft]);

  useEffect(() => {
    if (showNamePrompt && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showNamePrompt]);

  useEffect(() => {
    if (showNamePrompt || showResetConfirm || showTournamentSettings) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [showNamePrompt, showResetConfirm, showTournamentSettings]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsScheduleTipFading(false);
    setShowScheduleTip(Cookies.get(scheduleTipCookie) !== 'true');
  }, [scheduleTipCookie]);

  const canShowScheduleTip = showScheduleTip && !showNamePrompt && !showResetConfirm && !showTournamentSettings;

  useEffect(() => {
    if (!canShowScheduleTip) return undefined;

    const fadeTimer = setTimeout(() => {
      setIsScheduleTipFading(true);
      Cookies.set(scheduleTipCookie, 'true', { expires: 3650, path: "/" });
    }, 30000);

    const removeTimer = setTimeout(() => {
      setShowScheduleTip(false);
    }, 30600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [canShowScheduleTip, scheduleTipCookie]);

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

  const handle = {
    resetTournament: async () => {
      const button = document.querySelector('.sudo');
      button?.classList.add('active');
      try {
        const response = await API.resetTournament(tournamentId);
        if (response && response.ok === false) {
          throw new Error(`Reset tournament failed with status ${response.status}`);
        }
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
      Cookies.remove("tournamentId", COOKIE_OPTIONS);
      navigate("/", { replace: true });
    }
  };

  const handleResetClick = () => {
    console.log('Reset Tournament clicked');
    setShowResetConfirm(true);
  };

  const handleResetCancel = () => {
    setShowResetConfirm(false);
  };

  const handleResetConfirm = async () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (tournamentDate <= todayStr) {
      setShowResetConfirm(false);
      return;
    }
    setIsResetClicked(true);
    try {
      await handle.resetTournament();
      setShowResetConfirm(false);
    } finally {
      setTimeout(() => {
        setIsResetClicked(false);
      }, 200);
    }
  };

  const handleNameSubmit = (event) => {
    event.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setUserNameAndCookie?.(trimmed);
    setShowNamePrompt(false);
  };

  const tournamentBase = buildTournamentDraft(tournInfo);
  const tournamentChanges = getTournamentChanges(tournamentBase, tournamentDraft);
  const hasTournamentChanges = Object.keys(tournamentChanges).length > 0;
  const tournamentDate = typeof tournInfo?.Date === 'string' ? tournInfo.Date.slice(0, 10) : '';
  const firstMatchStart = getFirstMatchStart(tournamentFixtures, tournamentDate);
  const resetMillisecondsRemaining = firstMatchStart ? firstMatchStart.getTime() - currentTime.getTime() : 0;
  const resetHoursRemaining = formatHoursRemaining(resetMillisecondsRemaining);
  const userRoleKey = (userRole || '').trim().toLowerCase();
  const isOrganizer = userRoleKey.includes('organizer');
  const todayStr = new Date().toISOString().slice(0, 10);
  const canResetTournament = isOrganizer && tournamentDate > todayStr;
  const roleLabel = (userRole || 'spectator').toUpperCase();
  const resetTimeLimitText = firstMatchStart
    ? `Progress can be cleared for ${resetHoursRemaining} more ${resetHoursRemaining === '1' ? 'hour' : 'hours'} but not after tournament starts!`
    : 'Progress can be cleared until tournament starts!';

  const updateTournamentDraft = (field, value) => {
    setTournamentDraft((current) => ({
      ...current,
      [field]: value,
    }));
    setHasEditedTournamentDraft(true);
    setTournamentSaveError('');
  };

  const handleCoordinatorCodeChange = (index, value) => {
    const nextChar = sanitiseCodeChar(value);
    const currentChars = toCodeChars(tournamentDraft.codeCoordinator);
    currentChars[index] = nextChar;
    updateTournamentDraft('codeCoordinator', currentChars.join(''));

    if (nextChar && index < 3) {
      coordinatorCodeRefs.current[index + 1]?.focus();
    }
  };

  const handleCoordinatorCodePaste = (event) => {
    const nextCode = sanitiseCode(event.clipboardData.getData('text'));
    if (!nextCode) return;
    event.preventDefault();
    updateTournamentDraft('codeCoordinator', nextCode);
    coordinatorCodeRefs.current[Math.min(nextCode.length, 4) - 1]?.focus();
  };

  const handleCoordinatorCodeKeyDown = (event, index) => {
    if (
      event.key === 'Backspace' &&
      !toCodeChars(tournamentDraft.codeCoordinator)[index] &&
      index > 0
    ) {
      coordinatorCodeRefs.current[index - 1]?.focus();
    }
  };

  const handleGenerateCoordinatorCode = () => {
    updateTournamentDraft('codeCoordinator', generateNumericCode());
    coordinatorCodeRefs.current[0]?.focus();
  };

  const handleOpenTournamentSettings = () => {
    setTournamentDraft(tournamentBase);
    setHasEditedTournamentDraft(false);
    setTournamentSaveError('');
    setShowTournamentSettings(true);
  };

  const handleTournamentCancel = () => {
    setTournamentDraft(tournamentBase);
    setHasEditedTournamentDraft(false);
    setTournamentSaveError('');
    setShowTournamentSettings(false);
  };

  const handleTournamentSave = async () => {
    const payload = getTournamentUpdatePayload(tournamentBase, tournamentDraft);
    if (!Object.keys(payload).length) {
      setHasEditedTournamentDraft(false);
      return;
    }

    const validationError = validateTournamentDraft(tournamentDraft);
    if (validationError) {
      setTournamentSaveError(validationError);
      return;
    }

    setIsSavingTournament(true);
    setTournamentSaveError('');

    try {
      const response = await API.updateTournament(tournamentId, payload);
      const responseData = response?.data && typeof response.data === 'object'
        ? response.data
        : {};
      setTournInfo((current) => ({
        ...current,
        ...mapTournamentPayloadToInfo(payload),
        ...responseData,
      }));
      setHasEditedTournamentDraft(false);
      setShowTournamentSettings(false);
    } catch (error) {
      console.error('Error updating tournament details', error);
      setTournamentSaveError('Tournament details could not be saved.');
    } finally {
      setIsSavingTournament(false);
    }
  };

  return (
    <main className="mobile LandingPage">
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
              This will clear all progress. {resetTimeLimitText}
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
      {showTournamentSettings && (
        <div className="tournament-settings-overlay" role="dialog" aria-modal="true" aria-labelledby="tournamentSettingsTitle">
          <div className="tournament-settings-modal">
            <div className="settings-modal-header">
              <h2 id="tournamentSettingsTitle">Tournament settings</h2>
              <button type="button" onClick={handleTournamentCancel} aria-label="Close tournament settings">
                <i className="pi pi-times" aria-hidden="true" />
              </button>
            </div>
            <div className="settings-form">
              <section className="settings-group">
                <h3>Details</h3>
                <TournamentTextField
                  label="Date"
                  type="date"
                  value={tournamentDraft.date}
                  editable
                  onChange={(value) => updateTournamentDraft('date', value)}
                />
                <TournamentTextField
                  label="Title"
                  value={tournamentDraft.title}
                  editable
                  onChange={(value) => updateTournamentDraft('title', value)}
                />
                <TournamentTextField
                  label="Location"
                  value={tournamentDraft.location}
                  editable
                  onChange={(value) => updateTournamentDraft('location', value)}
                />
              </section>
              <section className="settings-group">
                <div className="settings-group-heading">
                  <h3>Coordinator code</h3>
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={handleGenerateCoordinatorCode}
                    disabled={isSavingTournament}
                  >
                    Autogen
                  </button>
                </div>
                <div className="coordinator-code-inputs" aria-label="Coordinator code">
                  {toCodeChars(tournamentDraft.codeCoordinator).map((char, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        coordinatorCodeRefs.current[index] = element;
                      }}
                      type="text"
                      inputMode="text"
                      autoCapitalize="characters"
                      value={char}
                      maxLength={1}
                      aria-label={`Coordinator code character ${index + 1}`}
                      onChange={(event) => handleCoordinatorCodeChange(index, event.target.value)}
                      onPaste={handleCoordinatorCodePaste}
                      onKeyDown={(event) => handleCoordinatorCodeKeyDown(event, index)}
                      disabled={isSavingTournament}
                    />
                  ))}
                </div>
              </section>
              <section className="settings-group">
                <h3>Point allocations</h3>
                <div className="point-allocation-fields">
                  <PointAllocationField
                    label="Win points"
                    value={tournamentDraft.winPoints}
                    editable
                    onChange={(value) => updateTournamentDraft('winPoints', value)}
                  />
                  <PointAllocationField
                    label="Draw points"
                    value={tournamentDraft.drawPoints}
                    editable
                    onChange={(value) => updateTournamentDraft('drawPoints', value)}
                  />
                  <PointAllocationField
                    label="Loss points"
                    value={tournamentDraft.lossPoints}
                    editable
                    onChange={(value) => updateTournamentDraft('lossPoints', value)}
                  />
                </div>
              </section>
            </div>
            {tournamentSaveError && (
              <div className="tournament-save-error" role="alert">
                {tournamentSaveError}
              </div>
            )}
            <div className="tournament-form-actions">
              <button type="button" className="cancel" onClick={handleTournamentCancel} disabled={isSavingTournament}>
                Cancel
              </button>
              <button type="button" className="save" onClick={handleTournamentSave} disabled={isSavingTournament || !hasTournamentChanges}>
                {isSavingTournament ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="LandingPage__content" aria-hidden={showNamePrompt || showResetConfirm || showTournamentSettings}>
        <AuthenticatedBanner
          kicker={roleLabel}
          title={t('landingPage_heading', 'Pitch Perfect')}
          meta={versionInfo?.mobile ? `v${versionInfo.mobile}` : ''}
          onExit={handle.disconnect}
          onUserClick={handle.resetUser}
          userName={userName}
        />
        <header className={`tournament-summary${isOrganizer ? ' editable' : ''}`}>
          <table>
            <tbody>
              <Row label="date">{tournamentBase.date}</Row>
              <Row label="title">{tournamentBase.title}</Row>
              <Row label="location">{tournamentBase.location}</Row>
            </tbody>
          </table>
          {isOrganizer && (
            <button
              type="button"
              className="tournament-edit"
              onClick={handleOpenTournamentSettings}
              aria-label="Edit tournament settings"
            >
              <i className="pi pi-pencil" aria-hidden="true" />
            </button>
          )}
        </header>
        {isOrganizer && (
          <section className="home-info-card coordinator-code-summary">
            <h2>Coordinator code</h2>
            <div className="code-display" aria-label="Coordinator code">
              {toCodeChars(tournamentBase.codeCoordinator).map((char, index) => (
                <span key={index}>{char || '-'}</span>
              ))}
            </div>
          </section>
        )}
        <section className="home-info-card point-allocation-summary">
          <h2>Point allocations</h2>
          <div className="point-summary-grid">
            <div>
              <strong>{tournamentBase.winPoints}</strong>
              <span>Win</span>
            </div>
            <div>
              <strong>{tournamentBase.drawPoints}</strong>
              <span>Draw</span>
            </div>
            <div>
              <strong>{tournamentBase.lossPoints}</strong>
              <span>Loss</span>
            </div>
          </div>
        </section>
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
        {canResetTournament && (
          <div className="main-actions">
            <button type="button" className='icon-button reset-tournament sudo' onClick={handleResetClick}>
              <ResetIcon className="icon" />
              <span className="label">Reset Tournament</span>
            </button>
          </div>
        )}

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
        {canShowScheduleTip && (
          <div className={`schedule-tutorial-tip${isScheduleTipFading ? ' is-fading' : ''}`} role="status">
            Tap on schedule to update fixtures
          </div>
        )}
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

function TournamentTextField({ label, type = 'text', value, editable, onChange }) {
  return (
    <label className="tournament-field">
      <span>{label}</span>
      {editable ? (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <strong>{value || '-'}</strong>
      )}
    </label>
  );
}

function PointAllocationField({ label, value, editable, onChange }) {
  return (
    <label className="point-allocation-field">
      <span>{label}</span>
      {editable ? (
        <input
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <strong>{value}</strong>
      )}
    </label>
  );
}

export default LandingPage;

const buildTournamentDraft = (tournInfo = {}) => ({
  date: normaliseDateValue(tournInfo.Date || tournInfo.date),
  title: tournInfo.Title || tournInfo.title || '',
  location: tournInfo.Location || tournInfo.location || '',
  codeCoordinator: sanitiseCode(
    tournInfo.codeCoordinator ||
    tournInfo.CodeCoordinator ||
    tournInfo.coordinatorCode ||
    '',
  ),
  winPoints: normalisePointValue(tournInfo.winPoints ?? tournInfo.WinPoints, 2),
  drawPoints: normalisePointValue(tournInfo.drawPoints ?? tournInfo.DrawPoints, 1),
  lossPoints: normalisePointValue(tournInfo.lossPoints ?? tournInfo.LossPoints, 0),
});

const getTournamentChanges = (base, draft) => {
  const changes = {};
  Object.keys(draft).forEach((field) => {
    if (`${draft[field]}` !== `${base[field]}`) {
      changes[field] = draft[field];
    }
  });
  return changes;
};

const getTournamentUpdatePayload = (base, draft) => {
  const changes = getTournamentChanges(base, draft);
  const payload = {};

  if (changes.date !== undefined) payload.date = changes.date;
  if (changes.title !== undefined) payload.title = changes.title.trim();
  if (changes.location !== undefined) payload.location = changes.location.trim();
  if (changes.codeCoordinator !== undefined) payload.codeCoordinator = sanitiseCode(changes.codeCoordinator);
  if (changes.winPoints !== undefined) payload.winPoints = Number(changes.winPoints);
  if (changes.drawPoints !== undefined) payload.drawPoints = Number(changes.drawPoints);
  if (changes.lossPoints !== undefined) payload.lossPoints = Number(changes.lossPoints);

  return payload;
};

const mapTournamentPayloadToInfo = (payload) => {
  const mapped = {};

  if (payload.date !== undefined) mapped.Date = payload.date;
  if (payload.title !== undefined) mapped.Title = payload.title;
  if (payload.location !== undefined) mapped.Location = payload.location;
  if (payload.codeCoordinator !== undefined) mapped.codeCoordinator = payload.codeCoordinator;
  if (payload.winPoints !== undefined) mapped.winPoints = payload.winPoints;
  if (payload.drawPoints !== undefined) mapped.drawPoints = payload.drawPoints;
  if (payload.lossPoints !== undefined) mapped.lossPoints = payload.lossPoints;

  return mapped;
};

const normaliseDateValue = (value) => (typeof value === 'string' ? value.slice(0, 10) : '');

const normalisePointValue = (value, fallback) => (
  Number.isFinite(Number(value)) ? `${Number(value)}` : `${fallback}`
);

const sanitiseCodeChar = (value) => (
  `${value || ''}`.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 1)
);

const sanitiseCode = (value) => (
  `${value || ''}`.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
);

const toCodeChars = (value) => {
  const code = sanitiseCode(value);
  return Array.from({ length: 4 }, (_, index) => code[index] || '');
};

const generateNumericCode = () => (
  Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')
);

const validateTournamentDraft = (draft) => {
  if (!draft.date) return 'Tournament date is required.';
  if (!draft.title.trim()) return 'Tournament title is required.';
  if (!draft.location.trim()) return 'Tournament location is required.';
  if (sanitiseCode(draft.codeCoordinator).length !== 4) return 'Coordinator code must be 4 characters.';

  const pointValues = [draft.winPoints, draft.drawPoints, draft.lossPoints];
  const hasInvalidPoints = pointValues.some((value) => {
    const numeric = Number(value);
    return !Number.isInteger(numeric) || numeric < 0;
  });

  return hasInvalidPoints ? 'Point allocations must be whole numbers of 0 or more.' : '';
};

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

const canResetAt = (userRoleKey, firstMatchStart, comparisonTime) => (
  userRoleKey.includes('organizer') &&
  !hasTournamentStarted(firstMatchStart, comparisonTime)
);

const hasTournamentStarted = (firstMatchStart, comparisonTime) => (
  Boolean(firstMatchStart) && firstMatchStart.getTime() <= comparisonTime.getTime()
);

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

const buildScheduleTipCookieName = (tournamentId, userRole, userName) => {
  const parts = [tournamentId || 'unknown', userRole || 'spectator', userName || 'anonymous']
    .map((part) => encodeURIComponent(`${part}`));

  return `${SCHEDULE_TIP_COOKIE}_${parts.join('_')}`;
};
