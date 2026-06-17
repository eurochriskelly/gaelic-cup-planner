import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../shared/js/Provider";
import API from "../../api/endpoints.js";
import LoginHeader from "../LoginHeader";
import OfficialsIcon from "../../icons/icon-umpires-circle.svg?react";
import Cookies from "js-cookie";
import "./PinLogin.scss";
import config from "../../../interfaces/mobile/config";

const pinProtectedRoles = ['organizer', 'coordinator', 'coach', 'referee'];
const officialsLoginTransitionDurationMs = 1300;
const allCompetitionsOption = {
  value: '*',
  label: 'All competitions',
  isAllCompetitions: true,
};

const PinLogin = () => {
  const { tournamentId: routeTournamentId } = useParams();
  const { setupTournament, versionInfo, userRole, setUserRoleAndCookie } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [pin, setPin] = useState(["", "", "", ""]);
  const [isThinking, setIsThinking] = useState(false);
  const [message, setMessage] = useState("");
  const pinInputRef = useRef(null);
  const [availableTournaments, setAvailableTournaments] = useState([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [pinEntryRole, setPinEntryRole] = useState(() => (
    pinProtectedRoles.includes((userRole || '').toLowerCase())
      ? userRole.toLowerCase()
      : null
  ));
  const [showRoleLogin, setShowRoleLogin] = useState(false);
  const [competitions, setCompetitions] = useState([]);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(false);
  const [competitionFetchFailed, setCompetitionFetchFailed] = useState(false);
  const [isOfficialsRevealActive, setIsOfficialsRevealActive] = useState(false);
  const [isOfficialsLoginTransitioning, setIsOfficialsLoginTransitioning] = useState(false);
  const officialsRevealTimeoutRef = useRef(null);
  const officialsLoginTransitionTimeoutRef = useRef(null);

  const currentRole = (userRole || 'spectator').toLowerCase();

  const tournamentHeading = routeTournamentId
    ? 'Latest results'
    : 'Upcoming tournaments';

  const competitionOptions = useMemo(() => {
    if (competitions.length > 0) return competitions;
    if (!isLoadingCompetitions && (selectedTournament || competitionFetchFailed)) {
      return [allCompetitionsOption];
    }
    return [];
  }, [competitions, isLoadingCompetitions, selectedTournament, competitionFetchFailed]);

  const tournamentAgenda = useMemo(() => (
    buildTournamentAgenda(availableTournaments)
  ), [availableTournaments]);

  useEffect(() => {
    document.body.classList.add('pin-login-screen');

    return () => {
      document.body.classList.remove('pin-login-screen');
      if (officialsRevealTimeoutRef.current) {
        clearTimeout(officialsRevealTimeoutRef.current);
      }
      if (officialsLoginTransitionTimeoutRef.current) {
        clearTimeout(officialsLoginTransitionTimeoutRef.current);
      }
    };
  }, []);

  const focusPinInput = () => {
    if (!pinEntryRole) return;
    try {
      pinInputRef.current?.focus({ preventScroll: true });
    } catch {
      pinInputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!showRoleLogin) return undefined;

    const animationFrame = requestAnimationFrame(() => {
      focusPinInput();
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [showRoleLogin, pinEntryRole]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedRoleParam = params.get('role')?.toLowerCase();
    const requestedRole = requestedRoleParam === 'organiser'
      ? 'organizer'
      : requestedRoleParam;
    const validRoles = ['spectator', ...pinProtectedRoles];

    if (requestedRole && validRoles.includes(requestedRole)) {
      if (pinProtectedRoles.includes(requestedRole)) {
        setPinEntryRole(requestedRole);
        setShowRoleLogin(Boolean(selectedTournament || routeTournamentId));
      }

      if (requestedRole === 'spectator' && requestedRole !== currentRole) {
        setUserRoleAndCookie(requestedRole);
      }

      params.delete('role');
      const nextSearch = params.toString();
      navigate(
        {
          pathname: location.pathname,
          search: nextSearch ? `?${nextSearch}` : '',
        },
        { replace: true },
      );
    }
  }, [
    location.pathname,
    location.search,
    currentRole,
    navigate,
    routeTournamentId,
    selectedTournament,
    setUserRoleAndCookie,
  ]);

  useEffect(() => {
    if (import.meta.env.VITE_BYPASS_AUTH === '1') {
      const bypassTournamentId = import.meta.env.VITE_TOURNAMENT_ID;
      if (bypassTournamentId) {
        setupTournament(bypassTournamentId);
        Cookies.set('tournamentId', bypassTournamentId, { expires: 1 / 24, path: '/' });
        navigate(`/tournament/${bypassTournamentId}/home`, { replace: true });
        return;
      }
    }

    setIsLoadingTournaments(true);
    setFetchError(null);
    API.fetchActiveTournaments()
      .then(response => {
        setAvailableTournaments(response?.data || []);
      })
      .catch(error => {
        console.error("Error fetching tournaments:", error);
        setFetchError("Failed 2 load tournaments!");
        setAvailableTournaments([]);
      })
      .finally(() => {
        setIsLoadingTournaments(false);
      });
  }, [navigate, setupTournament]);

  useEffect(() => {
    if (!routeTournamentId) return;

    const listedTournament = availableTournaments.find((tournament) => (
      `${tournament.Id}` === `${routeTournamentId}`
    ));

    if (listedTournament) {
      setupTournament(listedTournament.Id);
      Cookies.set("tournamentId", listedTournament.Id, { expires: 1 / 24, path: "/" });
      setSelectedTournament(listedTournament);
      return;
    }

    let isMounted = true;
    fetch(`/api/tournaments/${routeTournamentId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!isMounted) return;
        const tournament = data?.data || data;
        const nextTournament = {
          Id: tournament?.Id || tournament?.id || routeTournamentId,
          Title: tournament?.Title || tournament?.title || 'Selected tournament',
          Location: tournament?.Location || tournament?.location || '',
          Date: tournament?.Date || tournament?.date || '',
          eventUuid: tournament?.eventUuid,
          code: tournament?.code,
        };
        setupTournament(nextTournament.Id);
        Cookies.set("tournamentId", nextTournament.Id, { expires: 1 / 24, path: "/" });
        setSelectedTournament(nextTournament);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Error fetching selected tournament:", error);
        const fallbackTournament = {
          Id: routeTournamentId,
          Title: 'Selected tournament',
          Location: '',
          Date: '',
        };
        setupTournament(fallbackTournament.Id);
        Cookies.set("tournamentId", fallbackTournament.Id, { expires: 1 / 24, path: "/" });
        setSelectedTournament(fallbackTournament);
      });

    return () => {
      isMounted = false;
    };
  }, [routeTournamentId, availableTournaments, setupTournament]);

  useEffect(() => {
    if (!selectedTournament?.Id) {
      setCompetitions([]);
      setCompetitionFetchFailed(false);
      return;
    }

    let isMounted = true;
    setIsLoadingCompetitions(true);
    setCompetitionFetchFailed(false);

    fetch(`/api/tournaments/${selectedTournament.Id}/categories`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        const payload = Array.isArray(data) ? data : data?.data?.categories || data?.data;
        setCompetitions(normaliseCompetitions(payload));
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Error fetching competitions:", error);
        setCompetitions([]);
        setCompetitionFetchFailed(true);
      })
      .finally(() => {
        if (isMounted) setIsLoadingCompetitions(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedTournament?.Id]);

  const resetPinEntry = () => {
    setPin(["", "", "", ""]);
    setMessage("");
    setFailedAttempts(0);
  };

  const hideOfficialsReveal = () => {
    if (officialsRevealTimeoutRef.current) {
      clearTimeout(officialsRevealTimeoutRef.current);
      officialsRevealTimeoutRef.current = null;
    }
    if (officialsLoginTransitionTimeoutRef.current) {
      clearTimeout(officialsLoginTransitionTimeoutRef.current);
      officialsLoginTransitionTimeoutRef.current = null;
    }
    setIsOfficialsRevealActive(false);
    setIsOfficialsLoginTransitioning(false);
  };

  const revealOfficialsAccess = () => {
    hideOfficialsReveal();
    setIsOfficialsRevealActive(true);
    officialsRevealTimeoutRef.current = setTimeout(() => {
      setIsOfficialsRevealActive(false);
      officialsRevealTimeoutRef.current = null;
    }, 5000);
  };

  const handleBackClick = () => {
    hideOfficialsReveal();

    if (showRoleLogin) {
      setShowRoleLogin(false);
      resetPinEntry();
      return;
    }

    setSelectedTournament(null);
    setShowRoleLogin(false);
    resetPinEntry();
    if (routeTournamentId) {
      navigate("/", { replace: true });
    }
  };

  const handleTournamentCardClick = (tournament) => {
    hideOfficialsReveal();
    setMessage("");
    setSelectedTournament(tournament);
    setShowRoleLogin(false);
    setupTournament(tournament.Id);
    Cookies.set("tournamentId", tournament.Id, { expires: 1 / 24, path: "/" });
    navigate(`/tournament/${tournament.Id}`, { replace: false });
  };

  const handleCompetitionSelect = (competition) => {
    redirectToLiveScores(selectedTournament, competition);
  };

  const handleChangeRoleClick = () => {
    hideOfficialsReveal();
    setPinEntryRole(null);
    resetPinEntry();
    setShowRoleLogin(true);
  };

  const startOfficialsLoginTransition = () => {
    if (officialsRevealTimeoutRef.current) {
      clearTimeout(officialsRevealTimeoutRef.current);
      officialsRevealTimeoutRef.current = null;
    }

    setIsOfficialsLoginTransitioning(true);
    setPinEntryRole(null);
    resetPinEntry();
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    officialsLoginTransitionTimeoutRef.current = setTimeout(() => {
      officialsLoginTransitionTimeoutRef.current = null;
      setIsOfficialsRevealActive(false);
      setIsOfficialsLoginTransitioning(false);
      setShowRoleLogin(true);
    }, officialsLoginTransitionDurationMs);
  };

  const handleOfficialsAccessClick = () => {
    if (isOfficialsLoginTransitioning) return;

    if (isOfficialsRevealActive) {
      startOfficialsLoginTransition();
      return;
    }

    revealOfficialsAccess();
  };

  const handleRoleLoginBackToResults = () => {
    hideOfficialsReveal();
    setShowRoleLogin(false);
    resetPinEntry();
  };

  const handleRoleSelect = (role) => {
    setPinEntryRole(role);
    resetPinEntry();
    requestAnimationFrame(() => {
      focusPinInput();
    });
  };

  const directNavigateToTournament = (tournamentId) => {
    setupTournament(tournamentId);
    Cookies.set("tournamentId", tournamentId, { expires: 1 / 24, path: "/" });
    setIsThinking(true);
    setTimeout(() => {
      navigate(`/tournament/${tournamentId}/home`, { replace: true });
      setIsThinking(false);
    }, 500);
  };

  const redirectToLiveScores = (tournament, competition) => {
    if (!tournament) {
      setIsThinking(true);
      window.location.href = `/`;
      return;
    }

    setUserRoleAndCookie('spectator');
    setupTournament(tournament.Id);
    Cookies.set("tournamentId", tournament.Id, { expires: 1 / 24, path: "/" });

    if (tournament.eventUuid) {
      const targetUrl = new URL(`/events/${tournament.eventUuid}`, config.resultsAppUrl);
      if (competition?.value && !competition.isAllCompetitions) {
        targetUrl.searchParams.set('category', competition.value);
      }
      setIsThinking(true);
      window.location.href = targetUrl.toString();
      return;
    }

    const encodedCompetition = competition?.value && !competition.isAllCompetitions
      ? encodeURIComponent(competition.value)
      : null;
    navigate(
      encodedCompetition
        ? `/tournament/${tournament.Id}/category/${encodedCompetition}`
        : `/tournament/${tournament.Id}/category`,
      { replace: false },
    );
  };

  const onPinEntered = async (enteredPin) => {
    if (selectedTournament) {
      setIsThinking(true);
      setMessage("");
      try {
        await API.checkTournamentCode(selectedTournament.Id, enteredPin, pinEntryRole);
        setUserRoleAndCookie(pinEntryRole);
        directNavigateToTournament(selectedTournament.Id);
      } catch (error) {
        setIsThinking(false);
        console.error("PIN check failed:", error);

        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        if (attempts >= 3) {
          setMessage("Too many invalid attempts");
          setTimeout(() => {
            resetPinEntry();
            setShowRoleLogin(false);
          }, 2000);
        } else {
          setMessage("Invalid pin for selected role!");
          setTimeout(() => {
            setPin(["", "", "", ""]);
            setMessage("");
          }, 2000);
        }
      }
    } else {
      console.error("Error: No selected tournament found for PIN validation.");
      setMessage("An error occurred. Please select a tournament again.");
      setPin(["", "", "", ""]);
      setTimeout(() => {
        setShowRoleLogin(false);
        setMessage("");
      }, 2500);
    }
  };

  const normalisePinInput = (value) => (
    value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 4)
  );

  const handlePinInputChange = (e) => {
    if (!pinEntryRole) return;

    const value = normalisePinInput(e.target.value);
    const newPin = Array.from({ length: 4 }, (_, index) => value[index] || '');
    setPin(newPin);

    if (value.length === 4 && !isThinking) {
      onPinEntered(value);
    }
  };

  if (!selectedTournament) {
    if (isLoadingTournaments) {
      return <div className="pinLogin thinking">Loading tournaments...</div>;
    }
    if (fetchError) {
      return <div className="pinLogin error">{fetchError}</div>;
    }
    if (availableTournaments.length === 0) {
      return (
        <>
          <LoginHeader version={versionInfo?.mobile} showBackButton={false} />
          <div className="pinLogin">No active tournaments found.</div>
          <div className="version-info">{`PitchPerfect v${versionInfo?.mobile}`}</div>
        </>
      );
    }
  }

  return (
    <>
      <LoginHeader
        version={versionInfo?.mobile}
        showBackButton={Boolean(selectedTournament)}
        onBackClick={handleBackClick}
        tournament={selectedTournament}
      />
      <div className={`pinLogin ${showRoleLogin ? 'role-selector-active-parent' : ''}`}>
        {!selectedTournament ? (
          <div className="tournament-selection-view">
            <h2>{tournamentHeading}</h2>
            {message && <div className="general-message">{message}</div>}
            {isLoadingTournaments && <div className="thinking">Loading tournaments...</div>}
            {fetchError && <div className="error">{fetchError}</div>}
            {!isLoadingTournaments && !fetchError && availableTournaments.length === 0 && !message && (
              <div>No active tournaments found.</div>
            )}
            <div className="tournamentAgenda" aria-label="Upcoming tournaments">
              {tournamentAgenda.years.map((yearGroup) => (
                <div className="agenda-year" key={yearGroup.key}>
                  {tournamentAgenda.hasMultipleYears && (
                    <div className="agenda-year-divider">{yearGroup.label}</div>
                  )}
                  {yearGroup.months.map((monthGroup) => (
                    <section className="agenda-month" key={monthGroup.key}>
                      <div className="agenda-month-heading">
                        <span>{monthGroup.label}</span>
                      </div>
                      <div className="agenda-days">
                        {monthGroup.days.map((dayGroup) => (
                          <div className="agenda-day" key={dayGroup.key}>
                            <div
                              className="agenda-date-node"
                              aria-label={dayGroup.accessibleLabel}
                            >
                              <span>{dayGroup.dayLabel}</span>
                            </div>
                            <div className="agenda-day-events">
                              {dayGroup.tournaments.map((tournament) => (
                                <button
                                  type="button"
                                  key={tournament.Id}
                                  className="agenda-event"
                                  onClick={() => handleTournamentCardClick(tournament)}
                                  aria-label={`Open ${tournament.Title || 'tournament'}`}
                                >
                                  <span className="agenda-event-copy">
                                    <span className="agenda-event-title">
                                      {tournament.Title || 'Tournament title'}
                                    </span>
                                    {tournament.Location && (
                                      <span className="agenda-event-location">
                                        <i className="pi pi-map-marker" aria-hidden="true" />
                                        {tournament.Location}
                                      </span>
                                    )}
                                  </span>
                                  <span className="agenda-event-action" aria-hidden="true">
                                    <i className="pi pi-bullseye" />
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : showRoleLogin ? (
          <div className="pin-entry-view gateway-panel">
            <div className="role-login-card">
              <button
                type="button"
                className="role-flow-back-button"
                aria-label="Back to latest results"
                onClick={handleRoleLoginBackToResults}
              >
                <span className="role-flow-back-icon" aria-hidden="true">
                  <i className="pi pi-arrow-left" />
                </span>
                <span className="role-flow-back-copy">
                  <span className="role-flow-back-brand">
                    <span className="role-flow-brand-icon" aria-hidden="true">
                      <OfficialsIcon />
                    </span>
                    <span className="role-flow-brand-title">
                      <span>Administrators</span>
                      <span>&amp; Officials</span>
                    </span>
                  </span>
                </span>
              </button>
              <div className="role-login-content">
                <h2 className={pinEntryRole ? 'dimmed' : ''}>Select role</h2>
                <div className="role-grid">
                  {pinProtectedRoles.map(role => (
                    <button
                      type="button"
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className={`role-button ${pinEntryRole === role ? 'active-role' : ''}`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                      {pinEntryRole === role ? ' *' : ''}
                    </button>
                  ))}
                </div>
                <div className={`pin-section ${!pinEntryRole ? 'pin-disabled' : ''}`}>
                  <span className="pin-label">PIN</span>
                  <div
                    className="pinContainer"
                    onClick={focusPinInput}
                  >
                    <input
                      ref={pinInputRef}
                      className="pin-hidden-input"
                      value={pin.join('')}
                      onChange={handlePinInputChange}
                      maxLength="4"
                      inputMode="text"
                      autoCapitalize="characters"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck="false"
                      aria-label="Enter PIN"
                    />
                    {pin.map((num, index) => (
                      <div
                        className={[
                          'pinDigitBox',
                          pinEntryRole && pin.join('').length === index ? 'active' : '',
                          isThinking ? 'thinking' : '',
                        ].filter(Boolean).join(' ')}
                        key={index}
                        aria-hidden="true"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pin-message">&nbsp;{message}&nbsp;</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="competition-selection-view gateway-panel">
            <div className="latest-results-card">
              <div className="latest-results-content">
                <h2>View latest results</h2>
                <div className="competition-prompt">Select competition</div>
                {isLoadingCompetitions ? (
                  <div className="thinking">Loading competitions...</div>
                ) : (
                  <div className="competition-list">
                    {competitionOptions.map((competition) => (
                      <button
                        type="button"
                        key={competition.value}
                        className="competition-button"
                        onClick={() => handleCompetitionSelect(competition)}
                      >
                        <i className="pi pi-trophy competition-button-icon" aria-hidden="true" />
                        <span className="competition-button-label">{competition.label}</span>
                        <i className="pi pi-bullseye competition-button-action" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div
              className={[
                'officials-access',
                isOfficialsRevealActive ? 'officials-access--active' : '',
                isOfficialsLoginTransitioning ? 'officials-access--to-login' : '',
              ].filter(Boolean).join(' ')}
            >
              <div className="officials-access-label" aria-live="polite">
                {isOfficialsRevealActive ? 'Administrators & Officials' : ''}
              </div>
              <button
                type="button"
                className="change-role-button"
                onClick={handleOfficialsAccessClick}
                aria-label={
                  isOfficialsRevealActive
                    ? 'Open officials and administrators'
                    : 'Reveal officials and administrators'
                }
                aria-expanded={isOfficialsRevealActive}
              >
                <OfficialsIcon aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="bottom-gradient-bg"></div>
      <div className="version-info">{`PitchPerfect v${versionInfo?.mobile}`}</div>
    </>
  );
};

const normaliseCompetitions = (payload) => {
  if (!Array.isArray(payload)) return [];

  const seen = new Set();
  return payload
    .map((competition) => {
      if (typeof competition === 'string') {
        return { value: competition, label: competition };
      }

      const value = competition?.category || competition?.name || competition?.key || competition?.id;
      const label = competition?.label || competition?.category || competition?.name || value;
      return value ? { value: `${value}`, label: `${label}` } : null;
    })
    .filter((competition) => {
      if (!competition || seen.has(competition.value)) return false;
      seen.add(competition.value);
      return true;
    });
};

const buildTournamentAgenda = (tournaments = []) => {
  const sortedTournaments = [...tournaments].sort((a, b) => {
    const aDate = parseTournamentDate(a.Date || a.date);
    const bDate = parseTournamentDate(b.Date || b.date);
    const aTime = aDate ? aDate.getTime() : Number.POSITIVE_INFINITY;
    const bTime = bDate ? bDate.getTime() : Number.POSITIVE_INFINITY;

    if (aTime !== bTime) return aTime - bTime;
    return `${a.Title || a.title || ''}`.localeCompare(`${b.Title || b.title || ''}`);
  });

  const years = sortedTournaments.reduce((yearGroups, tournament) => {
    const tournamentDate = parseTournamentDate(tournament.Date || tournament.date);
    const yearKey = tournamentDate ? `${tournamentDate.getFullYear()}` : 'date-tba';
    const monthKey = tournamentDate
      ? `${tournamentDate.getFullYear()}-${String(tournamentDate.getMonth() + 1).padStart(2, '0')}`
      : 'date-tba';
    const dayKey = tournamentDate ? getDateKey(tournamentDate) : `${monthKey}-${tournament.Id}`;
    const monthLabel = tournamentDate
      ? tournamentDate.toLocaleString('en-US', { month: 'long' }).toUpperCase()
      : 'DATE TBA';
    const dayLabel = tournamentDate
      ? String(tournamentDate.getDate()).padStart(2, '0')
      : '--';
    const accessibleLabel = tournamentDate
      ? tournamentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : 'Date to be announced';

    let yearGroup = yearGroups.find((group) => group.key === yearKey);
    if (!yearGroup) {
      yearGroup = {
        key: yearKey,
        label: tournamentDate ? `${tournamentDate.getFullYear()}` : 'DATE TBA',
        months: [],
      };
      yearGroups.push(yearGroup);
    }

    let monthGroup = yearGroup.months.find((group) => group.key === monthKey);
    if (!monthGroup) {
      monthGroup = {
        key: monthKey,
        label: monthLabel,
        days: [],
      };
      yearGroup.months.push(monthGroup);
    }

    let dayGroup = monthGroup.days.find((group) => group.key === dayKey);
    if (!dayGroup) {
      dayGroup = {
        key: dayKey,
        dayLabel,
        accessibleLabel,
        tournaments: [],
      };
      monthGroup.days.push(dayGroup);
    }

    dayGroup.tournaments.push(tournament);
    return yearGroups;
  }, []);

  return {
    hasMultipleYears: years.length > 1,
    years,
  };
};

const parseTournamentDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string') {
    const dateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getDateKey = (date) => (
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
);

export default PinLogin;
