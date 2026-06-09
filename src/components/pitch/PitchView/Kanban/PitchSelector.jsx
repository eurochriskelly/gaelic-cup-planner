import { useEffect, useMemo, useState } from 'react'
import './PitchSelector.scss'
import OnAirLight from './OnAirLight'

const normalizePitch = (value) => {
  if (value === null || value === undefined) return null
  return `${value}`.trim() || null
}

const uniquePitches = (values = []) => (
  Array.from(new Set(values.map(normalizePitch).filter(Boolean)))
)

const PitchSelector = ({
  pitches,
  selectedPitch,
  onSelectPitch,
  onSelectionCommit,
  pitchStatuses = {},
  coordinatedPitches = [],
}) => {
  const [nowMs, setNowMs] = useState(Date.now())
  const [isEditing, setIsEditing] = useState(false)
  const [draftPitches, setDraftPitches] = useState([])
  const [draftActivePitch, setDraftActivePitch] = useState(null)

  const availablePitches = useMemo(() => uniquePitches(pitches), [pitches])
  const persistedPitches = useMemo(() => (
    uniquePitches(coordinatedPitches).filter((pitch) => availablePitches.includes(pitch))
  ), [availablePitches, coordinatedPitches])
  const selectedPitchId = normalizePitch(selectedPitch)
  const visibleSelectedPitches = useMemo(() => (
    persistedPitches.length
      ? persistedPitches
      : uniquePitches([selectedPitchId]).filter((pitch) => availablePitches.includes(pitch))
  ), [availablePitches, persistedPitches, selectedPitchId])
  const activePitch = isEditing
    ? (draftActivePitch || draftPitches[0] || null)
    : (selectedPitchId || visibleSelectedPitches[0] || null)
  const selectedSet = new Set(isEditing ? draftPitches : visibleSelectedPitches)
  const selectedCount = selectedSet.size
  const totalCount = availablePitches.length

  useEffect(() => {
    const timer = setInterval(() => {
      setNowMs(Date.now())
    }, 30000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isEditing) return
    setDraftPitches(visibleSelectedPitches)
    setDraftActivePitch(activePitch)
  }, [activePitch, isEditing, visibleSelectedPitches])

  const getLiveMinutes = (status) => {
    if (!status?.liveStartedAtMs) return null
    return Math.max(0, Math.floor((nowMs - status.liveStartedAtMs) / 60000))
  }

  const startEditing = () => {
    setDraftPitches(visibleSelectedPitches)
    setDraftActivePitch(activePitch)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setDraftPitches(visibleSelectedPitches)
    setDraftActivePitch(activePitch)
    setIsEditing(false)
  }

  const saveEditing = () => {
    if (!draftPitches.length) return
    const nextActivePitch = draftPitches.includes(draftActivePitch)
      ? draftActivePitch
      : draftPitches[0]

    onSelectionCommit?.(draftPitches, nextActivePitch)
    setIsEditing(false)
  }

  const addDraftPitch = (pitch) => {
    setDraftPitches((current) => (
      current.includes(pitch) ? current : [...current, pitch]
    ))
    setDraftActivePitch(pitch)
  }

  const removeDraftPitch = (pitch) => {
    setDraftPitches((current) => {
      if (current.length <= 1) return current

      const nextPitches = current.filter((item) => item !== pitch)
      if (draftActivePitch === pitch) {
        setDraftActivePitch(nextPitches[0] || null)
      }
      return nextPitches
    })
  }

  const handlePitchClick = (pitch, isSelected) => {
    if (isEditing) {
      if (isSelected) {
        setDraftActivePitch(pitch)
      } else {
        addDraftPitch(pitch)
      }
      return
    }

    onSelectPitch?.(pitch)
  }

  const renderPitchTab = (pitch) => {
    const status = pitchStatuses[pitch] || {}
    const isSelected = selectedSet.has(pitch)
    const isActive = activePitch === pitch
    const isLive = !!status.hasLiveMatch
    const isComplete = !!status.isComplete
    const liveMinutes = getLiveMinutes(status)
    const lightStatus = isLive ? 'in-progress' : isComplete ? 'ready' : 'offline'
    const statusText = isLive ? 'In play' : isComplete ? 'All done' : 'No match'
    const minutesText = isLive && typeof liveMinutes === 'number' ? `${liveMinutes}m` : isComplete ? 'FT' : ''
    const canRemove = isEditing && isSelected && draftPitches.length > 1

    return (
      <div
        key={pitch}
        className={`pitch-tab ${isSelected ? 'managed' : 'unmanaged'} ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
      >
        <button
          type="button"
          className="pitch-tab-main"
          onClick={() => handlePitchClick(pitch, isSelected)}
          aria-pressed={isActive}
          aria-label={`${pitch}${isSelected ? ', coordinated by you' : ', add pitch to your coordination list'}`}
        >
          <span className="pitch-name">{pitch}</span>

          {isSelected ? (
            <span className="pitch-status-line">
              <span className="on-air-group">
                <OnAirLight status={lightStatus} />
                <span className={`on-air-text ${isLive ? 'live' : isComplete ? 'complete' : 'idle'}`}>
                  {statusText}
                </span>
              </span>
              {minutesText && (
                <span className={`live-minutes ${isComplete ? 'complete' : ''}`}>
                  {minutesText}
                </span>
              )}
            </span>
          ) : (
            <span className="pitch-add-indicator" aria-hidden="true">
              <i className="pi pi-plus" />
            </span>
          )}
        </button>

        {isEditing && isSelected && (
          <button
            type="button"
            className="pitch-remove-button"
            onClick={(event) => {
              event.stopPropagation()
              removeDraftPitch(pitch)
            }}
            disabled={!canRemove}
            aria-label={canRemove ? `Remove ${pitch}` : `Keep at least one pitch selected`}
          >
            <i className="pi pi-trash" aria-hidden="true" />
          </button>
        )}
      </div>
    )
  }

  const displayPitches = isEditing
    ? [
      ...draftPitches,
      ...availablePitches.filter((pitch) => !draftPitches.includes(pitch)),
    ]
    : visibleSelectedPitches

  return (
    <div className={`pitch-selector ${isEditing ? 'is-editing' : 'is-collapsed'}`}>
      <div className="pitch-selector-summary" aria-label={`Coordinating ${selectedCount} of ${totalCount} pitches`}>
        <span>Coordinating</span>
        <strong>{selectedCount} / {totalCount || '-'}</strong>
        <span>Pitches</span>
      </div>

      <div className="pitch-selector-tabs">
        {displayPitches.map(renderPitchTab)}
      </div>

      {isEditing ? (
        <div className="pitch-selector-actions" role="group" aria-label="Pitch selection actions">
          <button
            type="button"
            className="pitch-selector-action confirm"
            onClick={saveEditing}
            disabled={!draftPitches.length}
            aria-label="Save pitch selection"
          >
            <i className="pi pi-check" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="pitch-selector-action cancel"
            onClick={cancelEditing}
            aria-label="Cancel pitch selection changes"
          >
            <i className="pi pi-times" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="pitch-selector-edit"
          onClick={startEditing}
          aria-label="Edit coordinated pitches"
        >
          <i className="pi pi-pencil" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export default PitchSelector
