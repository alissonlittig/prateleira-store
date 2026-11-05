import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductArt } from '../components/ProductArt'
import { Icon, Qty, Rating } from '../components/ui'
import { bySlug, money, PRODUCTS } from '../lib/catalog'
import { FREE_SHIPPING_FROM } from '../lib/pricing'
import { useCart } from '../store'

export function ProductPage() {
  const { slug = '' } = useParams()
  const product = bySlug(slug)
  // key by slug so glaze/qty reset when navigating between products
  return product ? <Detail key={slug} slug={slug} /> : (
    <div className="empty">
      <h1>Product not found</h1>
      <Link className="btn" to="/">Back to the shop</Link>
    </div>
  )
}

function Detail({ slug }: { slug: string }) {
  const p = bySlug(slug)!
  const add = useCart(s => s.add)
  const [glaze, setGlaze] = useState(p.glazes[0].name)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState('')
  const color = p.glazes.find(g => g.name === glaze)!.color
  const related = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 3)

  return (
    <>
      <Link to="/" className="back"><Icon name="back" size={16} /> All products</Link>
      <div className="pdp">
        <div className="art big" style={{ '--tint': color } as React.CSSProperties}>
          <ProductArt shape={p.shape} color={color} />
        </div>
        <div className="pdp-info">
          <p className="eyebrow">{p.category}</p>
          <h1>{p.name}</h1>
          <div className="pdp-price"><span className="price">{money(p.price)}</span><Rating value={p.rating} count={p.reviews} /></div>
          <p className="lede">{p.blurb}</p>

          <fieldset className="glazes">
            <legend>Glaze: <strong>{glaze}</strong></legend>
            {p.glazes.map(g => (
              <label key={g.name} className="glaze">
                <input type="radio" name="glaze" value={g.name} checked={glaze === g.name} onChange={() => setGlaze(g.name)} />
                <span style={{ background: g.color }} aria-hidden="true" />
                <span className="sr-only">{g.name}</span>
              </label>
            ))}
          </fieldset>

          <div className="buy">
            <Qty value={qty} onChange={n => setQty(Math.max(1, Math.min(10, n)))} label="Quantity" />
            <button type="button" className="btn primary grow" onClick={() => {
              add(p.id, glaze, qty)
              setAdded(`${qty} × ${p.name} (${glaze}) added to your cart.`)
            }}>Add to cart · {money(p.price * qty)}</button>
          </div>
          <p className="added" role="status">
            {added && <><Icon name="check" size={16} /> {added} <Link to="/cart">View cart</Link></>}
          </p>

          <ul className="details">
            {p.details.map(d => <li key={d}>{d}</li>)}
            <li>Free shipping on orders over ${FREE_SHIPPING_FROM}</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="related" aria-labelledby="related">
          <h2 id="related">More {p.category.toLowerCase()}</h2>
          <ul className="grid small">
            {related.map(r => (
              <li key={r.id}>
                <Link to={`/product/${r.slug}`} className="product-card">
                  <div className="art" style={{ '--tint': r.glazes[0].color } as React.CSSProperties}><ProductArt shape={r.shape} color={r.glazes[0].color} /></div>
                  <div className="product-meta"><h3>{r.name}</h3><span className="price">{money(r.price)}</span></div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
