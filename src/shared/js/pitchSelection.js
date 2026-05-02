export const normalizePitchId = (value) => {
  if (value === null || value === undefined) return null
  return `${value}`.trim() || null
}

export const getCoordinatedPitches = (filterSelections = {}) => {
  const primary = normalizePitchId(filterSelections.pitches?.primary)
  const additional = Array.isArray(filterSelections.pitches?.additional)
    ? filterSelections.pitches.additional.map(normalizePitchId)
    : []
  const legacy = Array.isArray(filterSelections.Pitches)
    ? filterSelections.Pitches.map(normalizePitchId)
    : []

  return Array.from(new Set([primary, ...additional, ...legacy].filter(Boolean)))
}

export const getActivePitch = (filterSelections = {}) => (
  normalizePitchId(filterSelections.pitches?.active)
  || normalizePitchId(filterSelections.activePitch)
)

export const choosePreferredPitch = ({
  filterSelections = {},
  availablePitches = [],
  coordinatedPitches = getCoordinatedPitches(filterSelections),
} = {}) => {
  const availableSet = new Set(availablePitches.map(normalizePitchId).filter(Boolean))
  const coordinated = coordinatedPitches.map(normalizePitchId).filter(Boolean)
  const activePitch = getActivePitch(filterSelections)
  const candidates = [
    activePitch && coordinated.includes(activePitch) ? activePitch : null,
    ...coordinated,
    activePitch,
    ...availablePitches.map(normalizePitchId),
  ].filter(Boolean)

  return candidates.find((pitch) => !availableSet.size || availableSet.has(pitch)) || null
}
