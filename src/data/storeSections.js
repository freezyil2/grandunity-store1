export const STORE_SECTIONS = [
  { id: 'all', label: 'PACKAGES', query: 'all', keywords: [] },
  { id: 'subscription', label: 'PR SUBSCRIPTION', query: 'subscription', keywords: ['subscription', 'sub', 'vip', 'pr'] },
  { id: 'money', label: 'MONEY PACKS', query: 'money', keywords: ['money', 'cash', 'coins', 'bank'] },
  { id: 'voucher', label: 'PR VOUCHER', query: 'voucher', keywords: ['voucher', 'gift', 'code'] },
  { id: 'peds', label: 'PEDS', query: 'peds', keywords: ['ped', 'skin', 'character'] },
  { id: 'queue', label: 'QUEUE PACKS', query: 'queue', keywords: ['queue', 'priority'] },
  { id: 'gangs', label: 'GANGS', query: 'gangs', keywords: ['gang', 'crew', 'org'] },
  { id: 'unban', label: 'UNBAN', query: 'unban', keywords: ['unban', 'ban', 'appeal'] },
]

export function matchSection(pkgName, sectionQuery) {
  if (!sectionQuery || sectionQuery === 'all') return true
  const section = STORE_SECTIONS.find((item) => item.query === sectionQuery)
  if (!section) return true
  const value = String(pkgName || '').toLowerCase()
  return section.keywords.some((keyword) => value.includes(keyword))
}

