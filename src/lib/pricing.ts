export const FREE_SHIPPING_FROM = 80
export const SHIPPING = 8
export const PROMOS: Record<string, number> = { WELCOME10: 0.1 }

export interface Line { price: number; qty: number }

const round = (n: number) => Math.round(n * 100) / 100

export function totals(lines: Line[], promo?: string | null) {
  const subtotal = round(lines.reduce((t, l) => t + l.price * l.qty, 0))
  const rate = promo ? PROMOS[promo] ?? 0 : 0
  const discount = round(subtotal * rate)
  const afterDiscount = subtotal - discount
  const shipping = subtotal === 0 || afterDiscount >= FREE_SHIPPING_FROM ? 0 : SHIPPING
  return { subtotal, discount, shipping, total: round(afterDiscount + shipping), toFreeShipping: Math.max(0, round(FREE_SHIPPING_FROM - afterDiscount)) }
}

export function luhn(digits: string) {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i])
    if (i % 2) { d *= 2; if (d > 9) d -= 9 }
    sum += d
  }
  return digits.length > 0 && sum % 10 === 0
}

export interface CheckoutForm { name: string; email: string; address: string; city: string; zip: string; card: string; expiry: string; cvc: string }

export function validateCheckout(f: CheckoutForm, now = new Date()) {
  const e: Partial<Record<keyof CheckoutForm, string>> = {}
  if (f.name.trim().length < 2) e.name = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address.'
  if (f.address.trim().length < 5) e.address = 'Enter your street address.'
  if (!f.city.trim()) e.city = 'Enter your city.'
  if (!/^[A-Za-z0-9 -]{4,10}$/.test(f.zip.trim())) e.zip = 'Enter a valid postal code.'
  const card = f.card.replace(/\s/g, '')
  if (!/^\d{13,19}$/.test(card) || !luhn(card)) e.card = 'Card number is not valid.'
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(f.expiry.trim())
  if (!m || +m[1] < 1 || +m[1] > 12) e.expiry = 'Use the MM/YY format.'
  // card is valid through the last day of its expiry month
  else if (new Date(2000 + +m[2], +m[1], 1) <= now) e.expiry = 'This card has expired.'
  if (!/^\d{3,4}$/.test(f.cvc.trim())) e.cvc = 'Enter the 3 or 4 digit code.'
  return e
}

export const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ')
