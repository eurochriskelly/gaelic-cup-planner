import { useState, useMemo } from 'react'
import './PitchSelector.scss'
import OnAirLight from './OnAirLight'
import PitchSelectorDialog from './PitchSelectorDialog'

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
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
  const activePitch = selectedPitchId || visibleSelectedPitches[0] || null
  const selectedSet = new Set(visibleSelectedPitches)
  const selectedCount = selectedSet.size
  const totalCount = availablePitches.length

  const getLiveMinutes = (status) => {
    if (!status?.liveStartedAtMs) return null
    return Math.max(0, Math.floor((Date.now() - status.liveStartedAtMs) / 60000))
  }

  const handlePitchClick = (pitch) => {
    onSelectPitch?.(pitch)
  }

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleCommit = (draftPitches, nextActivePitch) => {
    onSelectionCommit?.(draftPitches, nextActivePitch)
    setIsDialogOpen(false)
  }

  const renderPitchTab = (pitch) => {
    const status = pitchStatuses[pitch] || {}
    const isActive = activePitch === pitch
    const isLive = !!status.hasLiveMatch
    const isComplete = !!status.isComplete
    const liveMinutes = getLiveMinutes(status)
    const lightStatus = isLive ? 'in-progress' : isComplete ? 'ready' : 'offline'
    const statusText = isLive ? 'In play' : isComplete ? 'All done' : 'No match'
    const minutesText = isLive && typeof liveMinutes === 'number' ? `${liveMinutes}m` : isComplete ? 'FT' : ''

    return (
      <div
        key={pitch}
        className={`pitch-tab managed ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
      >
        <button
          type="button"
          className="pitch-tab-main"
          onClick={() => handlePitchClick(pitch)}
          aria-pressed={isActive}
          aria-label={`${pitch}, coordinated by you`}
        >
          <span className="pitch-name">{pitch}</span>
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
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="pitch-selector is-collapsed">
        <div className="pitch-selector-summary" aria-label={`Coordinating ${selectedCount} of ${totalCount} pitches`}>
          <span>Coordinating</span>
          <strong>{selectedCount} / {totalCount || '-'}</strong>
          <span>Pitches</span>
        </div>

        <div className="pitch-selector-tabs">
          {visibleSelectedPitches.map(renderPitchTab)}
        </div>

        <button
          type="button"
          className="pitch-selector-edit"
          onClick={handleOpenDialog}
          aria-label="Edit coordinated pitches"
        >
          <i className="pi pi-pencil" aria-hidden="true" />
        </button>
      </div>

      <PitchSelectorDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        pitches={availablePitches}
        coordinatedPitches={visibleSelectedPitches}
        activePitch={activePitch}
        pitchStatuses={pitchStatuses}
        onCommit={handleCommit}
      />
    </>
  )
}

export default PitchSelector
