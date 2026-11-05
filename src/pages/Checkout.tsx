import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { formatCard, validateCheckout, type CheckoutForm } from '../lib/pricing'
import { useCart } from '../store'
import { Summary } from './Cart'

const empty: CheckoutForm = { name: '', email: '', address: '', city: '', zip: '', card: '', expiry: '', cvc: '' }

const FIELDS: { k: keyof CheckoutForm; label: string; auto: string; mode?: 'numeric' | 'email'; wide?: boolean; ph?: string }[] = [
  { k: 'name', label: 'Full name', auto: 'name', wide: true },
  { k: 'email', label: 'Email', auto: 'email', mode: 'email', wide: true },
  { k: 'address', label: 'Street address', auto: 'street-address', wide: true },
  { k: 'city', label: 'City', auto: 'address-level2' },
  { k: 'zip', label: 'Postal code', auto: 'postal-code' },
  { k: 'card', label: 'Card number', auto: 'cc-number', mode: 'numeric', wide: true, ph: '4242 4242 4242 4242' },
  { k: 'expiry', label: 'Expiry (MM/YY)', auto: 'cc-exp', mode: 'numeric', ph: '12/29' },
  { k: 'cvc', label: 'CVC', auto: 'cc-csc', mode: 'numeric', ph: '123' },
]

export function Checkout() {
  const { items, placeOrder } = useCart()
  const nav = useNavigate()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})
  const [busy, setBusy] = useState(false)

  if (!items.length && !busy) return <Navigate to="/cart" replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validateCheckout(form)
    setErrors(errs)
    const first = FIELDS.find(f => errs[f.k])
    if (first) { document.getElementById(`c-${first.k}`)?.focus(); return }
    setBusy(true)
    const order = placeOrder(form.email.trim())
    nav(`/order/${order.id}`, { replace: true })
  }

  return (
    <>
      <Link to="/cart" className="back">Back to cart</Link>
      <h1 className="page-title">Checkout</h1>
      <div className="checkout-grid">
        <form className="panel" onSubmit={submit} noValidate aria-describedby="demo-note">
          <p id="demo-note" className="demo-note">Demo store: no payment is processed. Use test card <strong>4242 4242 4242 4242</strong> with any future date.</p>
          <div className="form-grid">
            {FIELDS.map(f => (
              <div key={f.k} className={`field${f.wide ? ' wide' : ''}`}>
                <label htmlFor={`c-${f.k}`}>{f.label}</label>
                <input id={`c-${f.k}`} autoComplete={f.auto} inputMode={f.mode} placeholder={f.ph}
                  type={f.k === 'email' ? 'email' : 'text'} value={form[f.k]}
                  onChange={e => setForm(s => ({ ...s, [f.k]: f.k === 'card' ? formatCard(e.target.value) : e.target.value }))}
                  aria-invalid={Boolean(errors[f.k])} aria-describedby={errors[f.k] ? `ce-${f.k}` : undefined} />
                {errors[f.k] && <p id={`ce-${f.k}`} className="error">{errors[f.k]}</p>}
              </div>
            ))}
          </div>
          <button type="submit" className="btn primary block" disabled={busy}>Place order</button>
        </form>
        <Summary />
      </div>
    </>
  )
}
