// Pure TypeScript game logic (no DB). Keep DB dumb.

export function getTeamPoints(teamName: string): number {
  if (!teamName) return 1.0
  const name = teamName.toLowerCase()
  if (name.includes('kosc 1')) return 3.0
  if (name.includes('kosc 2')) return 2.5
  if (name.includes('kosc 3')) return 2.0
  return 1.0
}

export function isTransferAllowed(): boolean {
  // No weekend transfers: only Mon-Fri allowed
  const day = new Date().getDay() // 0=Sun, 6=Sat
  return day !== 0 && day !== 6
}


