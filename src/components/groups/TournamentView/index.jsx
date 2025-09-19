import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/js/Provider";
import MobileLayout from "../../../shared/generic/MobileLayout";
import StandingsTable from "./StandingsTable";
import './TournamentView.scss';

const POLL_INTERVAL_MS = 20000;

const TournamentView = () => {
  const navigate = useNavigate();
  const { tournamentId, category } = useParams();
  const { sections } = useAppContext();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusView, setStatusView] = useState("preliminary");

  const loadReport = useCallback(async () => {
    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/report`);
      if (!response.ok) {
        throw new Error(`Report request failed with ${response.status}`);
      }
      const raw = await response.json();
      const payload = raw?.data ?? raw;
      setReport(payload);
      setError(null);
    } catch (err) {
      console.error("Error fetching tournament report", err);
      setError(err.message || "Unable to load report");
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);

  useEffect(() => {
    loadReport();
    const id = setInterval(loadReport, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [loadReport]);

  const categoryReport = useMemo(() => {
    const categories = normalizeCategories(report?.categories);
    return categories.find((c) => c.key === category) || null;
  }, [report, category]);

  const tournamentMeta = report?.tournament || null;

  const handle = {
    back: () => navigate(`/tournament/${tournamentId}/selectCategory`),
  };

  return (
    <MobileLayout
      sections={sections}
      onBack={handle.back}
      active={0}
      tabNames={["Status"]}
    >
      <span aria-hidden="true" />
      <StatusContent
        loading={loading}
        error={error}
        categoryReport={categoryReport}
        tournament={tournamentMeta}
        statusView={statusView}
        onChangeStatusView={setStatusView}
      />
    </MobileLayout>
  );
};

export default TournamentView;

const StatusContent = ({
  loading,
  error,
  categoryReport,
  tournament,
  statusView,
  onChangeStatusView,
}) => {
  useEffect(() => {
    if (categoryReport?.knockoutFixtures) {
      // Temporary debug output to verify knockout extraction
      console.log("Knockout fixtures", {
        category: categoryReport.label,
        count: categoryReport.knockoutFixtures.length,
        sample: categoryReport.knockoutFixtures.slice(0, 3),
      });
    }
  }, [categoryReport]);
  if (loading && !categoryReport) {
    return <div className="status-card status-card--message">Loading competition data...</div>;
  }

  if (error) {
    return (
      <div className="status-card status-card--error">
        <h2>Unable to load status</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!categoryReport) {
    return (
      <div className="status-card status-card--message">
        <h2>No data available</h2>
        <p>We could not find details for this competition.</p>
      </div>
    );
  }
  const styleTitle = {
    background: "white",
    fontSize: "2rem",
    color: "#005500",
    fontWeight: "bold",
    background: 'none',
  }

  const {
    label,
    teams = [],
    groups = [],
    fixtures = [],
    standings = [],
    groupStandings = [],
    knockoutFixtures = [],
    lastUpdated,
  } = categoryReport;

  const points = tournament?.pointsFor || tournament?.points;

  return (
    <section className="status-content">
      <div className="status-toggle" role="tablist" aria-label="Competition phase">
        <button
          type="button"
          className={`status-toggle__button ${statusView === "preliminary" ? "is-active" : ""}`}
          onClick={() => onChangeStatusView("preliminary")}
          role="tab"
          aria-selected={statusView === "preliminary"}
        >
          Preliminary
        </button>
        <button
          type="button"
          className={`status-toggle__button ${statusView === "knockouts" ? "is-active" : ""}`}
          onClick={() => onChangeStatusView("knockouts")}
          role="tab"
          aria-selected={statusView === "knockouts"}
        >
          Knockouts
        </button>
      </div>

      {statusView === "preliminary" ? (
        <>

          {groupStandings.length
            ? groupStandings.map(({ key, label: groupLabel, rows }) => {
                const groupFixtures = fixtures.filter((f) => String(f.group) === String(key));
                const numTeams = rows.length;
                const hasFixtures = groupFixtures.length > 0;

                let remainingMatches;
                let isComplete;

                if (hasFixtures) {
                  const unplayedCount = groupFixtures.filter((f) => f.outcome !== "played").length;
                  remainingMatches = unplayedCount;
                  isComplete = unplayedCount === 0;
                } else if (numTeams > 1) {
                  const totalMatches = (numTeams * (numTeams - 1)) / 2;
                  const playedMatches =
                    rows.reduce((sum, row) => sum + (row.matchesPlayed || 0), 0) / 2;
                  remainingMatches = totalMatches - playedMatches;
                  isComplete = remainingMatches <= 0;
                } else {
                  remainingMatches = 0;
                  isComplete = true;
                }

                const matchesToPlay = numTeams > 1 ? numTeams - 1 : 0;

                return (
                  <div className="status-card" key={`group-standing-${key}`}>
                    <div className="group-header">
                      <h2 className="group-header__title" style={styleTitle}>{groupLabel}</h2>
                      {isComplete ? (
                        <div className="group-header__status group-header__status--complete">
                          <span role="img" aria-label="complete">
                            ✔
                          </span>{" "}
                          Group Complete
                        </div>
                      ) : remainingMatches > 0 ? (
                        <div className="group-header__status group-header__status--pending">
                          {`${remainingMatches} ${
                            remainingMatches === 1 ? "match" : "matches"
                          } remaining`}
                        </div>
                      ) : null}
                    </div>
                    <StandingsTable
                      rows={rows}
                      matchesToPlay={matchesToPlay}
                      emptyMessage="No results for this group yet."
                    />
                  </div>
                );
              })
            : null}

          { (groupStandings.length > 1) &&
            <div className="status-card" style={{background: "#ddd"}}>
              <h2 style={styleTitle}>{groupStandings.length ? "Groups overall" : "Standings"}</h2>
              <StandingsTable
                rows={standings}
                emptyMessage="Standings will appear once matches begin."
              />
            </div>
          }

          <footer className="status-updated">
            {lastUpdated ? `Last updated ${formatTime(lastUpdated)}` : null}
          </footer>
        </>
      ) : (
        <KnockoutList fixtures={knockoutFixtures.length ? knockoutFixtures : fixtures} />
      )}
    </section>
  );
};

const FixtureSummary = ({ fixture }) => {
  const when = formatTime(fixture.scheduled);
  const stageLabel = formatStageLabel(fixture.stage);
  return (
    <article className="fixture">
      <header>
        <span className="fixture-label">{fixture.label}</span>
        <span>{when}</span>
      </header>
      <div className="fixture-teams">
        <span>{fixture.team1}</span>
        <span>vs</span>
        <span>{fixture.team2}</span>
      </div>
      <footer>
        <span>{stageLabel}</span>
        <span>Pitch {fixture.pitch}</span>
        {fixture.umpire && <span>Ump {fixture.umpire}</span>}
      </footer>
    </article>
  );
};


const KnockoutList = ({ fixtures = [] }) => {
  const knockoutFixtures = fixtures.length ? fixtures : [];
  if (!knockoutFixtures.length) {
    return (
      <div className="status-card status-card--message">
        <h2>Knockouts</h2>
        <p>No knockout fixtures scheduled yet.</p>
      </div>
    );
  }

  const orderedFixtures = knockoutFixtures.slice().sort((a, b) => {
    const aTime = a.scheduled ? new Date(a.scheduled).getTime() : Number.POSITIVE_INFINITY;
    const bTime = b.scheduled ? new Date(b.scheduled).getTime() : Number.POSITIVE_INFINITY;
    return aTime - bTime;
  });

  return (
    <>
      {orderedFixtures.map((fixture) => (
        <div className="status-card" key={fixture.matchId}>
          {fixture.outcome === "played" && fixture.result
            ? <FixtureResult fixture={fixture} />
            : <FixtureSummary fixture={fixture} />}
        </div>
      ))}
    </>
  );
};

const FixtureResult = ({ fixture }) => {
  const when = formatTime(fixture.scheduled);
  const result = fixture.result || {};
  const team1 = result.team1 || {};
  const team2 = result.team2 || {};
  const stageLabel = formatStageLabel(fixture.stage);
  return (
    <article className="fixture fixture--result">
      <header>
        <span className="fixture-label">{fixture.label}</span>
        <span>{when}</span>
      </header>
      <div className="fixture-teams">
        <span>{fixture.team1}</span>
        <span>{formatScore(team1)}</span>
      </div>
      <div className="fixture-teams">
        <span>{fixture.team2}</span>
        <span>{formatScore(team2)}</span>
      </div>
      <footer>
        <span>{stageLabel}</span>
        <span>Pitch {fixture.pitch}</span>
      </footer>
    </article>
  );
};


const formatScore = ({ goals, points, total }) => {
  if (typeof total === "number") {
    return `${goals ?? 0}-${points ?? 0} (${total})`;
  }
  if (typeof goals === "number" || typeof points === "number") {
    return `${goals ?? 0}-${points ?? 0}`;
  }
  return "-";
};

const formatTime = (isoString) => {
  if (!isoString) return "TBD";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStageLabel = (stage) => {
  if (!stage) return "";
  const normalized = String(stage).toLowerCase();
  if (normalized.startsWith("gp")) return "Group stage";
  if (normalized.includes("fin")) return "Final";
  if (normalized.includes("semi")) return "Semi-final";
  if (normalized.includes("cup")) return "Cup";
  return stage;
};

const isKnockoutStage = (stage) => {
  if (!stage) return false;
  const normalized = String(stage).toLowerCase();
  return /knock|semi|quarter|final|cup|playoff|shield|plate/.test(normalized);
};

const normalizeCategories = (rawCategories) => {
  if (!Array.isArray(rawCategories)) return [];
  return rawCategories
    .map(normalizeCategory)
    .filter(Boolean);
};

const normalizeCategory = (category) => {
  if (!category) return null;
  if (category.key) return category;

  // Legacy shape
  if (category.name || Array.isArray(category.teams)) {
    const fixtures = normalizeFixturesCollection(category.fixtures).list;
    return {
      key: category.name,
      label: category.name,
      teams: Array.isArray(category.teams) ? category.teams : [],
      groups: Array.isArray(category.groups)
        ? category.groups.map((group, idx) => ({
            key: String(group?.group ?? idx + 1),
            label: `Group ${group?.group ?? idx + 1}`,
            teams: group?.teams || [],
          }))
        : [],
      fixtures,
      standings: Array.isArray(category.standings) ? category.standings : [],
      teamSummaries: [],
      groupStandings: [],
      knockoutFixtures: [],
      lastUpdated: null,
    };
  }

  const fixturesNormalized = normalizeFixturesCollection(category.fixtures);
  const groups = Array.isArray(category.teams?.byGroup)
    ? category.teams.byGroup.map((group, idx) => ({
        key: String(group?.group ?? idx + 1),
        label: `Group ${group?.group ?? idx + 1}`,
        teams: group?.teams || [],
      }))
    : [];

  const teams = Array.isArray(category.teams?.allTeams)
    ? category.teams.allTeams
    : Array.isArray(category.teams)
      ? category.teams
      : [];

  const standings = Array.isArray(category.standings?.allGroups)
    ? category.standings.allGroups
    : Array.isArray(category.standings)
      ? category.standings
      : [];

  const teamSummaries = Array.isArray(category.teams?.summary)
    ? category.teams.summary
    : [];

  const groupStandings = extractGroupStandings(category, groups, standings);

  const key = category.category || category.name || "";

  return {
    key,
    label: key,
    teams,
    groups,
    fixtures: fixturesNormalized.list,
    knockoutFixtures: fixturesNormalized.knockouts,
    standings,
    teamSummaries,
    groupStandings,
    lastUpdated: fixturesNormalized.lastUpdated,
  };
};

const extractGroupStandings = (category, normalizedGroups, overallStandings) => {
  const byGroup = category?.standings?.byGroup;
  if (byGroup && typeof byGroup === "object") {
    return Object.entries(byGroup).map(([key, rows]) => ({
      key,
      label: deriveGroupLabel(key, normalizedGroups),
      rows: Array.isArray(rows) ? rows : [],
    }));
  }

  if (Array.isArray(overallStandings) && overallStandings.length) {
    const grouped = overallStandings.reduce((acc, row) => {
      const groupKey =
        row?.grp ??
        row?.group ??
        row?.pool ??
        row?.stage ??
        null;
      if (!groupKey) return acc;
      const key = String(groupKey);
      if (!acc[key]) acc[key] = [];
      acc[key].push(row);
      return acc;
    }, {});

    return Object.entries(grouped).map(([key, rows]) => ({
      key,
      label: deriveGroupLabel(key, normalizedGroups),
      rows,
    }));
  }

  return [];
};

const deriveGroupLabel = (rawKey, normalizedGroups) => {
  const keyString = String(rawKey ?? "").trim();
  if (!keyString) {
    return normalizedGroups[0]?.label || "Group";
  }

  const directMatch = normalizedGroups.find((group) => group.key === keyString);
  if (directMatch) return directMatch.label;

  const digits = keyString.match(/\d+/)?.[0];
  if (digits) {
    const numericMatch = normalizedGroups.find(
      (group) => group.key === digits || group.label?.includes(digits)
    );
    if (numericMatch) return numericMatch.label;
    return `Group ${digits}`;
  }

  return normalizedGroups.find((group) => group.label === keyString)?.label || `Group ${keyString}`;
};

const normalizeFixturesCollection = (fixtures) => {
  if (!fixtures) {
    return { list: [], knockouts: [], lastUpdated: null };
  }

  const list = [];
  const knockouts = [];

  const addFixture = (fixture, context) => {
    const normalized = normalizeFixture(fixture);
    if (!normalized) return;
    list.push(normalized);
    const contextIsKnockout = typeof context === "string" && /knock|semi|quarter|final|cup|plate|shield/i.test(context);
    if (contextIsKnockout || isKnockoutStage(normalized.stage)) {
      knockouts.push(normalized);
    }
  };

  if (Array.isArray(fixtures)) {
    fixtures.forEach((fixture) => addFixture(fixture));
    return {
      list,
      knockouts,
      lastUpdated: null,
    };
  }

  if (Array.isArray(fixtures.stage)) {
    fixtures.stage.forEach((fixture) => addFixture(fixture));
  } else if (fixtures.stage && typeof fixtures.stage === "object") {
    Object.entries(fixtures.stage).forEach(([key, value]) => {
      if (Array.isArray(value)) value.forEach((fixture) => addFixture(fixture, key));
    });
  }

  if (Array.isArray(fixtures.group)) fixtures.group.forEach((fixture) => addFixture(fixture, "group"));
  if (Array.isArray(fixtures.knockouts)) fixtures.knockouts.forEach((fixture) => addFixture(fixture, "knockout"));

  return {
    list,
    knockouts,
    lastUpdated: fixtures.lastUpdated || fixtures.updatedAt || null,
  };
};

const normalizeFixture = (fixture) => {
  if (!fixture) return null;

  const planned = fixture.planned || {};
  const actual = fixture.actual || {};
  const team1Data = fixture.team1 || {};
  const team2Data = fixture.team2 || {};

  const label = fixture.label || fixture.matchLabel || String(fixture.matchId || "");
  const stage = fixture.stage || planned.stage || fixture.bracket || actual.stage || "";
  const group = fixture.groupNumber ?? fixture.group ?? null;
  const scheduled = planned.scheduled || actual.scheduled || fixture.scheduled || null;
  const pitch = planned.pitch || actual.pitch || fixture.pitch || '';
  const umpire = fixture.umpire || fixture.umpireTeam || planned.umpireTeam || actual.umpireTeam || null;

  const score1 = extractScore(team1Data);
  const score2 = extractScore(team2Data);
  const hasResult = score1 || score2;

  const rawOutcome = fixture.outcome ? String(fixture.outcome).toLowerCase() : null;
  const outcome = rawOutcome || (hasResult ? "played" : "not played");

  return {
    matchId: fixture.matchId || fixture.id || label,
    label,
    stage,
    group,
    team1: team1Data.name || planned.team1 || fixture.team1 || "",
    team2: team2Data.name || planned.team2 || fixture.team2 || "",
    umpire,
    scheduled,
    pitch: pitch ? String(pitch) : "",
    outcome,
    result: hasResult
      ? {
          team1: score1 || {},
          team2: score2 || {},
        }
      : undefined,
  };
};

const extractScore = (teamData) => {
  if (!teamData) return null;
  const goals = teamData.goals ?? teamData.goalsFor ?? teamData.for?.goals;
  const points = teamData.points ?? teamData.pointsFor ?? teamData.for?.points;
  const total = teamData.total ?? teamData.score ?? teamData.for?.score;

  if (
    typeof goals === "number" ||
    typeof points === "number" ||
    typeof total === "number"
  ) {
    return {
      goals: goals ?? 0,
      points: points ?? 0,
      total: total ?? (goals ?? 0) * 3 + (points ?? 0),
    };
  }

  return null;
};
