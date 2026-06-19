import { useMemo } from 'react'
import './PitchSelector.scss'

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
  coordinatedPitches = [],
}) => {
  const availablePitches = useMemo(() => uniquePitches(pitches), [pitches])
  const coordinatedPitchIds = useMemo(() => uniquePitches(coordinatedPitches), [coordinatedPitches])
  const coordinatedPitchSet = useMemo(() => new Set(coordinatedPitchIds), [coordinatedPitchIds])
  const hasManagedPitchSelection = coordinatedPitchIds.length > 0
  const selectedPitchId = normalizePitch(selectedPitch)
  const activePitch = selectedPitchId && availablePitches.includes(selectedPitchId)
    ? selectedPitchId
    : availablePitches[0] || null
  const activeIndex = activePitch ? availablePitches.indexOf(activePitch) : -1
  const pitchCount = availablePitches.length
  const hasCarouselNavigation = pitchCount > 2
  const previousIndex = activeIndex > 0 ? activeIndex - 1 : -1
  const nextIndex = activeIndex >= 0 && activeIndex < pitchCount - 1 ? activeIndex + 1 : -1
  const previousPitch = previousIndex >= 0 ? availablePitches[previousIndex] : null
  const nextPitch = nextIndex >= 0 ? availablePitches[nextIndex] : null
  const layoutClass =
    pitchCount <= 1
      ? 'is-single'
      : pitchCount === 2
        ? 'is-pair'
        : 'is-carousel'
  const isPitchReadOnly = (pitch) => (
    Boolean(pitch) && hasManagedPitchSelection && !coordinatedPitchSet.has(pitch)
  )
  const activeIsReadOnly = isPitchReadOnly(activePitch)

  const getPitchClassName = (baseClass, pitch, isActive = false) => (
    [
      baseClass,
      isActive ? 'is-active' : '',
      isPitchReadOnly(pitch) ? 'is-read-only' : 'is-coordinated',
    ].filter(Boolean).join(' ')
  )

  const getPitchAriaLabel = (pitch) => {
    const mode = isPitchReadOnly(pitch) ? 'read only' : 'coordinated'
    return `Show pitch ${pitch}, ${mode}`
  }

  const handleSelectPitch = (pitch) => {
    if (!pitch || pitch === activePitch) return
    onSelectPitch?.(pitch)
  }

  return (
    <nav
      className={`pitch-selector ${layoutClass} ${activeIsReadOnly ? 'is-read-only' : 'is-coordinated'}`}
      aria-label="Pitch selector"
    >
      {hasCarouselNavigation ? (
        <button
          type="button"
          className="pitch-selector__arrow pitch-selector__arrow--previous"
          onClick={() => handleSelectPitch(previousPitch)}
          disabled={!previousPitch}
          aria-label={previousPitch ? `Show pitch ${previousPitch}` : 'Previous pitch'}
        >
          <i className="pi pi-angle-left" aria-hidden="true" />
          <i className="pi pi-angle-left" aria-hidden="true" />
        </button>
      ) : null}

      <div className="pitch-selector__rail">
        {pitchCount <= 1 ? (
          <div
            className={getPitchClassName('pitch-selector__active', activePitch, true)}
            aria-current="true"
            aria-label={activePitch ? `${activePitch}, ${activeIsReadOnly ? 'read only' : 'coordinated'}` : 'Pitch'}
          >
            <span className="pitch-selector__label">{activePitch || 'Pitch'}</span>
            {activeIsReadOnly && (
              <span className="pitch-selector__mode">Read only</span>
            )}
          </div>
        ) : pitchCount === 2 ? (
          availablePitches.map((pitch) => (
            <button
              key={pitch}
              type="button"
              className={getPitchClassName('pitch-selector__choice', pitch, pitch === activePitch)}
              onClick={() => handleSelectPitch(pitch)}
              aria-label={getPitchAriaLabel(pitch)}
              aria-current={pitch === activePitch ? 'true' : undefined}
            >
              <span className="pitch-selector__label">{pitch}</span>
              {pitch === activePitch && isPitchReadOnly(pitch) && (
                <span className="pitch-selector__mode">Read only</span>
              )}
            </button>
          ))
        ) : (
          <>
            <button
              type="button"
              className={getPitchClassName('pitch-selector__preview pitch-selector__preview--previous', previousPitch)}
              onClick={() => handleSelectPitch(previousPitch)}
              disabled={!previousPitch}
              aria-label={previousPitch ? getPitchAriaLabel(previousPitch) : 'Previous pitch'}
            >
              {previousPitch ? <span className="pitch-selector__label">{previousPitch}</span> : null}
            </button>

            <div
              className={getPitchClassName('pitch-selector__active', activePitch, true)}
              aria-current="true"
              aria-label={activePitch ? `${activePitch}, ${activeIsReadOnly ? 'read only' : 'coordinated'}` : 'Pitch'}
            >
              <span className="pitch-selector__label">{activePitch || 'Pitch'}</span>
              {activeIsReadOnly && (
                <span className="pitch-selector__mode">Read only</span>
              )}
              <div className="pitch-selector__dots" aria-label="Pitch pages">
                {availablePitches.map((pitch) => (
                  <button
                    key={pitch}
                    type="button"
                    className={getPitchClassName('pitch-selector__dot', pitch, pitch === activePitch)}
                    onClick={() => handleSelectPitch(pitch)}
                    aria-label={getPitchAriaLabel(pitch)}
                    aria-current={pitch === activePitch ? 'true' : undefined}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              className={getPitchClassName('pitch-selector__preview pitch-selector__preview--next', nextPitch)}
              onClick={() => handleSelectPitch(nextPitch)}
              disabled={!nextPitch}
              aria-label={nextPitch ? getPitchAriaLabel(nextPitch) : 'Next pitch'}
            >
              {nextPitch ? <span className="pitch-selector__label">{nextPitch}</span> : null}
            </button>
          </>
        )}
      </div>

      {hasCarouselNavigation ? (
        <button
          type="button"
          className="pitch-selector__arrow pitch-selector__arrow--next"
          onClick={() => handleSelectPitch(nextPitch)}
          disabled={!nextPitch}
          aria-label={nextPitch ? `Show pitch ${nextPitch}` : 'Next pitch'}
        >
          <i className="pi pi-angle-right" aria-hidden="true" />
          <i className="pi pi-angle-right" aria-hidden="true" />
        </button>
      ) : null}
    </nav>
  )
}

export default PitchSelector
