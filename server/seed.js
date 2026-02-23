import mongoose from 'mongoose';
import Product from './models/Product.js';

await mongoose.connect('mongodb://localhost:27017/ecommerce_3d');

const products = [
  // ── Graduation ────────────────────────────────
  { name: "Graduation Cap Gift Box",      description: "Elegant gift box with a graduation cap theme, perfect for new graduates.",                price: 49.99,  category: "graduation", stock: 25, image: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=400" },
  { name: "Scholar's Pen Set",            description: "Premium fountain pen set in a velvet-lined box. A timeless graduation gift.",              price: 34.99,  category: "graduation", stock: 40, image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400" },
  { name: "Future is Bright Hamper",      description: "Motivational book, gourmet chocolates, and a personalized keychain.",                     price: 59.99,  category: "graduation", stock: 15, image: "https://images.unsplash.com/photo-1549465220-1a8b9238f73e?w=400" },
  { name: "Diploma Frame Deluxe",         description: "Handcrafted wooden diploma frame with gold accents.",                                     price: 39.99,  category: "graduation", stock: 30, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=400" },

  // ── Wedding ───────────────────────────────────
  { name: "Luxury Couple's Spa Set",      description: "Aromatic candles, bath bombs, and essential oils for the newlyweds.",                     price: 89.99,  category: "wedding",    stock: 20, image: "https://images.unsplash.com/photo-1556228720-195a672e68b0?w=400" },
  { name: "Crystal Wine Glass Pair",      description: "Hand-blown crystal wine glasses engraved with initials.",                                 price: 74.99,  category: "wedding",    stock: 18, image: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=400" },
  { name: "Love Story Photo Album",       description: "Premium leather-bound photo album with 100 archival-quality pages.",                      price: 54.99,  category: "wedding",    stock: 22, image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400" },
  { name: "Golden Anniversary Clock",     description: "Elegant mantel clock with a golden finish — a timeless keepsake.",                        price: 119.99, category: "wedding",    stock: 10, image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400" },

  // ── Birthday ──────────────────────────────────
  { name: "Birthday Surprise Box",        description: "Confetti, party hat, chocolates, and a surprise toy inside a colorful box.",              price: 29.99,  category: "birthday",   stock: 50, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400" },
  { name: "Gourmet Cake Hamper",          description: "Artisan mini-cakes, macarons, and a 'Happy Birthday' candle set.",                       price: 44.99,  category: "birthday",   stock: 35, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400" },
  { name: "Personalized Star Map",        description: "A framed star map showing the night sky on the date of their birth.",                     price: 64.99,  category: "birthday",   stock: 20, image: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400" },
  { name: "Retro Polaroid Gift Kit",      description: "Instant camera, film pack, and a scrapbook to capture memories.",                         price: 79.99,  category: "birthday",   stock: 12, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400" },

  // ── General ───────────────────────────────────
  { name: "Cozy Comfort Blanket Set",     description: "Ultra-soft fleece blanket with matching cushion in a gift bag.",                          price: 42.99,  category: "general",    stock: 30, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400" },
  { name: "Aromatherapy Candle Trio",     description: "Three hand-poured soy candles — lavender, vanilla, and rosemary.",                       price: 27.99,  category: "general",    stock: 45, image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400" },
  { name: "Succulent Garden Kit",         description: "DIY mini succulent garden with ceramic pots and premium soil mix.",                       price: 35.99,  category: "general",    stock: 28, image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=400" },
  { name: "Premium Tea Collection",       description: "12 exotic teas from around the world in a wooden presentation box.",                     price: 38.99,  category: "general",    stock: 33, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400" },
  { name: "Handcrafted Jewelry Box",      description: "Walnut wood jewelry box with velvet interior and engraved lid.",                         price: 56.99,  category: "general",    stock: 16, image: "https://images.unsplash.com/photo-1515562141589-67f0d745e4e5?w=400" },
  { name: "Luxury Chocolate Assortment",  description: "24 artisan chocolates — dark, milk, and white — in an elegant gift box.",                price: 49.99,  category: "general",    stock: 40, image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400" },
];

const result = await Product.insertMany(products);
console.log(`✅ Inserted ${result.length} products into the database!`);
process.exit(0);
