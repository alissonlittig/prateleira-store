import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ProductArt } from '../components/ProductArt'
import { Icon, Qty } from '../components/ui'
import { money } from '../lib/catalog'
import { FREE_SHIPPING_FROM, totals } from '../lib/pricing'
import { cartLines, useCart } from '../store'

export function Summary({ children }: { children?: React.ReactNode }) {
  const { items, promo } = useCart()
  const t = totals(cartLines(items), promo)
  return (
    <aside className="summary" aria-labelledby="summary-title">
      <h2 id="summary-title">Order summary</h2>
      <dl>
        <div><dt>Subtotal</dt><dd>{money(t.subtotal)}</dd></div>
        {t.discount > 0 && <div className="discount"><dt>Discount ({promo})</dt><dd>−{money(t.discount)}</dd></div>}
        <div><dt>Shipping</dt><dd>{t.shipping ? money(t.shipping) : 'Free'}</dd></div>
        <div className="total"><dt>Total</dt><dd>{money(t.total)}</dd></div>
      </dl>
      {t.toFreeShipping > 0 && t.subtotal > 0 && (
        <div className="ship-progress">
          <p>Add {money(t.toFreeShipping)} more for free shipping.</p>
          <progress max={FREE_SHIPPING_FROM} value={FREE_SHIPPING_FROM - t.toFreeShipping} aria-label="Progress to free shipping" />
        </div>
      )}
      {children}
    </aside>
  )
}

export function Cart() {
  const { items, promo, setQty, remove, applyPromo, clearPromo } = useCart()
  const lines = cartLines(items)
  const [code, setCode] = useState('')
  const [codeMsg, setCodeMsg] = useState('')

  const submitCode = (e: FormEvent) => {
    e.preventDefault()
    setCodeMsg(applyPromo(code) ? '' : 'That code is not valid.')
    setCode('')
  }

  if (!lines.length) {
    return (
      <div className="empty">
        <Icon name="bag" size={40} />
        <h1>Your cart is empty</h1>
        <p className="muted">Find something you will use every day.</p>
        <Link className="btn primary" to="/">Browse the shop</Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="page-title">Your cart</h1>
      <div className="checkout-grid">
        <ul className="lines">
          {lines.map(l => {
            const g = l.product.glazes.find(x => x.name === l.glaze) ?? l.product.glazes[0]
            return (
              <li key={`${l.productId}-${l.glaze}`} className="line">
                <div className="art thumb" style={{ '--tint': g.color } as React.CSSProperties}><ProductArt shape={l.product.shape} color={g.color} /></div>
                <div className="line-info">
                  <Link to={`/product/${l.product.slug}`} className="line-name">{l.product.name}</Link>
                  <span className="muted">{l.glaze} · {money(l.price)}</span>
                  <div className="line-actions">
                    <Qty value={l.qty} onChange={n => setQty(l.productId, l.glaze, n)} label={`Quantity of ${l.product.name}`} />
                    <button type="button" className="text-btn" onClick={() => remove(l.productId, l.glaze)}
                      aria-label={`Remove ${l.product.name} (${l.glaze})`}>Remove</button>
                  </div>
                </div>
                <strong className="line-total">{money(l.price * l.qty)}</strong>
              </li>
            )
          })}
        </ul>
        <Summary>
          {promo ? (
            <p className="promo-on"><Icon name="check" size={16} /> Code <strong>{promo}</strong> applied
              <button type="button" className="text-btn" onClick={clearPromo}>Remove</button></p>
          ) : (
            <form className="promo" onSubmit={submitCode}>
              <label htmlFor="promo">Promo code</label>
              <div>
                <input id="promo" value={code} onChange={e => setCode(e.target.value)} placeholder="Try WELCOME10"
                  aria-invalid={Boolean(codeMsg)} aria-describedby={codeMsg ? 'promo-err' : undefined} />
                <button type="submit" className="btn">Apply</button>
              </div>
              {codeMsg && <p id="promo-err" className="error">{codeMsg}</p>}
            </form>
          )}
          <Link to="/checkout" className="btn primary block">Go to checkout</Link>
        </Summary>
      </div>
    </>
  )
}
