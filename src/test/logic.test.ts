import { PRODUCTS, queryProducts } from '../lib/catalog'
import { formatCard, luhn, totals, validateCheckout, type CheckoutForm } from '../lib/pricing'
import { cartCount, cartLines, useCart } from '../store'

const ok: CheckoutForm = { name: 'Rita Lopes', email: 'rita@example.com', address: '12 Harbour Street', city: 'Porto', zip: '4000-123', card: '4242 4242 4242 4242', expiry: '12/29', cvc: '123' }

describe('catalog', () => {
  it('filters by category and search term', () => {
    expect(queryProducts(PRODUCTS, { category: 'Vases' }).every(p => p.category === 'Vases')).toBe(true)
    expect(queryProducts(PRODUCTS, { q: 'ramen' }).map(p => p.slug)).toEqual(['ramen-bowl'])
  })
  it('sorts by price both ways without mutating the catalog', () => {
    const asc = queryProducts(PRODUCTS, { sort: 'price-asc' }).map(p => p.price)
    expect(asc).toEqual([...asc].sort((a, b) => a - b))
    expect(queryProducts(PRODUCTS, { sort: 'price-desc' })[0].price).toBe(Math.max(...PRODUCTS.map(p => p.price)))
    expect(PRODUCTS[0].slug).toBe('morning-mug')
  })
})

describe('pricing', () => {
  it('charges shipping under the free threshold', () => {
    expect(totals([{ price: 28, qty: 2 }])).toMatchObject({ subtotal: 56, shipping: 8, total: 64, toFreeShipping: 24 })
  })
  it('gives free shipping from $80 after discounts', () => {
    expect(totals([{ price: 42, qty: 2 }])).toMatchObject({ shipping: 0, total: 84 })
    // 84 - 10% = 75.60, back under the threshold
    expect(totals([{ price: 42, qty: 2 }], 'WELCOME10')).toMatchObject({ discount: 8.4, shipping: 8, total: 83.6 })
  })
  it('ignores unknown promo codes and empty carts', () => {
    expect(totals([{ price: 10, qty: 1 }], 'FAKE').discount).toBe(0)
    expect(totals([]).total).toBe(0)
  })
  it('checks card numbers with Luhn', () => {
    expect(luhn('4242424242424242')).toBe(true)
    expect(luhn('4242424242424241')).toBe(false)
    expect(formatCard('4242424242424242')).toBe('4242 4242 4242 4242')
  })
  it('validates the checkout form', () => {
    expect(validateCheckout(ok, new Date('2026-11-05'))).toEqual({})
    const e = validateCheckout({ ...ok, email: 'rita@', card: '1234', expiry: '10/26' }, new Date('2026-11-05'))
    expect(e).toEqual({ email: expect.any(String), card: expect.any(String), expiry: 'This card has expired.' })
    expect(validateCheckout({ ...ok, expiry: '11/26' }, new Date('2026-11-30')).expiry).toBeUndefined()
    expect(validateCheckout({ ...ok, expiry: '13/30' }).expiry).toBe('Use the MM/YY format.')
  })
})

describe('cart store', () => {
  beforeEach(() => useCart.setState({ items: [], promo: null, lastOrder: null }))

  it('merges the same product and glaze, and caps quantity', () => {
    const { add } = useCart.getState()
    add('p1', 'Sand'); add('p1', 'Sand', 3); add('p1', 'Moss'); add('p4', 'Ink', 99)
    const items = useCart.getState().items
    expect(items).toHaveLength(3)
    expect(items[0].qty).toBe(4)
    expect(items[2].qty).toBe(10)
    expect(cartCount(items)).toBe(15)
  })
  it('places an order, empties the cart and keeps the total', () => {
    const s = useCart.getState()
    s.add('p10', 'Rust', 2)
    expect(s.applyPromo(' welcome10 ')).toBe(true)
    const order = useCart.getState().placeOrder('rita@example.com')
    expect(order.total).toBe(129.6)
    expect(useCart.getState()).toMatchObject({ items: [], promo: null, lastOrder: order })
  })
  it('drops lines whose product no longer exists', () => {
    expect(cartLines([{ productId: 'gone', glaze: 'x', qty: 1 }])).toEqual([])
  })
})
