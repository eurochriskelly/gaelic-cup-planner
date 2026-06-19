export const normalizeStatusCategory = (value) => {
  if (value === null || value === undefined) return null
  const text = `${value}`.trim()
  return text || null
}

export const getFixtureStatusCategory = (fixture) => {
  if (!fixture) return null

  return normalizeStatusCategory(
    fixture?.competition?.key ||
      fixture?.competition?.category ||
      fixture?.competition?.name ||
      fixture?.competition?.label ||
      fixture?.category
  )
}

export const getLastStatusCategory = (filterSelections = {}) => (
  normalizeStatusCategory(filterSelections?.status?.lastCategory)
)

export const getScheduleStatusCategory = (filterSelections = {}) => (
  normalizeStatusCategory(filterSelections?.status?.scheduleCategory)
)

export const choosePreferredStatusCategory = ({
  filterSelections = {},
  fromSchedule = false,
} = {}) => {
  const scheduleCategory = getScheduleStatusCategory(filterSelections)
  const lastCategory = getLastStatusCategory(filterSelections)

  return fromSchedule
    ? scheduleCategory || lastCategory
    : lastCategory
}
