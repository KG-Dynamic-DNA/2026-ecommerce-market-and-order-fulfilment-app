const apiUrl = (import.meta.env.VITE_API_URL ?? 'https://mzansi-market-api.onrender.com').replace(/\/$/, '')

export type StaffUser = { userId: string; email: string; displayName: string; accountStatus: string; roles: string[] }
export type FulfilmentOrder = { sellerOrderId: string; orderNumber: string; status: string; paidAt: string; recipientName: string; city: string; province: string; items: Array<{ productName: string; quantity: number }>; shipment: { carrier: string | null; trackingNumber: string | null } | null }
type TokenResponse = { accessToken: string }

export class ApiError extends Error { constructor(public readonly status: number, message: string) { super(message) } }
let token: string | null = null

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const response = await fetch(`${apiUrl}${path}`, { ...init, headers, cache: 'no-store', signal: init.signal ?? AbortSignal.timeout(30_000) })
  if (!response.ok) { let message = 'The request could not be completed.'; try { const body = await response.json() as { detail?: string; title?: string; errors?: Record<string, string[]> }; message = body.detail ?? Object.values(body.errors ?? {}).flat()[0] ?? body.title ?? message } catch {} throw new ApiError(response.status, message) }
  return response.status === 204 ? undefined as T : await response.json() as T
}

export const staffApi = {
  async signIn(email: string, password: string) { const result = await request<TokenResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); token = result.accessToken; return request<StaffUser>('/api/auth/me') },
  signOut: async () => { try { await request<void>('/api/auth/logout', { method: 'POST' }) } finally { token = null } },
  fulfilment: () => request<FulfilmentOrder[]>('/api/fulfilment/orders'),
  transition: (sellerOrderId: string, action: string, carrier?: string, trackingNumber?: string) => request<FulfilmentOrder>(`/api/fulfilment/orders/${sellerOrderId}/transition`, { method: 'POST', body: JSON.stringify({ action, carrier, trackingNumber }) }),
}
