import { Link, Route, Routes, useLocation, useSearchParams } from 'react-router-dom'
import { Icon, ThemeToggle } from './components/ui'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { Confirmation } from './pages/Confirmation'
import { ProductPage } from './pages/ProductPage'
import { Shop } from './pages/Shop'
import { CATEGORIES } from './lib/catalog'
import { cartCount, useCart } from './store'

export function App() {
  const count = useCart(s => cartCount(s.items))
  const { pathname } = useLocation()
  const [params] = useSearchParams()
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="top">
        <Link to="/" className="brand">Prateleira<span aria-hidden="true">.</span></Link>
        <nav aria-label="Main">
          {['', ...CATEGORIES].map(c => {
            const current = pathname === '/' && (params.get('c') ?? '') === c
            return <Link key={c || 'all'} to={c ? `/?c=${c}` : '/'} aria-current={current ? 'page' : undefined}>{c || 'Shop all'}</Link>
          })}
        </nav>
        <div className="tools">
          <ThemeToggle />
          <Link to="/cart" className="cart-btn" aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`}>
            <Icon name="bag" size={20} />
            {count > 0 && <span className="badge" aria-hidden="true">{count}</span>}
          </Link>
        </div>
      </header>
      <main id="main">
        <Routes>
          <Route path="/" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Confirmation />} />
          <Route path="*" element={<div className="empty"><h1>Page not found</h1><Link className="btn" to="/">Back to the shop</Link></div>} />
        </Routes>
      </main>
      <footer className="foot">
        <p><strong>Prateleira</strong> is a fictitious ceramics studio. This is a demo store: products are illustrations and no payment is processed.</p>
      </footer>
    </>
  )
}
