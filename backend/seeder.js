const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Cart = require('./models/Cart');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Delete existing records
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();

    console.log('Existing data cleared.');

    // Seed Users
    const adminUser = await User.create({
      name: 'ShopEZ Admin',
      email: 'admin@shopez.com',
      password: 'admin123', // Will be hashed by user pre-save hook
      role: 'admin'
    });

    const standardUser = await User.create({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'john123', // Will be hashed by user pre-save hook
      role: 'user'
    });

    console.log('Sample Users Seeded.');

    const sampleProducts = [
      {
        name: 'AeroSound Max Pro Headphones',
        description: 'Immersive noise-canceling over-ear wireless headphones with spatial audio, up to 40 hours of battery life, and ultra-comfortable memory foam ear cushions.',
        price: 199.99,
        discount: 15,
        category: 'Electronics',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
        reviews: [
          { user: standardUser._id, name: 'Alice Smith', rating: 5, comment: 'Phenomenal sound quality and noise cancelation!' },
          { user: standardUser._id, name: 'Bob Johnson', rating: 4, comment: 'Very comfortable, but app connection is sometimes slow.' }
        ],
        rating: 4.5,
        numReviews: 2
      },
      {
        name: 'NovaPulse Smart Watch 2',
        description: 'Sleek smartwatch featuring an always-on AMOLED display, comprehensive fitness tracking, heart rate & SpO2 monitoring, GPS, and up to 7-day battery life.',
        price: 149.99,
        discount: 10,
        category: 'Electronics',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
        reviews: [
          { user: standardUser._id, name: 'Charlie Brown', rating: 5, comment: 'Best fitness companion I have owned!' }
        ],
        rating: 5,
        numReviews: 1
      },
      {
        name: 'Velocity Sleek Running Shoes',
        description: 'High-performance lightweight running shoes engineered with responsive foam cushioning and breathable knit upper for ultimate speed and stamina.',
        price: 89.99,
        discount: 20,
        category: 'Fashion',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60',
        reviews: [],
        rating: 0,
        numReviews: 0
      },
      {
        name: 'Horizon Explorer Ergonomic Backpack',
        description: 'Heavy-duty water-resistant travel and commuter backpack featuring a TSA-friendly 16-inch laptop sleeve, hidden anti-theft pockets, and padded lumbar support.',
        price: 69.99,
        discount: 0,
        category: 'Fashion',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60',
        reviews: [
          { user: standardUser._id, name: 'David Miller', rating: 4, comment: 'Spacious and fits everything nicely. Great for trips.' }
        ],
        rating: 4.0,
        numReviews: 1
      },
      {
        name: 'EcoHydro Vacuum Insulated Bottle',
        description: 'Double-walled stainless steel water bottle that keeps your drinks ice cold for 24 hours or steaming hot for 12 hours. Sweat-proof powder coat finish.',
        price: 29.99,
        discount: 5,
        category: 'Sports & Outdoors',
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=60',
        reviews: [],
        rating: 0,
        numReviews: 0
      },
      {
        name: 'BaristaTouch Espresso Machine',
        description: 'Create third wave specialty coffee at home from bean to cup. Built-in precision conical burr grinder, powerful steam wand for microfoam latte art.',
        price: 599.99,
        discount: 12,
        category: 'Home & Kitchen',
        stock: 8,
        imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=800&auto=format&fit=crop&q=60',
        reviews: [
          { user: standardUser._id, name: 'Eve Davis', rating: 5, comment: 'Coffee shop quality espresso in my kitchen!' }
        ],
        rating: 5,
        numReviews: 1
      },
      {
        name: 'KeyForge Mechanical Keyboard',
        description: 'Tenkeyless layout mechanical gaming keyboard featuring hot-swappable tactile switches, double-shot PBT keycaps, and customizable dynamic RGB lighting.',
        price: 119.99,
        discount: 15,
        category: 'Electronics',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60',
        reviews: [],
        rating: 0,
        numReviews: 0
      },
      {
        name: 'VividVue 4K Smart Projector',
        description: 'Ultra HD portable projector with 1500 ANSI lumens, built-in dual stereo speakers, automatic screen keystone alignment, and preinstalled streaming apps.',
        price: 349.99,
        discount: 8,
        category: 'Electronics',
        stock: 12,
        imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&auto=format&fit=crop&q=60',
        reviews: [],
        rating: 0,
        numReviews: 0
      }
    ];

    // Seed Products
    await Product.insertMany(sampleProducts);
    console.log('Sample Products Seeded.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error with seeding data: ${error.message}`);
    process.exit(1);
  }
};

seedData();
