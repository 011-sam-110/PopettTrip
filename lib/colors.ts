const PALETTE: Array<{ bg: string; text: string }> = [
  { bg: '#4a6741', text: '#ffffff' }, // moss
  { bg: '#c9a84c', text: '#2c2c2c' }, // gold
  { bg: '#7b6d8d', text: '#ffffff' }, // dusty violet
  { bg: '#c47845', text: '#ffffff' }, // terracotta
  { bg: '#4a7a8a', text: '#ffffff' }, // slate teal
  { bg: '#8a4a5a', text: '#ffffff' }, // rose stone
  { bg: '#5a8a5a', text: '#ffffff' }, // sage
  { bg: '#7a6a3a', text: '#ffffff' }, // warm amber
]

export function getMemberColor(
  name: string,
  allNames: string[]
): { bg: string; text: string } {
  const sorted = [...allNames].sort()
  const idx = sorted.indexOf(name)
  return PALETTE[idx % PALETTE.length]
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0].toUpperCase())
    .join('')
    .slice(0, 2)
}
