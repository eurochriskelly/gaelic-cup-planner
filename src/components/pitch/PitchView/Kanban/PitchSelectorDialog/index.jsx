import { useState, useMemo, useEffect } from 'react'
import './PitchSelectorDialog.scss'
import OnAirLight from '../OnAirLight'
import OkIcon from '../../../../../shared/icons/icon-ok.svg?react'
import CancelIcon from '../../../../../shared/icons/icon-notplayed.svg?react'

const normalizePitch = (value) => {
  if (value === null || value === undefined) return null
  return `${value}`.trim() || null
}

const PitchSelectorDialog = ({
  isOpen,
  onClose,
  pitches,
  coordinatedPitches,
  activePitch,
  pitchStatuses,
  onCommit,
}) => {
  const [nowMs, setNowMs] = useState(Date.now())
  const [draftPitches, setDraftPitches] = useState([])

  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 30000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isOpen) {
      const normalized = Array.from(new Set(
        (coordinatedPitches || []).map(normalizePitch).filter(Boolean)
      ))
      setDraftPitches(normalized)
    }
  }, [isOpen, coordinatedPitches])

  const getLiveMinutes = (status) => {
    if (!status?.liveStartedAtMs) return null
    return Math.max(0, Math.floor((nowMs - status.liveStartedAtMs) / 60000))
  }

  const togglePitch = (pitch) => {
    setDraftPitches((current) => {
      if (current.includes(pitch)) {
        if (current.length <= 1) return current
        return current.filter((p) => p !== pitch)
      }
      return [...current, pitch]
    })
  }

  const handleCommit = () => {
    if (draftPitches.length === 0) return
    const nextActivePitch = draftPitches.includes(activePitch)
      ? activePitch
      : draftPitches[0]
    onCommit?.(draftPitches, nextActivePitch)
  }

  const availablePitches = useMemo(() => {
    return Array.from(new Set((pitches || []).map(normalizePitch).filter(Boolean)))
  }, [pitches])

  const watchedPitches = draftPitches.filter((p) => availablePitches.includes(p))
  const otherPitches = availablePitches.filter((p) => !draftPitches.includes(p))

  if (!isOpen) return null

  return (
    <>
      <div className="pitch-selector-dialog-backdrop" onClick={onClose} />
      <div className="pitch-selector-dialog">
        <div className="pitch-selector-dialog-header">
          <div className="pitch-selector-dialog-title">Schedule Execution</div>
          <div className="pitch-selector-dialog-subtitle">
            Coordinating {watchedPitches.length} / {availablePitches.length} Pitches
          </div>
        </div>

        <div className="pitch-selector-dialog-content">
          {watchedPitches.length > 0 && (
            <div className="pitch-group">
              <div className="pitch-group-label">Watched Pitches</div>
              <div className="pitch-grid">
                {watchedPitches.map((pitch) => {
                  const status = pitchStatuses[pitch] || {}
                  const isLive = !!status.hasLiveMatch
                  const isComplete = !!status.isComplete
                  const liveMinutes = getLiveMinutes(status)
                  const lightStatus = isLive ? 'in-progress' : isComplete ? 'ready' : 'offline'
                  const statusText = isLive ? 'In play' : isComplete ? 'All done' : 'No match'
                  const minutesText = isLive && typeof liveMinutes === 'number' ? `${liveMinutes}m` : isComplete ? 'FT' : ''

                  return (
                    <button
                      key={pitch}
                      type="button"
                      className="pitch-card watched"
                      onClick={() => togglePitch(pitch)}
                      aria-label={`${pitch}, ${statusText}. Tap to remove from watched pitches`}
                    >
                      <span className="pitch-card-name">{pitch}</span>
                      <span className="pitch-card-status">
                        <OnAirLight status={lightStatus} />
                        <span className={`status-text ${isLive ? 'live' : isComplete ? 'complete' : 'idle'}`}>
                          {statusText}
                        </span>
                        {minutesText && (
                          <span className="minutes-text">{minutesText}</span>
                        )}
                      </span>
                      <span className="pitch-card-action remove" aria-hidden="true">−</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {otherPitches.length > 0 && (
            <div className="pitch-group">
              <div className="pitch-group-label">Other Pitches</div>
              <div className="pitch-grid">
                {otherPitches.map((pitch) => (
                  <button
                    key={pitch}
                    type="button"
                    className="pitch-card unwatched"
                    onClick={() => togglePitch(pitch)}
                    aria-label={`${pitch}. Tap to add to watched pitches`}
                  >
                    <span className="pitch-card-name">{pitch}</span>
                    <span className="pitch-card-action add" aria-hidden="true">+</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pitch-selector-dialog-actions">
          <button
            type="button"
            className="dialog-action cancel"
            onClick={onClose}
            aria-label="Cancel pitch selection changes"
          >
            <CancelIcon aria-hidden="true" />
            <span>Not Played</span>
          </button>
          <button
            type="button"
            className="dialog-action confirm"
            onClick={handleCommit}
            disabled={draftPitches.length === 0}
            aria-label="Save pitch selection"
          >
            <OkIcon aria-hidden="true" />
            <span>OK</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default PitchSelectorDialog
