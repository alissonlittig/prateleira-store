import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { byId } from './lib/catalog'
import { PROMOS, totals } from './lib/pricing'

export interface CartItem { productId: string; glaze: string; qty: number }
export interface Order { id: string; email: string; items: CartItem[]; total: number; placedAt: string }

export const MAX_QTY = 10
const same = (a: CartItem, productId: string, glaze: string) => a.productId === productId && a.glaze === glaze
const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.floor(n)))

interface CartState {
  items: CartItem[]
  promo: string | null
  lastOrder: Order | null
  add: (productId: string, glaze: string, qty?: number) => void
  setQty: (productId: string, glaze: string, qty: number) => void
  remove: (productId: string, glaze: string) => void
  applyPromo: (code: string) => boolean
  clearPromo: () => void
  placeOrder: (email: string) => Order
}

export const useCart = create<CartState>()(persist((set, get) => ({
  items: [],
  promo: null,
  lastOrder: null,
  add: (productId, glaze, qty = 1) => set(s => {
    const hit = s.items.find(i => same(i, productId, glaze))
    return hit
      ? { items: s.items.map(i => (i === hit ? { ...i, qty: clamp(i.qty + qty) } : i)) }
      : { items: [...s.items, { productId, glaze, qty: clamp(qty) }] }
  }),
  setQty: (productId, glaze, qty) => set(s => ({ items: s.items.map(i => (same(i, productId, glaze) ? { ...i, qty: clamp(qty) } : i)) })),
  remove: (productId, glaze) => set(s => ({ items: s.items.filter(i => !same(i, productId, glaze)) })),
  applyPromo: code => {
    const c = code.trim().toUpperCase()
    if (!(c in PROMOS)) return false
    set({ promo: c })
    return true
  },
  clearPromo: () => set({ promo: null }),
  placeOrder: email => {
    const { items, promo } = get()
    const order: Order = {
      id: `PR-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      email, items, total: totals(cartLines(items), promo).total, placedAt: new Date().toISOString(),
    }
    set({ items: [], promo: null, lastOrder: order })
    return order
  },
}), { name: 'prateleira:cart', storage: createJSONStorage(() => localStorage) }))

/** Cart items joined with catalog data; items whose product no longer exists are dropped. */
export function cartLines(items: CartItem[]) {
  return items.flatMap(i => {
    const p = byId(i.productId)
    return p ? [{ ...i, product: p, price: p.price }] : []
  })
}

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0)
