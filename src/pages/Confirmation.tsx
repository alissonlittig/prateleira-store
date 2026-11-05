import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/ui'
import { byId, money } from '../lib/catalog'
import { useCart } from '../store'

export function Confirmation() {
  const { id } = useParams()
  const order = useCart(s => s.lastOrder)

  if (!order || order.id !== id) {
    return (
      <div className="empty">
        <h1>Order not found</h1>
        <p className="muted">Orders in this demo are only kept in the browser that placed them.</p>
        <Link className="btn" to="/">Back to the shop</Link>
      </div>
    )
  }

  return (
    <div className="confirm panel">
      <span className="confirm-icon"><Icon name="check" size={28} /></span>
      <p className="eyebrow">Order {order.id}</p>
      <h1>Thank you, your order is in.</h1>
      <p className="lede">A confirmation would be sent to <strong>{order.email}</strong>. Pieces are packed by hand and ship within 3 business days.</p>
      <ul className="confirm-items">
        {order.items.map(i => (
          <li key={`${i.productId}-${i.glaze}`}><span>{i.qty} × {byId(i.productId)?.name} <span className="muted">({i.glaze})</span></span></li>
        ))}
      </ul>
      <p className="confirm-total">Total paid <strong>{money(order.total)}</strong></p>
      <Link className="btn primary" to="/">Continue shopping</Link>
    </div>
  )
}
