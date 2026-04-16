// Tebex Headless API client (frontend-only, public token)
// Docs: https://docs.tebex.io/developers/headless-api

const BASE = 'https://headless.tebex.io/api'
const TOKEN = import.meta.env.VITE_TEBEX_PUBLIC_TOKEN

if (!TOKEN) {
  // eslint-disable-next-line no-console
  console.warn('[Tebex] VITE_TEBEX_PUBLIC_TOKEN is missing in .env')
}

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...opts,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Tebex ${res.status}: ${text || res.statusText}`)
  }
  return res.json()
}

export async function getCategories({ includePackages = true } = {}) {
  const qs = includePackages ? '?includePackages=1' : ''
  const data = await request(`/accounts/${TOKEN}/categories${qs}`)
  return data?.data ?? []
}

export async function getAllPackages() {
  const data = await request(`/accounts/${TOKEN}/packages`)
  return data?.data ?? []
}

export async function getPackage(id) {
  const data = await request(`/accounts/${TOKEN}/packages/${id}`)
  return data?.data ?? null
}

export async function getWebstore() {
  const data = await request(`/accounts/${TOKEN}`)
  return data?.data ?? null
}

// Create a basket and add a single package, return checkout URL.
// For frontend-only flow we use Tebex's hosted checkout via basket.links.checkout.
export async function buyPackage(packageId) {
  const origin = window.location.origin
  const basketRes = await request(`/accounts/${TOKEN}/baskets`, {
    method: 'POST',
    body: JSON.stringify({
      complete_url: `${origin}/?status=success`,
      cancel_url: `${origin}/?status=cancel`,
      complete_auto_redirect: true,
    }),
  })
  const basket = basketRes?.data
  if (!basket?.ident) throw new Error('Failed to create Tebex basket')

  // Some Tebex stores require auth_url completion before adding packages.
  // For username-based stores we redirect to auth first.
  const authUrl = basket.links?.checkout
  // Add package to basket
  await request(`/accounts/${TOKEN}/baskets/${basket.ident}/packages`, {
    method: 'POST',
    body: JSON.stringify({ package_id: Number(packageId), quantity: 1 }),
  }).catch((err) => {
    // If add fails (commonly because basket needs username/auth), fall through to checkout link.
    // eslint-disable-next-line no-console
    console.warn('[Tebex] could not add package directly, redirecting to checkout:', err.message)
  })

  return basket.links?.checkout || authUrl
}
