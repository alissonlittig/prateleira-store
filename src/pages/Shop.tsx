import { Link, useSearchParams } from 'react-router-dom'
import { ProductArt } from '../components/ProductArt'
import { Icon, Rating } from '../components/ui'
import { CATEGORIES, PRODUCTS, money, queryProducts, type Sort } from '../lib/catalog'
import { FREE_SHIPPING_FROM } from '../lib/pricing'

const SORTS: [Sort, string][] = [['featured', 'Featured'], ['price-asc', 'Price: low to high'], ['price-desc', 'Price: high to low'], ['rating', 'Top rated']]

export function Shop() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const category = params.get('c') ?? ''
  const sort = (params.get('sort') as Sort) || 'featured'
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v); else next.delete(k)
    setParams(next, { replace: true })
  }
  const list = queryProducts(PRODUCTS, { q, category, sort })

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Small-batch stoneware</p>
          <h1>Tableware made slowly, for everyday use.</h1>
          <p className="lede">Mugs, bowls, plates and vases thrown by hand in a two-person studio. Every glaze is mixed in house, so no two pieces are quite the same.</p>
        </div>
        <ul className="perks">
          <li><Icon name="truck" /> Free shipping over ${FREE_SHIPPING_FROM}</li>
          <li><Icon name="check" /> Dishwasher-safe glazes</li>
          <li><Icon name="check" /> 30-day returns</li>
        </ul>
      </section>

      <div className="toolbar" role="search">
        <div className="chips" role="group" aria-label="Category">
          {['', ...CATEGORIES].map(c => (
            <button key={c || 'all'} type="button" className="chip" aria-pressed={category === c} onClick={() => set('c', c)}>
              {c || 'All'}
            </button>
          ))}
        </div>
        <label className="search">
          <span className="sr-only">Search products</span>
          <Icon name="search" />
          <input type="search" placeholder="Search" value={q} onChange={e => set('q', e.target.value)} />
        </label>
        <label className="sort">
          <span>Sort</span>
          <select value={sort} onChange={e => set('sort', e.target.value === 'featured' ? '' : e.target.value)}>
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
      </div>
      <p className="result-count" aria-live="polite">{list.length} {list.length === 1 ? 'product' : 'products'}</p>

      {list.length ? (
        <ul className="grid">
          {list.map(p => (
            <li key={p.id}>
              <Link to={`/product/${p.slug}`} className="product-card">
                <div className="art" style={{ '--tint': p.glazes[0].color } as React.CSSProperties}>
                  <ProductArt shape={p.shape} color={p.glazes[0].color} />
                  {p.isNew && <span className="tag">New</span>}
                </div>
                <div className="product-meta">
                  <h2>{p.name}</h2>
                  <span className="price">{money(p.price)}</span>
                </div>
                <div className="product-sub">
                  <span className="swatches" aria-label={`${p.glazes.length} glazes`}>
                    {p.glazes.map(g => <i key={g.name} style={{ background: g.color }} />)}
                  </span>
                  <Rating value={p.rating} count={p.reviews} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <p>Nothing matches “{q}”.</p>
          <button type="button" className="btn" onClick={() => setParams({}, { replace: true })}>Show all products</button>
        </div>
      )}
    </>
  )
}
