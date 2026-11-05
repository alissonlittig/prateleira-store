export const CATEGORIES = ['Mugs', 'Bowls', 'Plates', 'Vases'] as const
export type Category = (typeof CATEGORIES)[number]
export type Shape = 'mug' | 'cup' | 'bowl' | 'deep-bowl' | 'pasta-plate' | 'plate' | 'vase' | 'bud-vase' | 'pitcher'
export interface Glaze { name: string; color: string }

export interface Product {
  id: string
  slug: string
  name: string
  category: Category
  shape: Shape
  price: number
  glazes: Glaze[]
  blurb: string
  details: string[]
  rating: number
  reviews: number
  isNew?: boolean
}

const G = {
  sand: { name: 'Sand', color: '#d9c4a5' },
  moss: { name: 'Moss', color: '#7d8b62' },
  ink: { name: 'Ink', color: '#2f3a4a' },
  clay: { name: 'Clay', color: '#b96a4b' },
  milk: { name: 'Milk', color: '#ece6dc' },
  sea: { name: 'Sea', color: '#5f8f94' },
  rust: { name: 'Rust', color: '#8e4a2f' },
}

// Fictitious studio products for the demo.
export const PRODUCTS: Product[] = [
  { id: 'p1', slug: 'morning-mug', name: 'Morning Mug', category: 'Mugs', shape: 'mug', price: 28, glazes: [G.sand, G.moss, G.ink], rating: 4.8, reviews: 126,
    blurb: 'A generous 12 oz mug with a thumb-rest handle, thrown on the wheel and dipped by hand.', details: ['350 ml', 'Dishwasher and microwave safe', 'Stoneware fired to 1240 °C'] },
  { id: 'p2', slug: 'espresso-cup', name: 'Espresso Cup', category: 'Mugs', shape: 'cup', price: 18, glazes: [G.milk, G.clay], rating: 4.6, reviews: 58, isNew: true,
    blurb: 'Small, thick-walled and warm in the hand. Keeps a double shot hot to the last sip.', details: ['90 ml', 'Dishwasher safe', 'Sold individually'] },
  { id: 'p3', slug: 'travel-tumbler', name: 'Studio Tumbler', category: 'Mugs', shape: 'cup', price: 24, glazes: [G.sea, G.ink], rating: 4.5, reviews: 41,
    blurb: 'A handle-free tumbler for water, wine or cold brew, with a soft matte exterior.', details: ['280 ml', 'Dishwasher safe', 'Unglazed foot ring'] },
  { id: 'p4', slug: 'ramen-bowl', name: 'Ramen Bowl', category: 'Bowls', shape: 'deep-bowl', price: 42, glazes: [G.ink, G.sand], rating: 4.9, reviews: 203,
    blurb: 'Deep and wide for noodles and broth, with a rim that sits comfortably against your lips.', details: ['1.1 L', 'Ø 19 cm', 'Dishwasher and microwave safe'] },
  { id: 'p5', slug: 'cereal-bowl', name: 'Everyday Bowl', category: 'Bowls', shape: 'bowl', price: 26, glazes: [G.milk, G.moss, G.clay], rating: 4.7, reviews: 187,
    blurb: 'The bowl you reach for first: cereal, salads, yogurt and fruit.', details: ['600 ml', 'Ø 15 cm', 'Stackable'] },
  { id: 'p6', slug: 'serving-bowl', name: 'Serving Bowl', category: 'Bowls', shape: 'bowl', price: 64, glazes: [G.sea, G.rust], rating: 4.8, reviews: 34, isNew: true,
    blurb: 'A wide centrepiece for family-style dinners, glazed inside and raw on the outside.', details: ['2.4 L', 'Ø 28 cm', 'Hand wash recommended'] },
  { id: 'p7', slug: 'dinner-plate', name: 'Dinner Plate', category: 'Plates', shape: 'plate', price: 34, glazes: [G.milk, G.ink, G.sand], rating: 4.7, reviews: 142,
    blurb: 'A low-rimmed plate with a gentle curve that keeps sauces in place.', details: ['Ø 27 cm', 'Dishwasher and microwave safe', 'Chip-resistant rim'] },
  { id: 'p8', slug: 'side-plate', name: 'Side Plate', category: 'Plates', shape: 'plate', price: 22, glazes: [G.moss, G.clay], rating: 4.6, reviews: 77,
    blurb: 'For bread, dessert or a slice of cake with afternoon coffee.', details: ['Ø 20 cm', 'Dishwasher safe', 'Stackable'] },
  { id: 'p9', slug: 'pitcher', name: 'Table Pitcher', category: 'Vases', shape: 'pitcher', price: 58, glazes: [G.milk, G.sea], rating: 4.9, reviews: 29,
    blurb: 'Pours cleanly without dripping. Just as good holding a bunch of wildflowers.', details: ['1 L', 'Hand wash recommended', 'Pulled spout'] },
  { id: 'p10', slug: 'tall-vase', name: 'Tall Vase', category: 'Vases', shape: 'vase', price: 72, glazes: [G.rust, G.ink, G.sand], rating: 4.8, reviews: 46,
    blurb: 'A slender silhouette for branches and dried stems, weighted at the base.', details: ['H 32 cm', 'Watertight', 'Felt pad on the base'] },
  { id: 'p11', slug: 'bud-vase', name: 'Bud Vase', category: 'Vases', shape: 'bud-vase', price: 19, glazes: [G.moss, G.clay, G.milk], rating: 4.7, reviews: 95, isNew: true,
    blurb: 'Small enough for a windowsill, made for a single stem from the garden.', details: ['H 11 cm', 'Watertight', 'Each one is slightly different'] },
  { id: 'p12', slug: 'pasta-plate', name: 'Pasta Plate', category: 'Plates', shape: 'pasta-plate', price: 38, glazes: [G.sand, G.sea], rating: 4.5, reviews: 63,
    blurb: 'Halfway between a plate and a bowl, shaped for twirling spaghetti.', details: ['Ø 23 cm', 'Dishwasher and microwave safe', 'Stoneware'] },
]

export const bySlug = (slug: string) => PRODUCTS.find(p => p.slug === slug)
export const byId = (id: string) => PRODUCTS.find(p => p.id === id)

export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export type Sort = 'featured' | 'price-asc' | 'price-desc' | 'rating'

export function queryProducts(list: Product[], { q = '', category = '', sort = 'featured' }: { q?: string; category?: string; sort?: Sort }) {
  const term = q.trim().toLowerCase()
  const out = list.filter(p =>
    (!category || p.category === category) &&
    (!term || `${p.name} ${p.blurb} ${p.category}`.toLowerCase().includes(term)))
  const by: Record<Sort, (a: Product, b: Product) => number> = {
    featured: () => 0,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  }
  return out.sort(by[sort])
}
