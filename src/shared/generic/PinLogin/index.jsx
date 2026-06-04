import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../../shared/js/Provider";
import API from "../../api/endpoints.js";
import TournamentCard from "./TournamentCard";
import LoginHeader from "../LoginHeader";
import Cookies from "js-cookie";
import "./PinLogin.scss";
import config from "../../../interfaces/mobile/config";

const pinProtectedRoles = ['organizer', 'coordinator', 'coach', 'referee'];
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
  const inputsRef = useRef([]);
  const [availableTournaments, setAvailableTournaments] = useState([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [pinEntryRole, setPinEntryRole] = useState(() => (
    pinProtectedRoles.includes((userRole || '').toLowerCase())
      ? userRole.toLowerCase()
      : 'organizer'
  ));
  const [showRoleLogin, setShowRoleLogin] = useState(false);
  const [roleLoginStep, setRoleLoginStep] = useState('select');
  const [competitions, setCompetitions] = useState([]);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(false);
  const [competitionFetchFailed, setCompetitionFetchFailed] = useState(false);

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
        setRoleLoginStep('pin');
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

  useEffect(() => {
    if (showRoleLogin && roleLoginStep === 'pin') {
      inputsRef.current[0]?.focus();
    }
  }, [showRoleLogin, roleLoginStep, pinEntryRole]);

  const resetPinEntry = () => {
    setPin(["", "", "", ""]);
    setMessage("");
    setFailedAttempts(0);
  };

  const handleBackClick = () => {
    if (showRoleLogin) {
      setShowRoleLogin(false);
      setRoleLoginStep('select');
      resetPinEntry();
      return;
    }

    setSelectedTournament(null);
    setShowRoleLogin(false);
    setRoleLoginStep('select');
    resetPinEntry();
    if (routeTournamentId) {
      navigate("/", { replace: true });
    }
  };

  const handleTournamentCardClick = (tournament) => {
    setMessage("");
    setSelectedTournament(tournament);
    setShowRoleLogin(false);
    setRoleLoginStep('select');
    setupTournament(tournament.Id);
    Cookies.set("tournamentId", tournament.Id, { expires: 1 / 24, path: "/" });
    navigate(`/tournament/${tournament.Id}`, { replace: false });
  };

  const handleCompetitionSelect = (competition) => {
    redirectToLiveScores(selectedTournament, competition);
  };

  const handleChangeRoleClick = () => {
    setPinEntryRole(pinProtectedRoles.includes(currentRole) ? currentRole : 'organizer');
    setRoleLoginStep('select');
    resetPinEntry();
    setShowRoleLogin(true);
  };

  const handleRoleSelect = (role) => {
    setPinEntryRole(role);
    setRoleLoginStep('pin');
    resetPinEntry();
    setTimeout(() => inputsRef.current[0]?.focus(), 0);
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
        : `/tournament/${tournament.Id}/selectCategory`,
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
            inputsRef.current[0]?.focus();
            setMessage("");
          }, 2000);
        }
      }
    } else {
      console.error("Error: No selected tournament found for PIN validation.");
      setMessage("An error occurred. Please select a tournament again.");
      setPin(["", "", "", ""]);
      inputsRef.current[0]?.focus();
      setTimeout(() => {
        setShowRoleLogin(false);
        setMessage("");
      }, 2500);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value.slice(0, 1);

    if (index > 0 && value) {
      const previousInputs = pin.slice(0, index);
      if (previousInputs.some(p => p === '')) {
        setPin(["", "", "", ""]);
        inputsRef.current[0]?.focus();
        return;
      }
    }

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newPin.every((num) => num !== "")) {
      onPinEntered(newPin.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newPin = [...pin];
      if (newPin[index] !== '') {
        newPin[index] = '';
        setPin(newPin);
      } else if (index > 0) {
        newPin[index - 1] = '';
        setPin(newPin);
        inputsRef.current[index - 1].focus();
      }
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
            <div className="tournamentList">
              {availableTournaments.map((t) => (
                <TournamentCard
                  key={t.Id}
                  title={t.Title}
                  location={t.Location}
                  date={t.Date}
                  href={`/tournament/${t.Id}`}
                  onClick={() => handleTournamentCardClick(t)}
                />
              ))}
            </div>
          </div>
        ) : showRoleLogin ? (
          <div className="pin-entry-view gateway-panel">
            <div className={`role-login-card ${roleLoginStep === 'pin' ? 'role-pin-card' : 'role-select-card'}`}>
              <div className="role-login-content">
                {roleLoginStep === 'select' ? (
                  <>
                    <h2>Select role</h2>
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
                  </>
                ) : (
                  <>
                    <h2>Enter PIN</h2>
                    <div className="pin-entry-row">
                      <div className="pinContainer">
                        {pin.map((num, index) => (
                          <input
                            className={isThinking ? "thinking" : ""}
                            key={index}
                            ref={(el) => (inputsRef.current[index] = el)}
                            value={num}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            maxLength="1"
                          />
                        ))}
                      </div>
                      <button type="button" className="pin-visibility-button" aria-label="PIN visibility">
                        <i className="pi pi-eye" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="pin-role-context">To log in as</div>
                    <button
                      type="button"
                      className="selected-role-button"
                      onClick={() => {
                        setRoleLoginStep('select');
                        resetPinEntry();
                      }}
                    >
                      <span className="selected-role-back" aria-hidden="true">
                        <i className="pi pi-arrow-left" />
                      </span>
                      <span>{pinEntryRole}</span>
                    </button>
                    <div className="pin-message">&nbsp;{message}&nbsp;</div>
                  </>
                )}
                <button
                  type="button"
                  className="back-to-results-button"
                  onClick={() => {
                    setShowRoleLogin(false);
                    setRoleLoginStep('select');
                    resetPinEntry();
                  }}
                >
                  <i className="pi pi-arrow-left" aria-hidden="true" />
                  Back to results
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="competition-selection-view gateway-panel">
            <div className="latest-results-card">
              <div className="latest-results-content">
                <h2>Latest results</h2>
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
                        <span>{competition.label}</span>
                        <i className="pi pi-arrow-left" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              className="change-role-button"
              onClick={handleChangeRoleClick}
            >
              <span>... or change role</span>
              <i className="pi pi-users" aria-hidden="true" />
            </button>
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

export default PinLogin;
