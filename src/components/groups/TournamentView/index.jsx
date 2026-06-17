import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/js/Provider";
import MobileLayout from "../../../shared/generic/MobileLayout";
import StandingsTable from "./StandingsTable";
import { getTeamAbbr, getTeamColors } from "./teamVisuals";
import './TournamentView.scss';

const POLL_INTERVAL_MS = 20000;

const TournamentView = () => {
  const navigate = useNavigate();
  const { tournamentId, category } = useParams();
  const { sections } = useAppContext();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

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

  const activeCategoryIndex = useMemo(() => {
    if (!categories.length || !categoryReport) return -1;
    return categories.findIndex((item) => item === categoryReport);
  }, [categories, categoryReport]);

  const cycleCompetition = useCallback(() => {
    if (!categories.length) return;

    const currentIndex = activeCategoryIndex >= 0 ? activeCategoryIndex : 0;
    const nextCategory = categories[(currentIndex + 1) % categories.length];
    const nextKey = nextCategory?.key || nextCategory?.label;
    if (!nextKey) return;

    navigate(`/tournament/${tournamentId}/category/${encodeURIComponent(nextKey)}`);
    setActiveSectionIndex(0);
  }, [activeCategoryIndex, categories, navigate, tournamentId]);

  const handle = {
    back: () => navigate(`/tournament/${tournamentId}/home`),
  };
  const statusBannerTitle = categoryReport?.label || safeDecodeURIComponent(category) || 'Status';

  return (
    <MobileLayout
      sections={sections}
      onBack={handle.back}
      active={0}
      tabNames={["Status"]}
      banner={{
        kicker: 'Live competition status',
        title: statusBannerTitle,
        meta: categoryReport?.lastUpdated
          ? `Updated ${formatTime(categoryReport.lastUpdated)}`
          : 'Waiting for first update',
        onBack: handle.back,
        onNext: categories.length > 1 ? cycleCompetition : undefined,
      }}
    >
      <span aria-hidden="true" />
      <StatusContent
        loading={loading}
        error={error}
        categoryReport={categoryReport}
        requestedCategory={category}
        isFallbackCategory={isFallbackCategory}
        activeSectionIndex={activeSectionIndex}
        onSectionChange={setActiveSectionIndex}
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
  activeSectionIndex,
  onSectionChange,
}) => {
  if (loading && !categoryReport) {
    return (
      <section className="status-content">
        <div className="status-card status-card--message">Loading competition data...</div>
      </section>
    );
  }

  if (error && !categoryReport) {
    return (
      <section className="status-content">
        <div className="status-card status-card--error">
          <h2>Unable to load status</h2>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!categoryReport) {
    return (
      <section className="status-content">
        <div className="status-card status-card--message">
          <h2>No data available</h2>
          <p>We could not find details for this competition.</p>
        </div>
      </section>
    );
  }

  const {
    label,
    fixtures = [],
    groupStandings = [],
    knockoutFixtures = [],
    lastUpdated,
  } = categoryReport;

  return (
    <section className="status-content">
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

      <CompetitionSectionSwitcher
        groupStandings={groupStandings}
        fixtures={fixtures}
        knockoutFixtures={knockoutFixtures}
        activeSectionIndex={activeSectionIndex}
        onSectionChange={onSectionChange}
      />
    </section>
  );
};

const CompetitionSectionSwitcher = ({ 
  groupStandings,
  fixtures,
  knockoutFixtures,
  activeSectionIndex,
  onSectionChange,
}) => {
  const safeGroupStandings = groupStandings || [];
  const safeKnockoutFixtures = knockoutFixtures?.length
    ? knockoutFixtures
    : fixtures.filter((fixture) => isKnockoutStage(fixture.stage));
  const sectionSlides = useMemo(() => buildCompetitionSectionSlides({
    groupStandings: safeGroupStandings,
    fixtures,
    knockoutFixtures: safeKnockoutFixtures,
  }), [fixtures, safeGroupStandings, safeKnockoutFixtures]);
  const hasMultipleSections = sectionSlides.length > 1;
  const activeTabIndex =
    activeSectionIndex >= 0 && activeSectionIndex < sectionSlides.length
      ? activeSectionIndex
      : 0;
  const lastTabIndex = Math.max(sectionSlides.length - 1, 0);
  const swipeStartRef = useRef(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDraggingSection, setIsDraggingSection] = useState(false);
  const [sectionHandlesSettling, setSectionHandlesSettling] = useState(true);
  const selectSectionTab = useCallback((tabIndex) => {
    if (tabIndex === activeTabIndex) return;
    onSectionChange(Math.max(0, Math.min(sectionSlides.length - 1, tabIndex)));
  }, [activeTabIndex, onSectionChange, sectionSlides.length]);
  useEffect(() => {
    if (!hasMultipleSections) return undefined;

    setSectionHandlesSettling(true);
    const timerId = window.setTimeout(() => {
      setSectionHandlesSettling(false);
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [activeTabIndex, hasMultipleSections]);
  const handleSwipeStart = useCallback((event) => {
    const touch = event.touches?.[0];
    if (!touch) return;
    swipeStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    setIsDraggingSection(true);
    setDragOffset(0);
  }, []);
  const handleSwipeMove = useCallback((event) => {
    const start = swipeStartRef.current;
    const touch = event.touches?.[0];
    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const isHorizontalDrag = Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;

    if (!isHorizontalDrag) return;

    if (event.cancelable) {
      event.preventDefault();
    }

    const atFirstTab = activeTabIndex === 0 && deltaX > 0;
    const atLastTab = activeTabIndex === lastTabIndex && deltaX < 0;
    const resistance = atFirstTab || atLastTab ? 0.28 : 1;
    const maxOffset = 150;
    const constrainedOffset = Math.max(-maxOffset, Math.min(maxOffset, deltaX * resistance));
    setDragOffset(constrainedOffset);
  }, [activeTabIndex, lastTabIndex]);
  const handleSwipeEnd = useCallback((event) => {
    const start = swipeStartRef.current;
    const touch = event.changedTouches?.[0];
    swipeStartRef.current = null;
    setIsDraggingSection(false);
    setDragOffset(0);

    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.4) return;

    const direction = deltaX < 0 ? 1 : -1;
    const nextTabIndex = Math.max(0, Math.min(lastTabIndex, activeTabIndex + direction));
    if (nextTabIndex !== activeTabIndex) {
      selectSectionTab(nextTabIndex, direction);
    }
  }, [activeTabIndex, lastTabIndex, selectSectionTab]);

  if (sectionSlides.length === 0) {
    return (
      <div className="status-card status-card--message">
        <h2>No Sections</h2>
        <p>There are no standings or fixtures for this competition.</p>
      </div>
    );
  }

  const previousSlide = activeTabIndex > 0 ? sectionSlides[activeTabIndex - 1] : null;
  const nextSlide = activeTabIndex < lastTabIndex ? sectionSlides[activeTabIndex + 1] : null;

  return (
    <div
      className={`group-stage-shell ${hasMultipleSections ? 'is-swipeable' : ''}`}
      onTouchStart={hasMultipleSections ? handleSwipeStart : undefined}
      onTouchMove={hasMultipleSections ? handleSwipeMove : undefined}
      onTouchEnd={hasMultipleSections ? handleSwipeEnd : undefined}
      onTouchCancel={hasMultipleSections ? handleSwipeEnd : undefined}
    >
      <SectionTabs
        sections={sectionSlides}
        activeIndex={activeTabIndex}
        onSelect={selectSectionTab}
      />
      <div className="group-swipe-region">
        <div
          className={`group-swipe-region__track ${isDraggingSection ? 'is-dragging' : ''}`}
          style={{ '--group-track-offset': `calc(${-activeTabIndex * 100}% + ${dragOffset}px)` }}
        >
          {sectionSlides.map((slide) => (
            <div className="group-swipe-region__slide" key={slide.key}>
              {slide.content}
            </div>
          ))}
        </div>
      </div>
      {hasMultipleSections ? (
        <GroupStageSideNav
          previousSlide={previousSlide}
          nextSlide={nextSlide}
          isSettling={sectionHandlesSettling}
          onPrevious={() => previousSlide && selectSectionTab(activeTabIndex - 1)}
          onNext={() => nextSlide && selectSectionTab(activeTabIndex + 1)}
        />
      ) : null}
    </div>
  );
};

const buildCompetitionSectionSlides = ({ groupStandings, fixtures, knockoutFixtures }) => {
  const groupSlides = groupStandings.map((group, index) => ({
    key: `group-${group.key || group.label || index}`,
    label: formatGroupTabLabel(group, index),
    count: group?.rows?.length || group?.teams?.length || 0,
    subtitle: 'teams',
    content: (
      <SingleGroupContent
        group={group}
        fixtures={fixtures}
        showHeader={false}
      />
    ),
  }));

  const knockoutSlides = groupKnockoutFixtures(knockoutFixtures).map(({ key, label, fixtures: sectionFixtures }) => ({
    key: `knockout-${key}`,
    label,
    count: sectionFixtures.length,
    subtitle: 'games',
    content: (
      <div
        className="group-panel group-panel--knockout"
      >
        <GroupFixturesList fixtures={sectionFixtures} />
      </div>
    ),
  }));

  return [...groupSlides, ...knockoutSlides];
};

const GroupStageSideNav = ({
  previousSlide,
  nextSlide,
  isSettling,
  onPrevious,
  onNext,
}) => (
  <div className="group-stage-side-nav" aria-label="Group navigation">
    <div className="group-stage-side-nav__slot group-stage-side-nav__slot--previous">
      {previousSlide ? (
        <button
          type="button"
          className={`group-stage-side-nav__button group-stage-side-nav__button--previous ${
            isSettling ? 'is-settling' : 'is-subtle'
          }`}
          onClick={onPrevious}
          aria-label={`Show ${previousSlide.label}`}
        >
          <span className="group-stage-side-nav__handle" aria-hidden="true">
            <i className="pi pi-angle-left" />
          </span>
        </button>
      ) : null}
    </div>
    <div className="group-stage-side-nav__slot group-stage-side-nav__slot--next">
      {nextSlide ? (
        <button
          type="button"
          className={`group-stage-side-nav__button group-stage-side-nav__button--next ${
            isSettling ? 'is-settling' : 'is-subtle'
          }`}
          onClick={onNext}
          aria-label={`Show ${nextSlide.label}`}
        >
          <span className="group-stage-side-nav__handle" aria-hidden="true">
            <i className="pi pi-angle-right" />
          </span>
        </button>
      ) : null}
    </div>
  </div>
);

const SectionTabs = ({ sections, activeIndex, onSelect }) => {
  return (
    <div className="group-tabs" role="tablist" aria-label="Competition sections">
      {sections.map((section, index) => {
        return (
          <button
            key={section.key || index}
            type="button"
            className={`group-tabs__tab ${index === activeIndex ? "is-active" : ""}`}
            onClick={() => onSelect(index, index - activeIndex)}
            role="tab"
            aria-selected={index === activeIndex}
          >
            <strong>{section.label}</strong>
            {section.count ? <small>{section.count} {section.subtitle}</small> : null}
          </button>
        );
      })}
    </div>
  );
};

const formatGroupTabLabel = (group, index) => {
  const raw = String(group?.label || group?.key || index + 1).trim();
  const number = raw.match(/\d+/)?.[0];
  return number ? `Gp.${number}` : raw.replace(/^group/i, 'Gp.');
};

const SingleGroupContent = ({ group, fixtures, showHeader = true }) => {
  if (!group) return null;

  const { label: groupLabel, rows = [] } = group;

  const groupFixtures = fixtures.filter((fixture) => fixtureBelongsToGroup(fixture, group));

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

  return (
    <div className="group-panel">
      {showHeader ? (
        <div className="group-panel__header">
          <span>
            <strong>{groupLabel}</strong>
            <small>{numTeams} teams</small>
          </span>
        </div>
      ) : null}
      <StandingsTable
        rows={rows}
        emptyMessage="No results for this group yet."
      />
      <div className="group-panel__status-row">
        {isComplete ? (
          <span className="group-panel__status group-panel__status--complete">Complete</span>
        ) : remainingMatches > 0 ? (
          <span className="group-panel__status group-panel__status--pending">{`${remainingMatches} left`}</span>
        ) : null}
      </div>
      <GroupFixturesList fixtures={groupFixtures} />
    </div>
  );
};

const GroupFixturesList = ({ fixtures = [] }) => {
  if (!fixtures.length) {
    return <div className="fixture-list__empty">No matches</div>;
  }

  const sortedFixtures = fixtures.slice().sort((a, b) => {
    const aUpcoming = isFixtureUpcoming(a);
    const bUpcoming = isFixtureUpcoming(b);
    const aLive = isFixtureLive(a);
    const bLive = isFixtureLive(b);

    if (aLive && !bLive) return -1;
    if (!aLive && bLive) return 1;
    if (aUpcoming && !bUpcoming && !bLive) return -1;
    if (!aUpcoming && bUpcoming && !aLive) return 1;

    const aTime = a.scheduled ? new Date(a.scheduled).getTime() : Number.MAX_SAFE_INTEGER;
    const bTime = b.scheduled ? new Date(b.scheduled).getTime() : Number.MAX_SAFE_INTEGER;

    if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && aTime !== bTime) {
      return aTime - bTime;
    }

    return String(a.matchId).localeCompare(String(b.matchId), undefined, { numeric: true });
  });

  return (
    <div className="fixture-list">
      {sortedFixtures.map((fixture) => (
        <ModernFixtureRow key={fixture.matchId} fixture={fixture} />
      ))}
    </div>
  );
};

const ModernFixtureRow = ({ fixture }) => {
  const isPlayed = fixture.outcome === "played" || Boolean(fixture.result);
  const isLive = isFixtureLive(fixture);
  const isUpcoming = isFixtureUpcoming(fixture);
  const display = getDisplayFixture(fixture);
  const statusLabel = isLive ? "Live" : isPlayed ? "FT" : formatFixtureTime(fixture.scheduled);
  const stageLabel = getFixtureStageCode(fixture);
  const rowTone = isLive
    ? "is-live"
    : isUpcoming
      ? "is-upcoming"
      : Number(fixture.matchId) % 2 === 0
        ? "is-even"
        : "is-odd";

  return (
    <article className={`fixture-row ${rowTone}`}>
      <span className="fixture-row__id" aria-hidden="true">{formatFixtureId(fixture.matchId)}</span>
      <div className="fixture-row__meta">
        <span className="fixture-row__status">{statusLabel || "TBD"}</span>
        <span className="fixture-row__stage">{stageLabel}</span>
      </div>
      <VersusPillar topTeamName={display.top.name} bottomTeamName={display.bottom.name} />
      <div className="fixture-row__teams">
        <div className="fixture-row__team">
          <span className={display.top.won ? "is-winner" : ""}>{display.top.name}</span>
          {isPlayed ? (
            <strong className={display.top.won ? "is-winner" : ""}>{formatFixtureScore(display.top.score)}</strong>
          ) : null}
        </div>
        <div className="fixture-row__team">
          <span className={display.bottom.won ? "is-winner" : ""}>{display.bottom.name}</span>
          {isPlayed ? (
            <strong className={display.bottom.won ? "is-winner" : ""}>{formatFixtureScore(display.bottom.score)}</strong>
          ) : null}
        </div>
      </div>
    </article>
  );
};

const VersusPillar = ({ topTeamName, bottomTeamName }) => (
  <div className="versus-pillar">
    <TeamBadge team={topTeamName} />
    <TeamBadge team={bottomTeamName} />
    <span>vs</span>
  </div>
);

const TeamBadge = ({ team }) => {
  const colors = getTeamColors(team);

  return (
    <span
      className="team-badge"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {getTeamAbbr(team)}
    </span>
  );
};



const fixtureBelongsToGroup = (fixture, group) => {
  const { key, rows = [] } = group;
  const fixtureGroup = String(fixture.group || "").trim().toLowerCase();
  const groupKey = String(key || "").trim().toLowerCase();
  const fixtureGroupClean = fixtureGroup.replace(/^group\s?/i, '');
  const groupKeyClean = groupKey.replace(/^group\s?/i, '');
  const stage = String(fixture.stage || "").trim().toLowerCase();

  if (fixtureGroup && fixtureGroup === groupKey) return true;
  if (fixtureGroupClean && fixtureGroupClean === groupKeyClean) return true;
  if (stage === groupKey || stage === `group ${groupKey}` || stage === `group ${groupKeyClean}`) return true;
  if (stage.replace(/^group\s?/i, '') === groupKeyClean) return true;

  if (!fixtureGroup && !isKnockoutStage(stage)) {
    const teamNames = rows.map((row) => String(row.team || row.name || row.teamName).toLowerCase());
    const team1 = String(fixture.team1).toLowerCase();
    const team2 = String(fixture.team2).toLowerCase();
    return teamNames.includes(team1) && teamNames.includes(team2);
  }

  return false;
};

const isFixtureLive = (fixture) => {
  return Boolean(fixture.actualStarted) && !fixture.actualEnded;
};

const isFixtureUpcoming = (fixture) => {
  return fixture.outcome !== "played" && !fixture.result && !isFixtureLive(fixture);
};

const getDisplayFixture = (fixture) => {
  const team1 = {
    name: fixture.team1 || "TBD",
    score: fixture.result?.team1 || {},
  };
  const team2 = {
    name: fixture.team2 || "TBD",
    score: fixture.result?.team2 || {},
  };
  const team1Total = getScoreTotal(team1.score);
  const team2Total = getScoreTotal(team2.score);
  const team1Won = typeof team1Total === "number" && typeof team2Total === "number" && team1Total > team2Total;
  const team2Won = typeof team1Total === "number" && typeof team2Total === "number" && team2Total > team1Total;

  if (team2Won) {
    return {
      top: { ...team2, won: true },
      bottom: { ...team1, won: false },
    };
  }

  return {
    top: { ...team1, won: team1Won },
    bottom: { ...team2, won: team2Won },
  };
};

const getScoreTotal = ({ goals, points, total } = {}) => {
  if (typeof total === "number") return total;
  if (typeof goals === "number" || typeof points === "number") {
    return (goals ?? 0) * 3 + (points ?? 0);
  }
  return null;
};

const formatFixtureScore = (score = {}) => {
  const goals = score.goals ?? 0;
  const points = score.points ?? 0;
  const total = getScoreTotal(score);

  if (typeof total !== "number") return "-";
  return `${goals}-${String(points).padStart(2, "0")} (${String(total).padStart(2, "0")})`;
};

const formatFixtureTime = (scheduled) => {
  if (!scheduled) return "";

  const rawMatch = String(scheduled).match(/T(\d{2}):(\d{2})/);
  if (rawMatch) return `${rawMatch[1]}:${rawMatch[2]}`;

  const date = new Date(scheduled);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const getFixtureStageCode = (fixture) => {
  const group = fixture.group ?? String(fixture.stage || "").match(/\d+/)?.[0];
  const normalizedStage = String(fixture.stage || "").trim();

  if (group && !isKnockoutStage(normalizedStage)) return `GP.${group}`;
  return normalizedStage || "Match";
};

const formatFixtureId = (matchId) => {
  const value = Number(matchId);
  if (Number.isFinite(value)) return `LS.${String(value % 100).padStart(2, "0")}`;
  return String(matchId || "");
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

const groupKnockoutFixtures = (fixtures = []) => {
  const grouped = fixtures.reduce((acc, fixture) => {
    const section = getKnockoutSectionMeta(fixture);
    if (!acc[section.key]) {
      acc[section.key] = {
        ...section,
        fixtures: [],
      };
    }
    acc[section.key].fixtures.push(fixture);
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.label.localeCompare(b.label);
  });
};

const getKnockoutSectionMeta = (fixture) => {
  const bracket = getFixtureBracket(fixture);
  if (bracket) return bracket;

  return {
    key: "knockout",
    label: "Knockout",
    order: 10,
  };
};

const getFixtureBracket = (fixture) => {
  const rawBracket = String(fixture?.bracket || "").trim();
  const bracketFromField = getBracketFromText(rawBracket);
  if (bracketFromField) return bracketFromField;

  return getBracketFromStage(fixture?.stage);
};

const getBracketFromStage = (stage) => {
  const rawStage = String(stage || "").trim();
  const normalized = rawStage.toLowerCase();
  const firstStagePart = normalized.split(/[_/\-\s]+/)[0];
  return getBracketFromText(firstStagePart);
};

const getBracketFromText = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return null;
  const knownSections = [
    { key: "cup", label: "Cup", order: 0 },
    { key: "shield", label: "Shield", order: 1 },
    { key: "sheild", label: "Shield", order: 1, normalizedKey: "shield" },
    { key: "shd", label: "Shield", order: 1, normalizedKey: "shield" },
    { key: "sld", label: "Shield", order: 1, normalizedKey: "shield" },
    { key: "plate", label: "Plate", order: 2 },
    { key: "plt", label: "Plate", order: 2, normalizedKey: "plate" },
  ];

  const knownSection = knownSections.find((section) => (
    normalized === section.key ||
    normalized.startsWith(`${section.key}_`) ||
    normalized.startsWith(`${section.key}-`) ||
    normalized.startsWith(`${section.key}/`) ||
    normalized.startsWith(`${section.key} `)
  ));
  if (knownSection) {
    return {
      key: knownSection.normalizedKey || knownSection.key,
      label: knownSection.label,
      order: knownSection.order,
    };
  }

  if (/^(sf|qf|fin|final|finals|semi|semis|playoff|p\/o|\d+\/\d+)/i.test(normalized)) {
    return null;
  }

  const fallbackLabel = String(value || "").trim();
  if (!fallbackLabel) return null;

  return {
    key: fallbackLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "knockout",
    label: toTitleLabel(fallbackLabel),
    order: 10,
  };
};

const isKnockoutStage = (stage) => {
  if (!stage) return false;
  const normalized = String(stage).toLowerCase();
  return /knock|semi|quarter|final|cup|playoff|p\/o|shield|plate/.test(normalized) ||
    /^(sf|qf|fin|3\/4|5\/6|7\/8|9\/10)/i.test(String(stage).trim());
};

const toTitleLabel = (value) => {
  return String(value || "")
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

    if (!normalized.bracket && context) {
      const contextBracket = getBracketFromText(context);
      if (contextBracket) {
        normalized.bracket = contextBracket.key;
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
  const rawBracket = fixture.bracket || planned.bracket || actual.bracket || "";
  const stage = fixture.stage || planned.stage || actual.stage || rawBracket || "";
  
  const group = fixture.groupNumber ?? fixture.group ?? fixture.pool ?? planned.pool ?? null;

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
    bracket: rawBracket || getBracketFromText(stage)?.key || "",
    group,
    team1: team1Data.name || planned.team1 || fixture.team1 || "",
    team2: team2Data.name || planned.team2 || fixture.team2 || "",
    umpire,
    scheduled,
    pitch: pitch ? String(pitch) : "",
    actualStarted: actual.started || fixture.started || null,
    actualEnded: actual.ended || fixture.ended || null,
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
