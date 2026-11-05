import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { App } from '../App'
import { useCart } from '../store'

const renderAt = (path = '/') => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)

beforeEach(() => useCart.setState({ items: [], promo: null, lastOrder: null }))

describe('shop', () => {
  it('filters by category chip and search', async () => {
    renderAt()
    expect(screen.getByText('12 products')).toBeInTheDocument()
    await userEvent.click(within(screen.getByRole('group', { name: 'Category' })).getByRole('button', { name: 'Vases' }))
    expect(screen.getByText('3 products')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Morning Mug' })).not.toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Search products'), 'bud')
    expect(screen.getByText('1 product')).toBeInTheDocument()
  })

  it('shows an empty state with a way back', async () => {
    renderAt('/?q=zzz')
    expect(screen.getByText('Nothing matches “zzz”.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Show all products' }))
    expect(screen.getByText('12 products')).toBeInTheDocument()
  })
})

describe('buying flow', () => {
  it('adds a chosen glaze and quantity to the cart and updates the header count', async () => {
    renderAt('/product/morning-mug')
    await userEvent.click(screen.getByRole('radio', { name: 'Moss' }))
    await userEvent.click(screen.getByRole('button', { name: 'Increase quantity' }))
    await userEvent.click(screen.getByRole('button', { name: /Add to cart/ }))
    expect(screen.getByText(/2 × Morning Mug \(Moss\) added to your cart\./)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Cart, 2 items' })).toBeInTheDocument()
  })

  it('applies a promo code, rejects a bad one and removes items', async () => {
    useCart.getState().add('p4', 'Ink', 2)
    useCart.getState().add('p2', 'Milk', 1)
    renderAt('/cart')
    await userEvent.type(screen.getByLabelText('Promo code'), 'NOPE')
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByText('That code is not valid.')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Promo code'), 'welcome10')
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByText('Discount (WELCOME10)')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Remove Espresso Cup (Milk)' }))
    expect(screen.queryByText('Espresso Cup')).not.toBeInTheDocument()
  })

  it('validates checkout and shows the confirmation', async () => {
    useCart.getState().add('p7', 'Milk', 1)
    renderAt('/checkout')
    await userEvent.click(screen.getByRole('button', { name: 'Place order' }))
    expect(screen.getByText('Enter your full name.')).toBeInTheDocument()
    expect(screen.getByLabelText('Full name')).toHaveFocus()

    await userEvent.type(screen.getByLabelText('Full name'), 'Rita Lopes')
    await userEvent.type(screen.getByLabelText('Email'), 'rita@example.com')
    await userEvent.type(screen.getByLabelText('Street address'), '12 Harbour Street')
    await userEvent.type(screen.getByLabelText('City'), 'Porto')
    await userEvent.type(screen.getByLabelText('Postal code'), '4000-123')
    await userEvent.type(screen.getByLabelText('Card number'), '4242424242424242')
    expect(screen.getByLabelText('Card number')).toHaveValue('4242 4242 4242 4242')
    await userEvent.type(screen.getByLabelText('Expiry (MM/YY)'), '12/40')
    await userEvent.type(screen.getByLabelText('CVC'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Place order' }))

    expect(screen.getByRole('heading', { name: 'Thank you, your order is in.' })).toBeInTheDocument()
    expect(screen.getByText('$42.00')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Cart, 0 items' })).toBeInTheDocument()
  })

  it('sends an empty checkout back to the cart', () => {
    renderAt('/checkout')
    expect(screen.getByRole('heading', { name: 'Your cart is empty' })).toBeInTheDocument()
  })
})
