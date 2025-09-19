import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/js/Provider";
import MobileLayout from "../../../shared/generic/MobileLayout";
import './TournamentView.scss';

const POLL_INTERVAL_MS = 20000;

const TournamentView = () => {
  const navigate = useNavigate();
  const { tournamentId, category } = useParams();
  const { sections } = useAppContext();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      />
    </MobileLayout>
  );
};

export default TournamentView;

const StatusContent = ({ loading, error, categoryReport, tournament }) => {
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

  const {
    label,
    teams = [],
    groups = [],
    fixtures = [],
    standings = [],
    teamSummaries = [],
    lastUpdated,
  } = categoryReport;

  const points = tournament?.pointsFor || tournament?.points;
  const title = tournament?.title;
  const date = tournament?.date
    ? new Date(tournament.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : null;
  const locationLabel = tournament?.location?.address || tournament?.location?.region || null;
  const metaLine = [date, locationLabel].filter(Boolean).join(" • ");

  const upcomingFixtures = fixtures
    .filter((fixture) => fixture.outcome !== "played")
    .sort((a, b) => new Date(a.scheduled) - new Date(b.scheduled))
    .slice(0, 6);

  const recentResults = fixtures
    .filter((fixture) => fixture.outcome === "played")
    .sort((a, b) => new Date(b.scheduled) - new Date(a.scheduled))
    .slice(0, 6);

  return (
    <section className="status-content">
      <div className="status-card status-card--hero">
        <h1>{title}</h1>
        {metaLine && <p className="status-card__meta">{metaLine}</p>}
      </div>
      <div className="status-grid">
        <div className="status-card">
          <h2>{label} overview</h2>
          <ul>
            <li><strong>Teams:</strong> {teams.length}</li>
            <li><strong>Groups:</strong> {groups.length || "Single pool"}</li>
            {points && (
              <li>
                <strong>Points:</strong> W {points.win} | D {points.draw} | L {points.loss}
              </li>
            )}
            <li><strong>Fixtures scheduled:</strong> {fixtures.length}</li>
          </ul>
        </div>

        <div className="status-card">
          <h2>Group breakdown</h2>
          {groups.length ? (
            <ul>
              {groups.map((group) => (
                <li key={group.key}>
                  <strong>{group.label}:</strong> {group.teams.join(", ")}
                </li>
              ))}
            </ul>
          ) : (
            <p>Single group round-robin.</p>
          )}
        </div>
      </div>

      <div className="status-card">
        <h2>Standings</h2>
        <table className="status-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>MP</th>
              <th>W</th>
              <th>Pts</th>
              <th>Diff</th>
            </tr>
          </thead>
          <tbody>
            {standings.length ? (
              standings.map((row) => (
                <tr key={row.team}>
                  <td>{row.team}</td>
                  <td>{valueOrDash(row.matchesPlayed)}</td>
                  <td>{valueOrDash(row.won)}</td>
                  <td>{valueOrDash(row.points)}</td>
                  <td>{valueOrDash(row.scoreDifference)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>Standings will appear once matches begin.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {teamSummaries.length ? (
        <div className="status-card">
          <h2>Team snapshot</h2>
          <table className="status-table status-table--compact">
            <thead>
              <tr>
                <th>#</th>
                <th>Team</th>
                <th>MP</th>
                <th>Score ±</th>
                <th>Bracket</th>
              </tr>
            </thead>
            <tbody>
              {teamSummaries.map((summary) => (
                <tr key={summary.team}>
                  <td>{valueOrDash(summary.rank)}</td>
                  <td>{summary.team}</td>
                  <td>{valueOrDash(summary.matchesPlayed)}</td>
                  <td>{valueOrDash(summary.totalScore?.scoreDifference)}</td>
                  <td>{summary.progression?.bracket || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="status-grid">
        <div className="status-card">
          <h2>Upcoming fixtures</h2>
          {upcomingFixtures.length ? (
            <ul className="fixture-list">
              {upcomingFixtures.map((fixture) => (
                <li key={fixture.matchId}>
                  <FixtureSummary fixture={fixture} />
                </li>
              ))}
            </ul>
          ) : (
            <p>All fixtures complete or awaiting scheduling.</p>
          )}
        </div>

        <div className="status-card">
          <h2>Recent results</h2>
          {recentResults.length ? (
            <ul className="fixture-list">
              {recentResults.map((fixture) => (
                <li key={fixture.matchId}>
                  <FixtureResult fixture={fixture} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No games completed yet.</p>
          )}
        </div>
      </div>
      <footer className="status-updated">
        {lastUpdated ? `Last updated ${formatTime(lastUpdated)}` : null}
      </footer>
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

const valueOrDash = (value) => {
  return typeof value === "number" ? value : "-";
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

  const key = category.category || category.name || "";

  return {
    key,
    label: key,
    teams,
    groups,
    fixtures: fixturesNormalized.list,
    standings,
    teamSummaries,
    lastUpdated: fixturesNormalized.lastUpdated,
  };
};

const normalizeFixturesCollection = (fixtures) => {
  if (!fixtures) {
    return { list: [], lastUpdated: null };
  }

  if (Array.isArray(fixtures)) {
    return {
      list: fixtures.map(normalizeFixture).filter(Boolean),
      lastUpdated: null,
    };
  }

  const list = [];
  const addFixture = (fixture) => {
    const normalized = normalizeFixture(fixture);
    if (normalized) list.push(normalized);
  };

  if (Array.isArray(fixtures.stage)) {
    fixtures.stage.forEach(addFixture);
  } else if (fixtures.stage && typeof fixtures.stage === "object") {
    Object.values(fixtures.stage).forEach((value) => {
      if (Array.isArray(value)) value.forEach(addFixture);
    });
  }

  if (Array.isArray(fixtures.group)) fixtures.group.forEach(addFixture);
  if (Array.isArray(fixtures.knockouts)) fixtures.knockouts.forEach(addFixture);

  return {
    list,
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
