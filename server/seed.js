// server/seed.js
import dotenv    from 'dotenv'
import mongoose  from 'mongoose'
import Product   from './models/Product.js'

dotenv.config()

const products = [
  // ── Top Sellers ──────────────────────────
  {
    name: 'Silver Gold Vintage Round', slug: 'silver-gold-vintage-round',
    price: 2499, category: 'top-sellers', badge: 'Best Seller', rating: 5,
    description: 'A timeless round frame in silver and gold tones. Premium acetate with anti-scratch coating.',
    images: ['/assets/image/t_s_1.png'], featured: true,
  },
  {
    name: 'Premium Clubmaster', slug: 'premium-clubmaster',
    price: 3499, category: 'top-sellers', badge: 'Top Pick', rating: 5,
    description: 'Classic browline design with a modern cyberpunk twist. Titanium reinforced.',
    images: ['/assets/image/t_s_2.png'], featured: true,
  },
  {
    name: 'Crystal Clear Round', slug: 'crystal-clear-round',
    price: 1999, category: 'top-sellers', badge: '', rating: 4,
    description: 'Transparent acetate round frame. Lightweight and minimal for everyday wear.',
    images: ['/assets/image/t_s_3.png'],
  },
  {
    name: 'Classic Browline Gold', slug: 'classic-browline-gold',
    price: 2999, category: 'top-sellers', badge: '', rating: 5,
    description: 'Iconic browline silhouette in brushed gold. A statement frame with vintage character.',
    images: ['/assets/image/t_s_4.png'],
  },
  {
    name: 'Matte Black Aviator', slug: 'matte-black-aviator',
    price: 2199, category: 'top-sellers', badge: 'Popular', rating: 4,
    description: 'Military-inspired aviator in matte black. UV400 protection, stainless steel frame.',
    images: ['/assets/image/t_s_5.png'],
  },

  // ── New Arrivals ─────────────────────────
  {
    name: 'Neon Cyber Frame', slug: 'neon-cyber-frame',
    price: 3299, category: 'new-arrivals', badge: 'New', rating: 5,
    description: 'Bold cyberpunk design with translucent neon accents. Limited edition drop.',
    images: ['/assets/image/n_a_1.png'], featured: true,
  },
  {
    name: 'Rose Gold Butterfly', slug: 'rose-gold-butterfly',
    price: 2699, category: 'new-arrivals', badge: 'New', rating: 4,
    description: 'Elegant butterfly shape in rose gold. Featherlight titanium alloy construction.',
    images: ['/assets/image/n_a_2.png'],
  },
  {
    name: 'Midnight Blue Square', slug: 'midnight-blue-square',
    price: 2499, category: 'new-arrivals', badge: 'New', rating: 4,
    description: 'Deep midnight blue acetate square frame. Subtle texture finish, metal hinges.',
    images: ['/assets/image/n_a_3.png'],
  },
  {
    name: 'Arctic White Round', slug: 'arctic-white-round',
    price: 1899, category: 'new-arrivals', badge: 'New', rating: 4,
    description: 'Clean white acetate round frame. Perfect minimalist aesthetic for any outfit.',
    images: ['/assets/image/n_a_4.png'],
  },
  {
    name: 'Emerald Oversized', slug: 'emerald-oversized',
    price: 3899, category: 'new-arrivals', badge: 'New', rating: 5,
    description: 'Bold oversized frame in deep emerald green. Fashion-forward and ultra-premium.',
    images: ['/assets/image/n_a_5.png'],
  },

  // ── Round Frames ─────────────────────────
  {
    name: 'Classic Gold Round', slug: 'classic-gold-round',
    price: 2299, category: 'round-frames', badge: '', rating: 4,
    description: 'Timeless round frame with thin gold wire construction. Light as air.',
    images: ['/assets/image/hero_1.png'],
  },
  {
    name: 'Rose Tinted Round', slug: 'rose-tinted-round',
    price: 2099, category: 'round-frames', badge: '', rating: 4,
    description: 'Soft rose tinted acetate round frame. Vintage-inspired with modern precision.',
    images: ['/assets/image/hero_3.png'],
  },
  {
    name: 'Blue Light Shield Round', slug: 'blue-light-shield-round',
    price: 1799, category: 'round-frames', badge: 'Blue Light', rating: 4,
    description: 'Round frame with built-in blue light filtering lens. Ideal for screen use.',
    images: ['/assets/image/r_f_3.png'],
  },
  {
    name: 'Vintage Brown Round', slug: 'vintage-brown-round',
    price: 2599, category: 'round-frames', badge: '', rating: 5,
    description: 'Warm tortoise-brown acetate round frame. Handcrafted Italian acetate.',
    images: ['/assets/image/r_f_4.png'],
  },
  {
    name: 'Pearl White Round', slug: 'pearl-white-round',
    price: 1999, category: 'round-frames', badge: '', rating: 4,
    description: 'Lustrous pearl white finish on a classic round silhouette. Refined and clean.',
    images: ['/assets/image/hero_5.png'],
  },

  // ── Square Frames ────────────────────────
  {
    name: 'Executive Black Square', slug: 'executive-black-square',
    price: 2799, category: 'square-frames', badge: '', rating: 5,
    description: 'Sharp matte black square frame. Exudes authority and modern sophistication.',
    images: ['/assets/image/hero_2.png'],
  },
  {
    name: 'Titanium Slim Square', slug: 'titanium-slim-square',
    price: 3299, category: 'square-frames', badge: 'Premium', rating: 5,
    description: 'Ultra-thin titanium square frame at just 1.2mm thick. Engineering precision.',
    images: ['/assets/image/hero_4.png'],
  },
  {
    name: 'Tortoise Shell Square', slug: 'tortoise-shell-square',
    price: 2399, category: 'square-frames', badge: '', rating: 4,
    description: 'Classic tortoise shell pattern in a bold square cut. Timeless everyday frame.',
    images: ['/assets/image/s_f_3.png'],
  },
  {
    name: 'Navy Blue Square', slug: 'navy-blue-square',
    price: 2199, category: 'square-frames', badge: '', rating: 4,
    description: 'Deep navy blue acetate square. Pairs perfectly with formal and casual looks.',
    images: ['/assets/image/s_f_4.png'],
  },
  {
    name: 'Bold Red Square', slug: 'bold-red-square',
    price: 2499, category: 'square-frames', badge: 'Bold', rating: 4,
    description: 'Statement red acetate square frame. Not for the faint-hearted.',
    images: ['/assets/image/s_f_5.png'],
  },

  // ── Sunglasses ───────────────────────────
  {
    name: 'UV400 Shield', slug: 'uv400-shield',
    price: 3499, category: 'sunglasses', badge: 'UV400', rating: 5,
    description: 'Maximum UV protection in a bold shield design. Sports-luxe aesthetic.',
    images: ['/assets/image/sun_1.png'], featured: true,
  },
  {
    name: 'Polarized Aviator Sun', slug: 'polarized-aviator-sun',
    price: 2999, category: 'sunglasses', badge: 'Polarized', rating: 5,
    description: 'Classic aviator silhouette with polarized lenses. Eliminates glare completely.',
    images: ['/assets/image/sun_2.png'],
  },
  {
    name: 'Retro Cat Eye Sun', slug: 'retro-cat-eye-sun',
    price: 2699, category: 'sunglasses', badge: '', rating: 4,
    description: 'Iconic cat eye shape with gradient lenses. Retro glamour for the modern age.',
    images: ['/assets/image/sun_3.png'],
  },
  {
    name: 'Sport Wrap Sun', slug: 'sport-wrap-sun',
    price: 3199, category: 'sunglasses', badge: 'Sport', rating: 4,
    description: 'Wraparound sport sunglasses with TR90 frame. Lightweight and impact-resistant.',
    images: ['/assets/image/sun_4.png'],
  },
  {
    name: 'Classic Wayfarers', slug: 'classic-wayfarers',
    price: 2899, category: 'sunglasses', badge: '', rating: 5,
    description: 'The original wayfarer shape reimagined for the cyberpunk era. Iconic.',
    images: ['/assets/image/hero_5.png'],
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'frames' })
    console.log('MongoDB connected')

    await Product.deleteMany({})
    console.log('Cleared existing products')

    const inserted = await Product.insertMany(products)
    console.log(`Seeded ${inserted.length} products`)

    mongoose.connection.close()
    console.log('Done. Run: node seed.js')
  } catch (err) {
    console.error('Seed failed:', err.message)
    process.exit(1)
  }
}

seed()