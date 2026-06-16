const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const seedProducts = async () => {
  await Product.deleteMany();

  const products = [
    {
      name: 'Lip Gloss',
      description: 'A shiny, luminous lip gloss with a perfect blend of color and shine. Hydrating formula keeps your lips soft and plump for hours. Smudge-proof and long-lasting.',
      price: 12.99,
      category: 'Lips',
      imageUrl: 'https://via.placeholder.com/400?text=Lip+Gloss',
      stock: 50
    },
    {
      name: 'Face Cream',
      description: 'Luxurious moisturizing cream for radiant skin. Packed with natural ingredients and antioxidants to nourish and protect your complexion. Perfect for all skin types.',
      price: 24.99,
      category: 'Skincare',
      imageUrl: 'https://via.placeholder.com/400?text=Face+Cream',
      stock: 30
    },
    {
      name: 'Foundation',
      description: 'Lightweight, full-coverage foundation with a natural finish. Blends seamlessly into skin and provides up to 12-hour wear. Waterproof and sweat-resistant.',
      price: 32.99,
      category: 'Face',
      imageUrl: 'https://via.placeholder.com/400?text=Foundation',
      stock: 25
    },
    {
      name: 'Mascara',
      description: 'Volumizing waterproof mascara for dramatic lashes. Buildable formula delivers dark, bold color with no clumping. All-day wear without flaking.',
      price: 15.99,
      category: 'Eyes',
      imageUrl: 'https://via.placeholder.com/400?text=Mascara',
      stock: 40
    },
    {
      name: 'Eyeshadow Palette',
      description: 'Professional 12-shade eyeshadow palette with rich, pigmented colors. Smooth texture blends effortlessly. Includes matte, shimmer, and metallic finishes.',
      price: 28.99,
      category: 'Eyes',
      imageUrl: 'https://via.placeholder.com/400?text=Eyeshadow',
      stock: 35
    },
    {
      name: 'Blush',
      description: 'Silky soft blush with buildable coverage. Creates a natural flush or bold color depending on application. Long-lasting formula that won\'t fade.',
      price: 14.99,
      category: 'Face',
      imageUrl: 'https://via.placeholder.com/400?text=Blush',
      stock: 45
    }
  ];

  await Product.insertMany(products);
  console.log('Sample products added!');
};

const seedUser = async () => {
  const email = 'mwnyepah@gmail.com';
  const username = 'mwnyepah';
  const password = '12345';

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    existingUser.username = username;
    existingUser.password = hashedPassword;
    existingUser.role = 'customer';
    await existingUser.save();
    console.log(`Updated customer user: ${email}`);
  } else {
    await User.create({ username, email, password: hashedPassword, role: 'customer' });
    console.log(`Registered customer user: ${email}`);
  }
};

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@radiantbeautyglam.com';
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'Admin12345!';

  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Try to find existing admin by username first (most likely case)
  let existingAdmin = await User.findOne({ username });
  
  if (existingAdmin) {
    // Update existing admin
    existingAdmin.email = email;
    existingAdmin.password = hashedPassword;
    existingAdmin.role = 'admin';
    await existingAdmin.save();
    console.log(`Updated admin user: ${email}`);
  } else {
    // Try by email as fallback
    existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      existingAdmin.username = username;
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log(`Updated admin user: ${email}`);
    } else {
      // Create new admin
      await User.create({ username, email, password: hashedPassword, role: 'admin' });
      console.log(`Registered admin user: ${email}`);
    }
  }
};

const seedAll = async () => {
  try {
    await seedProducts();
    await seedUser();
    await seedAdmin();
    console.log('Seeding complete!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAll();
