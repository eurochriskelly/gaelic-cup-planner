const TEAM_PALETTE = [
  { bg: '#4b5563', text: '#ffffff' },
  { bg: '#0284c7', text: '#ffffff' },
  { bg: '#7c3aed', text: '#ffffff' },
  { bg: '#f59e0b', text: '#111827' },
  { bg: '#059669', text: '#ffffff' },
  { bg: '#dc2626', text: '#ffffff' },
  { bg: '#0f766e', text: '#ffffff' },
  { bg: '#ca8a04', text: '#111827' },
]

export const getTeamAbbr = (teamName = '') => {
  const words = String(teamName)
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!words.length) return 'TBD'
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase()

  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export const getTeamColors = (teamName = '') => {
  const hash = String(teamName)
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0)

  return TEAM_PALETTE[hash % TEAM_PALETTE.length]
}
