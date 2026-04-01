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
  // Default to "groups" view
  const [statusView, setStatusView] = useState("groups");
  const [showOverall, setShowOverall] = useState(false);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

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

  const categories = useMemo(() => {
    return normalizeCategories(report?.categories);
  }, [report?.categories]);

  const { categoryReport, isFallbackCategory } = useMemo(() => {
    return selectCategoryReport(categories, category);
  }, [categories, category]);

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
        requestedCategory={category}
        isFallbackCategory={isFallbackCategory}
        statusView={statusView}
        onChangeStatusView={setStatusView}
        showOverall={showOverall}
        onToggleOverall={setShowOverall}
        activeGroupIndex={activeGroupIndex}
        onGroupChange={setActiveGroupIndex}
      />
    </MobileLayout>
  );
};

export default TournamentView;

const StatusContent = ({
  loading,
  error,
  categoryReport,
  requestedCategory,
  isFallbackCategory,
  statusView,
  onChangeStatusView,
  showOverall,
  onToggleOverall,
  activeGroupIndex,
  onGroupChange,
}) => {
  if (loading && !categoryReport) {
    return <div className="status-card status-card--message">Loading competition data...</div>;
  }

  if (error && !categoryReport) {
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
    fixtures = [],
    standings = [],
    groupStandings = [],
    knockoutFixtures = [],
    lastUpdated,
  } = categoryReport;

  return (
    <section className="status-content">
      <div className="status-hero status-card">
        <div className="status-hero__header">
          <div className="status-hero__info">
            <p className="status-hero__kicker">Live competition status</p>
            <h1 className="status-hero__title">{label}</h1>
            <p className="status-hero__meta">
              {lastUpdated ? `Updated ${formatTime(lastUpdated)}` : "Waiting for first update"}
            </p>
          </div>
          <button 
             className="status-hero__back" 
             onClick={() => window.history.back()}
             aria-label="Go back"
          >
             Back
          </button>
        </div>
      </div>

      {isFallbackCategory && requestedCategory ? (
        <div className="status-card status-card--message">
          Showing <strong>{label}</strong> because no exact match was found for <strong>{safeDecodeURIComponent(requestedCategory)}</strong>.
        </div>
      ) : null}

      {error ? (
        <div className="status-card status-card--warning">
          Live refresh failed: {error}
        </div>
      ) : null}

      <div className="status-toggle status-toggle--main" role="tablist" aria-label="Competition phase">
        <button
          type="button"
          className={`status-toggle__button ${statusView === "groups" ? "is-active" : ""}`}
          onClick={() => onChangeStatusView("groups")}
          role="tab"
          aria-selected={statusView === "groups"}
        >
          Groups
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

      {statusView === "groups" && (
        <GroupViewSwitcher 
           groupStandings={groupStandings}
           fixtures={fixtures}
           overallStandings={standings}
           activeGroupIndex={activeGroupIndex}
           onChangeGroup={onGroupChange}
           showOverall={showOverall}
           onToggleOverall={onToggleOverall}
        />
      )}

      {statusView === "knockouts" && (
        <KnockoutList fixtures={knockoutFixtures.length ? knockoutFixtures : fixtures} />
      )}
    </section>
  );
};

// Replaces SingleGroupView to unify the UI
const GroupViewSwitcher = ({ 
    groupStandings, 
    fixtures, 
    overallStandings,
    activeGroupIndex, 
    onChangeGroup, 
    showOverall, 
    onToggleOverall 
}) => {
  if (!groupStandings || groupStandings.length === 0) {
    return (
      <div className="status-card status-card--message">
        <h2>No Groups</h2>
        <p>There are no group stages for this competition.</p>
      </div>
    );
  }

  // Calculate tabs: Groups + Overall
  const tabs = [
     ...groupStandings.map((g, idx) => ({ 
        key: g.key, 
        label: g.label.replace('Group ', ''), 
        index: idx,
        isOverall: false
     })),
     { key: 'overall', label: 'Overall', isOverall: true }
  ];

  // Determine active tab
  // If showOverall is true, the last tab is active
  // If not, activeGroupIndex determines which group tab is active
  const activeTabKey = showOverall 
     ? 'overall' 
     : (groupStandings[activeGroupIndex] ? groupStandings[activeGroupIndex].key : null);

  const handleTabClick = (tab) => {
     if (tab.isOverall) {
        onToggleOverall(true);
     } else {
        onToggleOverall(false);
        onChangeGroup(tab.index);
     }
  };

  return (
    <>
      <div className="status-card" style={{ padding: '0.5rem' }}>
          <div className="status-toggle" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
            {tabs.map((tab) => (
               <button
                 key={tab.key}
                 className={`status-toggle__button ${activeTabKey === tab.key ? "is-active" : ""}`}
                 onClick={() => handleTabClick(tab)}
               >
                 {tab.label}
               </button>
            ))}
          </div>
      </div>

      {showOverall ? (
         <div className="status-card status-card--overall">
           <h2>Overall Standings</h2>
           <StandingsTable
             rows={overallStandings}
             emptyMessage="Standings will appear once matches begin."
           />
         </div>
      ) : (
         <SingleGroupContent 
            group={groupStandings[activeGroupIndex >= groupStandings.length ? 0 : activeGroupIndex]}
            fixtures={fixtures}
         />
      )}
    </>
  );
};

const SingleGroupContent = ({ group, fixtures }) => {
  if (!group) return null;
  
  const { key, label: groupLabel, rows } = group;

  const groupFixtures = fixtures.filter((f) => {
      // 1. Direct key match (most reliable)
      const g = String(f.group || "").trim().toLowerCase();
      const k = String(key || "").trim().toLowerCase();
      if (g === k) return true;

      // 2. Allow matching "1" with "Group 1" (and vice versa)
      const gClean = g.replace(/^group\s?/i, '');
      const kClean = k.replace(/^group\s?/i, '');
      if (gClean && gClean === kClean) return true;

      // 3. Check "stage" property (common fallback)
      const stage = String(f.stage || "").trim().toLowerCase();
      if (stage === k || stage === `group ${k}` || stage === `group ${kClean}`) return true;
      if (stage.replace(/^group\s?/i, '') === kClean) return true;

      // 4. (Expensive) Infer by team presence if no explicit group info found
      // Only do this if we haven't matched yet and the fixture has no group info at all
      if (!g && !stage.includes('knockout') && !stage.includes('semi') && !stage.includes('final')) {
         const teamNames = rows.map(r => String(r.team || r.name).toLowerCase());
         const t1 = String(f.team1).toLowerCase();
         const t2 = String(f.team2).toLowerCase();
         // If BOTH teams are in this group, it's a group match
         if (teamNames.includes(t1) && teamNames.includes(t2)) return true;
      }

      return false;
  });
  
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
    <>
      <div className="status-card">
        <div className="group-header">
          <h2 className="group-header__title">{groupLabel}</h2>
          {isComplete ? (
            <div className="group-header__status group-header__status--complete">
              <span role="img" aria-label="complete">
                ✔
              </span>{" "}
              Complete
            </div>
          ) : remainingMatches > 0 ? (
            <div className="group-header__status group-header__status--pending">
              {`${remainingMatches} left`}
            </div>
          ) : null}
        </div>
        <StandingsTable
          rows={rows}
          matchesToPlay={matchesToPlay}
          emptyMessage="No results for this group yet."
        />
      </div>

      {groupFixtures.length > 0 && (
        <div className="status-card">
          <h2 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>Fixtures</h2>
          <table className="status-table">
            <tbody>
              {groupFixtures.map((fixture) => {
                 const result = fixture.result;
                 const team1Score = result && result.team1 
                    ? `${result.team1.goals ?? 0}-${result.team1.points ?? 0} (${result.team1.total ?? 0})`
                    : '';
                 const team2Score = result && result.team2
                    ? `${result.team2.goals ?? 0}-${result.team2.points ?? 0} (${result.team2.total ?? 0})`
                    : '';
                 
                 const hasPlayed = fixture.outcome === 'played' || (team1Score && team2Score);

                 return (
                   <tr key={fixture.matchId} style={{ fontSize: '1.2rem' }}>
                     <td style={{ width: '35%', textAlign: 'right', fontWeight: '600', padding: '0.5rem' }}>{fixture.team1}</td>
                     <td style={{ width: '15%', textAlign: 'center', whiteSpace: 'nowrap', fontSize: '1.2rem', fontWeight: 'bold', padding: '0.5rem', background: '#f1f5f9' }}>
                        {hasPlayed ? team1Score : '-'}
                     </td>
                     <td style={{ width: '15%', textAlign: 'center', whiteSpace: 'nowrap', fontSize: '1.2rem', fontWeight: 'bold', padding: '0.5rem', background: '#f1f5f9' }}>
                        {hasPlayed ? team2Score : '-'}
                     </td>
                     <td style={{ width: '35%', textAlign: 'left', fontWeight: '600', padding: '0.5rem' }}>{fixture.team2}</td>
                   </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};



const FixtureSummary = ({ fixture }) => {
  const stageLabel = formatStageLabel(fixture.stage);
  return (
    <article className="fixture">
      <header>
        <span className="fixture-label">{fixture.label}</span>
      </header>
      <div className="fixture-teams">
        <span>{fixture.team1}</span>
        <span>vs</span>
        <span>{fixture.team2}</span>
      </div>
      <div className="fixture-support">
        <div className="fixture-support__row">
          <span className="fixture-support__item">{stageLabel || "Knockout"}</span>
          <span className="fixture-support__item">Pitch {fixture.pitch || "TBD"}</span>
        </div>
        {fixture.umpire && (
          <div className="fixture-support__row fixture-support__row--umpire">
            <span className="fixture-support__item fixture-support__item--umpire">
              Umpire {fixture.umpire}
            </span>
          </div>
        )}
      </div>
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
  const result = fixture.result || {};
  const team1 = result.team1 || {};
  const team2 = result.team2 || {};
  const stageLabel = formatStageLabel(fixture.stage);
  return (
    <article className="fixture fixture--result">
      <header>
        <span className="fixture-label">{fixture.label}</span>
      </header>
      <div className="fixture-teams">
        <span>{fixture.team1}</span>
        <span>{formatScore(team1)}</span>
      </div>
      <div className="fixture-teams">
        <span>{fixture.team2}</span>
        <span>{formatScore(team2)}</span>
      </div>
      <div className="fixture-support">
        <div className="fixture-support__row">
          <span className="fixture-support__item">{stageLabel || "Knockout"}</span>
          <span className="fixture-support__item">Pitch {fixture.pitch || "TBD"}</span>
        </div>
      </div>
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
  const list = Array.isArray(rawCategories)
    ? rawCategories
    : rawCategories && typeof rawCategories === "object"
      ? Object.entries(rawCategories).map(([key, value]) => {
          if (value && typeof value === "object") {
            return {
              ...value,
              key: value.key || value.category || value.name || key,
            };
          }
          return null;
        }).filter(Boolean)
      : [];

  return list
    .map(normalizeCategory)
    .filter(Boolean);
};

const normalizeCategory = (category) => {
  if (!category) return null;

  // Legacy shape
  if (category.name || Array.isArray(category.teams)) {
    const fixtures = normalizeFixturesCollection(category.fixtures).list;
    const categoryKey = String(category.key || category.category || category.name || "");
    return {
      key: categoryKey,
      label: category.name || categoryKey,
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

  const key = String(category.key || category.category || category.name || "");

  return {
    key,
    label: String(category.label || key),
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
    
    // Inject group from context if available and missing on fixture
    if (!normalized.group && context && context !== "group" && context !== "knockout") {
       if (/^Group\s?(\d+|[A-Z])$/i.test(context) || /^\d+$/.test(context) || /^[A-Z]$/.test(context)) {
          normalized.group = context.replace(/^Group\s?/i, '');
       }
    }
    
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
  
  // Also check if fixtures.group is an object map instead of an array
  if (fixtures.group && !Array.isArray(fixtures.group) && typeof fixtures.group === "object") {
      Object.entries(fixtures.group).forEach(([key, value]) => {
          if (Array.isArray(value)) value.forEach((fixture) => addFixture(fixture, key));
      });
  } else if (Array.isArray(fixtures.group)) {
      fixtures.group.forEach((fixture) => addFixture(fixture, "group"));
  }

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
  
  // Use defaultGroup only if it looks like a group ID (digits or single letter) and not a generic "group" string
  const group = fixture.groupNumber ?? fixture.group ?? null;

  const scheduled = planned.scheduled || actual.scheduled || fixture.scheduled || null;
  const pitch = planned.pitch || actual.pitch || fixture.pitch || '';
  const umpire = fixture.umpire || fixture.umpireTeam || planned.umpireTeam || actual.umpireTeam || null;

  const score1 = extractScore(team1Data);
  const score2 = extractScore(team2Data);
  const hasResult = score1 !== null || score2 !== null;

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

const safeDecodeURIComponent = (value) => {
  if (!value) return "";
  try {
    return decodeURIComponent(String(value));
  } catch (_error) {
    return String(value);
  }
};

const normalizeCategoryKey = (value) => {
  return safeDecodeURIComponent(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const selectCategoryReport = (categories, routeCategory) => {
  if (!categories.length) {
    return { categoryReport: null, isFallbackCategory: false };
  }

  if (!routeCategory) {
    return { categoryReport: categories[0], isFallbackCategory: false };
  }

  const routeDecoded = safeDecodeURIComponent(routeCategory);

  const exact = categories.find((item) => {
    const keys = [item.key, item.label].map((value) => String(value || ""));
    return keys.includes(routeCategory) || keys.includes(routeDecoded);
  });

  if (exact) {
    return { categoryReport: exact, isFallbackCategory: false };
  }

  const normalizedRoute = normalizeCategoryKey(routeCategory);
  const normalized = categories.find((item) => {
    const keys = [item.key, item.label].map((value) => normalizeCategoryKey(value));
    return keys.includes(normalizedRoute);
  });

  if (normalized) {
    return { categoryReport: normalized, isFallbackCategory: false };
  }

  return { categoryReport: categories[0], isFallbackCategory: true };
};
