import { useState } from 'react'
import { createPortal } from 'react-dom'
import './KanbanCard.scss'
import FixtureBar from './FixtureBar'
import TimeDisplay from './TimeDisplay'
import PitchIcon from '../../../../shared/icons/icon-pitch-2.svg?react'
import UmpireIcon from '../../../../shared/icons/icon-umpires-circle.svg?react'
import CancelIcon from '../../../../shared/icons/icon-cancel.svg?react'
import StartIcon from '../../../../shared/icons/icon-start.svg?react'
import ScoreIcon from '../../../../shared/icons/icon-score.svg?react'
import MoveIcon from '../../../../shared/icons/icon-move.svg?react'
import NotPlayedIcon from '../../../../shared/icons/icon-notplayed.svg?react'
import CardIcon from '../../../../shared/icons/icon-card.svg?react'
import ViewIcon from '../../../../shared/icons/icon-details.svg?react'
import '../../../../components/web/logo-box.js'
import '../../../../components/web/team-name.js'
import '../../../../components/web/gaelic-score.js'

const KanbanCard = ({
  fixture,
  onDragStart,
  onClick,
  isSelected,
  setMoveBarFixtureId,
  recentlyMovedFixtureId,
  isInlineMoveMode,
  inlineMoveFixtureId,
  inlineMoveTargetPitch,
  inlineMoveSwapFixtureId,
  onInlineMoveUp,
  onInlineMoveDown,
  onInlineSwap,
  canInlineMoveUp,
  canInlineMoveDown,
  inlineMoveSlackMinutes = 0,
  onAdjustInlineSlack,
  canAdjustInlineSlack = true,
  largeMode = false,
  actionRail = null,
  hideInactiveActionRail = false,
  hideActionRail = false,
}) => {
  const [teamReadinessDialog, setTeamReadinessDialog] = useState(null)
  const displayCategory = fixture.category ? fixture.category.substring(0, 9).toUpperCase() : ''
  const displayStage = fixture.stage
    ? fixture.stage
        .toUpperCase()
        .replace('PLT', 'Plate')
        .replace('CUP', 'Cup')
        .replace('SHD', 'Shield')
        .replace('_', '/')
    : ''
  const displayNumber = fixture?.groupNumber || '0'
  const teamStyle = {
    fontSize: largeMode ? '2.4em' : '1.6em',
    fontWeight: 'bold',
    marginLeft: largeMode ? '0' : '-0.3rem',
  }

  const getNumber = (val) => {
    if (val === null || val === undefined || val === '') return 0
    const num = Number(val)
    return isNaN(num) ? 0 : num
  }

  const hasScore =
    fixture.goals1 !== null &&
    fixture.goals1 !== undefined &&
    fixture.goals2 !== null &&
    fixture.goals2 !== undefined &&
    fixture.points1 !== null &&
    fixture.points1 !== undefined &&
    fixture.points2 !== null &&
    fixture.points2 !== undefined

  const hasExtraTime =
    hasScore &&
    ((fixture.goals1Extra !== null && fixture.goals1Extra !== undefined) ||
      (fixture.points1Extra !== null && fixture.points1Extra !== undefined) ||
      (fixture.goals2Extra !== null && fixture.goals2Extra !== undefined) ||
      (fixture.points2Extra !== null && fixture.points2Extra !== undefined))

  const vspace = hasScore ? '2.1rem' : 0

  const goals1Total = hasScore ? getNumber(fixture.goals1) + getNumber(fixture.goals1Extra) : 0
  const points1Total = hasScore ? getNumber(fixture.points1) + getNumber(fixture.points1Extra) : 0
  const goals2Total = hasScore ? getNumber(fixture.goals2) + getNumber(fixture.goals2Extra) : 0
  const points2Total = hasScore ? getNumber(fixture.points2) + getNumber(fixture.points2Extra) : 0

  const total1 = goals1Total * 3 + points1Total
  const total2 = goals2Total * 3 + points2Total

  const hasPenalties =
    hasExtraTime &&
    ((fixture.goals1Penalties !== null && fixture.goals1Penalties !== undefined) ||
      (fixture.goals2Penalties !== null && fixture.goals2Penalties !== undefined))

  const pen1 = getNumber(fixture.goals1Penalties)
  const pen2 = getNumber(fixture.goals2Penalties)

  const isFinished = fixture.outcome === 'played'
  const isOngoingWithScore = !isFinished && hasScore
  const team1Won = isFinished && (hasPenalties ? pen1 > pen2 : total1 > total2)
  const team2Won = isFinished && (hasPenalties ? pen2 > pen1 : total2 > total1)
  const isDraw = isFinished && !hasPenalties && total1 === total2
  const isOngoing = fixture?.lane?.current === 'started' && fixture.startedTime

  const handleClick = () => {
    if (isInlineMoveMode) return

    setMoveBarFixtureId?.(null)
    onClick()
  }

  const handleDragStart = (event) => {
    if (event.target?.closest?.('.team-readiness-button')) {
      event.preventDefault()
      return
    }

    onDragStart(event)
  }

  const isRecentlyMoved = fixture.id === recentlyMovedFixtureId
  const isInlineMoveCard = isInlineMoveMode && fixture.id === inlineMoveFixtureId
  const isMoveCandidateLane =
    fixture?.lane?.current === 'planned' || fixture?.lane?.current === 'queued'
  const isInlineMoveListCard = isInlineMoveMode && isMoveCandidateLane
  const useLargeCardSizing = largeMode && !isInlineMoveListCard
  const showInlineSwapAction = false
  const isInlineSwapTarget = inlineMoveSwapFixtureId === fixture.id
  const hasInlineActionRail = Boolean(actionRail)
  const reserveActionRail = !hideActionRail
  const laneClass = fixture?.lane?.current || 'unknown'
  const showInactiveLockedRail = laneClass === 'planned' || laneClass === 'finished'
  const inactiveRailIconsByLane = {
    planned: [ViewIcon, NotPlayedIcon, MoveIcon, StartIcon],
    queued: [ViewIcon, NotPlayedIcon, MoveIcon, StartIcon],
    started: [ViewIcon, ScoreIcon, CardIcon, NotPlayedIcon],
    finished: [ViewIcon, NotPlayedIcon, CardIcon],
  }
  const inactiveRailIcons = inactiveRailIconsByLane[laneClass] || [ViewIcon, NotPlayedIcon]
  const team1Name = fixture.team1 || 'TBD'
  const team2Name = fixture.team2 || 'TBD'
  const moveModeTeamStyle = isInlineMoveListCard
    ? {
        ...teamStyle,
        fontSize: '1.63em',
        marginLeft: '-0.15rem',
      }
    : teamStyle
  const teamHeight = isInlineMoveListCard
    ? '42px'
    : useLargeCardSizing ? '75px' : '50px'
  const moveModeLogoSize = '5.1rem'
  const teamMaxChars = isInlineMoveListCard ? '24' : '28'
  const addMinutesToTime = (time, minutesToAdd) => {
    if (!time || !minutesToAdd) return time

    const match = `${time}`.match(/^(\d{1,2}):(\d{2})$/)
    if (!match) return time

    const [, hours, minutes] = match
    const totalMinutes = Number(hours) * 60 + Number(minutes) + minutesToAdd
    const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440
    const nextHours = Math.floor(normalizedMinutes / 60)
    const nextMinutes = normalizedMinutes % 60

    return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`
  }
  const displayedScheduledTime = isInlineMoveCard
    ? addMinutesToTime(fixture.scheduledTime, inlineMoveSlackMinutes)
    : fixture.scheduledTime

  const normalizeReadyValue = (value) => {
    if (value === true || value === false) return value
    if (value === 1 || value === 0) return Boolean(value)
    if (typeof value !== 'string') return undefined

    const normalizedValue = value.trim().toLowerCase()
    if (normalizedValue === 'true') return true
    if (normalizedValue === 'false') return false
    return undefined
  }

  const getTeamReadiness = (teamKey, teamName) => {
    const directReadyKey = `${teamKey}Ready`

    if (Object.prototype.hasOwnProperty.call(fixture, directReadyKey)) {
      return normalizeReadyValue(fixture[directReadyKey])
    }

    if (!Object.prototype.hasOwnProperty.call(fixture, 'teamReady')) {
      return undefined
    }

    if (fixture.teamReady && typeof fixture.teamReady === 'object') {
      const candidateKeys = [
        teamKey,
        directReadyKey,
        fixture[`${teamKey}Id`],
        teamName,
      ].filter(Boolean)

      const matchingKey = candidateKeys.find((key) =>
        Object.prototype.hasOwnProperty.call(fixture.teamReady, key)
      )

      return matchingKey
        ? normalizeReadyValue(fixture.teamReady[matchingKey])
        : undefined
    }

    return normalizeReadyValue(fixture.teamReady)
  }

  const renderTeamReadinessButton = (teamKey, teamName) => {
    if (hideActionRail) return null
    if (!isSelected) return null

    const ready = getTeamReadiness(teamKey, teamName)

    if (ready === undefined) return null

    const readinessLabel = ready
      ? `${teamName} approved`
      : `${teamName} not ready`

    const openReadinessDialog = () => {
      setTeamReadinessDialog({
        fixtureId: fixture?.id,
        teamKey,
        teamName,
        ready,
      })
    }

    const stopReadinessPress = (event) => {
      event.stopPropagation()
    }

    const handleReadinessClick = (event) => {
      event.preventDefault()
      event.stopPropagation()
      openReadinessDialog()
    }

    return (
      <button
        type="button"
        className={`team-readiness-button ${ready ? 'is-ready' : 'is-not-ready'}`}
        aria-label={readinessLabel}
        title={readinessLabel}
        draggable="false"
        onPointerDown={stopReadinessPress}
        onMouseDown={stopReadinessPress}
        onTouchStart={stopReadinessPress}
        onClick={handleReadinessClick}
      >
        {ready ? <i className="pi pi-check" aria-hidden="true" /> : '!'}
      </button>
    )
  }

  const getTeamRowClassName = (baseClassName, teamKey, teamName) => {
    const ready = getTeamReadiness(teamKey, teamName)
    return `${baseClassName}${!hideActionRail && isSelected && ready !== undefined ? ' has-readiness' : ''}`
  }

  const closeTeamReadinessDialog = () => {
    setTeamReadinessDialog(null)
  }

  const saveTeamReadinessDialog = () => {
    setTeamReadinessDialog(null)
  }

  const renderTeamReadinessDialog = () => {
    if (!teamReadinessDialog) return null

    const dialog = (
      <div
        className="team-readiness-dialog-overlay"
        role="presentation"
        onClick={closeTeamReadinessDialog}
      >
        <div
          className="team-readiness-dialog"
          role="dialog"
          aria-modal="true"
          aria-label="Team readiness"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="team-readiness-dialog__body" />
          <div className="team-readiness-dialog__actions">
            <button
              type="button"
              className="team-readiness-dialog__button team-readiness-dialog__button--cancel"
              onClick={closeTeamReadinessDialog}
            >
              Cancel
            </button>
            <button
              type="button"
              className="team-readiness-dialog__button team-readiness-dialog__button--save"
              onClick={saveTeamReadinessDialog}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )

    return createPortal(dialog, document.body)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className={`kanban-card ${isSelected ? 'selected' : ''} ${
        isRecentlyMoved ? 'recently-moved' : ''
      } ${isInlineMoveCard ? 'inline-move-active' : ''} ${
        isInlineMoveListCard ? 'inline-move-list' : ''
      } ${
        showInlineSwapAction ? 'inline-move-context' : ''
      } ${isInlineSwapTarget ? 'inline-swap-target' : ''} ${
        reserveActionRail ? 'has-action-rail-card' : ''
      } lane-${laneClass}`}
    >
      <div className={`kanban-card-frame ${reserveActionRail ? 'has-action-rail' : ''}`}>
        <div className="kanban-card-inner">
          <FixtureBar
            fixtureId={fixture.id}
            category={displayCategory}
            stage={displayStage}
            number={displayNumber}
            competitionPrefix={fixture?.competition?.initials}
            competitionOffset={fixture?.competition?.offset}
          />
          {fixture.endedWithoutScore && (
            <div
              className="warning-icon"
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'orange', fontSize: '2rem' }}
            >
              <CancelIcon width="24" height="24" />
            </div>
          )}
          {fixture.scheduledTime ? (
            <TimeDisplay
              scheduledTime={displayedScheduledTime}
              startedTime={fixture.startedTime}
              started={fixture.started || fixture.actualStartedTime}
              durationPlanned={fixture.durationPlanned}
              isOngoing={isOngoing}
              showSlackControls={isInlineMoveCard && canAdjustInlineSlack}
              slackMinutes={inlineMoveSlackMinutes}
              onAdjustSlack={onAdjustInlineSlack}
            />
          ) : (
            <div style={{ height: '2.4rem' }}>&nbsp;</div>
          )}
          <div className="kanban-card-content-wrapper">
            <div className={`teams-container ${isInlineMoveListCard ? 'teams-container-move-mode' : ''}`}>
              {isInlineMoveListCard ? (
                <div className="teams-stack-row">
                  <span className="inline-move-vs-row">vs</span>
                  <div className={getTeamRowClassName('team-row team-row-inline-move', 'team1', team1Name)}>
                    <logo-box size={moveModeLogoSize} title={team1Name}></logo-box>
                    <team-name
                      style={moveModeTeamStyle}
                      name={team1Name}
                      showLogo="false"
                      height={teamHeight}
                      maxchars={teamMaxChars}
                    ></team-name>
                    {renderTeamReadinessButton('team1', team1Name)}
                  </div>
                  <div className={getTeamRowClassName('team-row team-row-inline-move', 'team2', team2Name)}>
                    <logo-box size={moveModeLogoSize} title={team2Name}></logo-box>
                    <team-name
                      style={moveModeTeamStyle}
                      name={team2Name}
                      showLogo="false"
                      height={teamHeight}
                      maxchars={teamMaxChars}
                    ></team-name>
                    {renderTeamReadinessButton('team2', team2Name)}
                  </div>
                </div>
              ) : (
                <>
                  <div className={getTeamRowClassName('team-row pb-1', 'team1', team1Name)}>
                    <team-name
                      style={teamStyle}
                      name={fixture.team1 || 'TBD'}
                      showLogo="true"
                      height={teamHeight}
                      maxchars={teamMaxChars}
                      title-margin-below={vspace}
                      logo-margin-right="0.5rem"
                    ></team-name>
                    {renderTeamReadinessButton('team1', team1Name)}
                    {hasScore && (
                      <div className="score-container">
                        <div
                          className={`score-badge ${
                            isOngoingWithScore ? '' : team1Won ? 'winner' : team2Won ? 'loser' : isDraw ? 'draw' : ''
                          }`}
                        >
                          <gaelic-score
                            style={{ width: 'auto' }}
                            goals={goals1Total}
                            points={points1Total}
                            goalsagainst={goals2Total}
                            pointsagainst={points2Total}
                            played={fixture.outcome === 'played'}
                          ></gaelic-score>
                        </div>
                        {hasExtraTime && <span className="aet-label">AET</span>}
                        {hasPenalties && (
                          <span className={`pen-label ${team1Won ? 'pen-won' : 'pen-lost'}`}>PEN({pen1})</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="vs-row">vs</div>

                  <div className={getTeamRowClassName('team-row', 'team2', team2Name)}>
                    <team-name
                      style={teamStyle}
                      name={fixture.team2 || 'TBD'}
                      showLogo="true"
                      height={teamHeight}
                      maxchars={teamMaxChars}
                      title-margin-below={vspace}
                      logo-margin-right="0.5rem"
                    ></team-name>
                    {renderTeamReadinessButton('team2', team2Name)}
                    {hasScore && (
                      <div className="score-container">
                        <div
                          className={`score-badge ${
                            isOngoingWithScore ? '' : team2Won ? 'winner' : team1Won ? 'loser' : isDraw ? 'draw' : ''
                          }`}
                        >
                          <gaelic-score
                            style={{ width: 'auto' }}
                            goals={goals2Total}
                            points={points2Total}
                            goalsagainst={goals1Total}
                            pointsagainst={points1Total}
                            played={fixture.outcome === 'played'}
                          ></gaelic-score>
                        </div>
                        {hasExtraTime && <span className="aet-label">AET</span>}
                        {hasPenalties && (
                          <span className={`pen-label ${team2Won ? 'pen-won' : 'pen-lost'}`}>PEN({pen2})</span>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {fixture?.lane?.current === 'planned' && !largeMode && !isInlineMoveListCard && (
              <div className="card-detail pitch-info">
                <PitchIcon width={48} height={48} />
                <b>{fixture.pitch}</b>
              </div>
            )}

            {!isInlineMoveListCard && (
              fixture?.lane?.current === 'planned' ||
              fixture?.lane?.current === 'queued' ||
              fixture?.lane?.current === 'started'
            ) && (
              <div className="card-detail umpire-info">
                <div>
                  <team-name
                    style={teamStyle}
                    name={fixture.umpireTeam || 'TBD'}
                    showLogo="true"
                    height="35px"
                    width="100%"
                    maxchars="28"
                    title-margin-below={vspace}
                    logo-margin-right="0.5rem"
                  ></team-name>
                  <UmpireIcon width={42} height={42} />
                </div>
              </div>
            )}
          </div>
        </div>
        {reserveActionRail && (
          hasInlineActionRail ? (
            <div
              className="kanban-card-action-rail kanban-card-action-rail--active"
              draggable="false"
            >
              {actionRail}
            </div>
          ) : hideInactiveActionRail || isInlineMoveListCard ? (
            <div
              className="kanban-card-action-rail kanban-card-action-rail--blank"
              draggable="false"
              aria-hidden="true"
            />
          ) : showInactiveLockedRail ? (
            <div
              className="kanban-card-action-rail kanban-card-action-rail--inactive kanban-card-action-rail--locked-placeholder"
              draggable="false"
              aria-hidden="true"
            >
              <span className="kanban-card-action-rail__locked-slider">
                <span className="inactive-slide-to-unlock">
                  <span className="inactive-slide-track">
                    <span className="inactive-slide-text">
                      <span>Slide to</span>
                      <span>unlock</span>
                    </span>
                    <span className="inactive-slide-handle">
                      <span className="inactive-handle-icon pi pi-arrow-down" />
                    </span>
                  </span>
                </span>
              </span>
            </div>
          ) : (
            <div
              className="kanban-card-action-rail kanban-card-action-rail--inactive"
              draggable="false"
              aria-hidden="true"
            >
              {inactiveRailIcons.map((Icon, index) => (
                <span
                  key={`inactive-action-${index}`}
                  className="kanban-card-action-rail__placeholder-button"
                >
                  <Icon className="icon" />
                </span>
              ))}
            </div>
          )
        )}
      </div>
      {renderTeamReadinessDialog()}
    </div>
  )
}

export default KanbanCard
