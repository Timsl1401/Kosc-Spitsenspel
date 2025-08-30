// Pure TypeScript game logic. Minimal settings read via db helpers when needed.
import { fetchSettingValue } from './db'

const TEAM_POINTS: Record<string, number> = {
  'KOSC 1': 3,
  'KOSC 2': 2,
  'KOSC 3': 1,
  'KOSC 4': 1,
  'KOSC 5': 1,
  'KOSC 6': 1,
  'KOSC 7': 1,
  'KOSC zaterdag 2': 1,
  'KOSC zaterdag 3': 1,
  'KOSC A1': 1,
}

export function getTeamPoints(teamName: string): number {
  if (!teamName) return 1
  // Exacte mapping eerst; zo niet, fallback naar case-insensitive normalisatie
  if (Object.prototype.hasOwnProperty.call(TEAM_POINTS, teamName)) {
    return TEAM_POINTS[teamName]
  }
  const normalized = teamName.trim().toLowerCase()
  const found = Object.entries(TEAM_POINTS).find(([key]) => key.toLowerCase() === normalized)
  return found ? found[1] : 1
}

export async function isTransferAllowed(): Promise<boolean> {
  // If admin enabled weekend transfers in settings, always allow
  try {
    const weekendFlag = await fetchSettingValue('weekend_transfers_allowed')
    if (weekendFlag === 'true') return true
  } catch (_err) {
    // fall through to default rule
  }
  // Default rule: No weekend transfers (only Mon-Fri allowed)
  const day = new Date().getDay() // 0=Sun, 6=Sat
  return day !== 0 && day !== 6
}


