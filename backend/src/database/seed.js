import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Product from "../models/Product.js";
import User from "../models/User.js";
import ServiceArea from "../models/ServiceArea.js";

dotenv.config();

const UNSPLASH_IMAGES = {
  Burger: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=800&q=80"
  ],
  Pizza: [
    "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80"
  ],
  Drinks: [
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80"
  ],
  Dessert: [
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
  ],
  Chinese: [
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80"
  ]
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Clear existing data
    await Product.deleteMany();
    console.log("Products cleared.");

    // Check if seed vendor exists
    let vendor = await User.findOne({ email: "vendor@auraeats.com" });
    if (!vendor) {
      console.log("Creating default vendor...");
      vendor = new User({
        name: "Aura Vendor",
        email: "vendor@auraeats.com",
        password: "Vendor123", // Will be hashed by pre-save hook
        role: "vendor",
      });
      await vendor.save();
    }

    // Seed Service Area (Delhi MVP)
    await ServiceArea.deleteMany();
    await ServiceArea.create({
      name: "Delhi MVP Zone",
      polygon: [
        [76.84, 28.88], // North-West
        [77.34, 28.88], // North-East
        [77.34, 28.40], // South-East
        [76.84, 28.40], // South-West
        [76.84, 28.88]  // Close the polygon
      ]
    });
    console.log("Service Area seeded.");

    const dummyProducts = [
      // BURGERS
      {
        name: "Aura Signature Truffle Burger",
        description: "Dry-aged beef patty, black truffle aioli, gruyere cheese, caramelized onions on a brioche bun.",
        price: 24.99,
        category: "Burger",
        stock: 50,
        vendorId: vendor._id,
        images: UNSPLASH_IMAGES.Burger,
      },
      {
        name: "Wagyu Smash Burger",
        description: "Double wagyu smash patties, american cheese, house pickles, special sauce.",
        price: 28.50,
        category: "Burger",
        stock: 30,
        vendorId: vendor._id,
        images: [UNSPLASH_IMAGES.Burger[1], UNSPLASH_IMAGES.Burger[2], UNSPLASH_IMAGES.Burger[0]],
      },
      {
        name: "Spicy Jalapeno Chicken Burger",
        description: "Crispy fried chicken breast, spicy jalapeno slaw, pepper jack cheese, brioche bun.",
        price: 19.99,
        category: "Burger",
        stock: 40,
        vendorId: vendor._id,
        images: [UNSPLASH_IMAGES.Burger[2], UNSPLASH_IMAGES.Burger[0], UNSPLASH_IMAGES.Burger[1]],
      },
      {
        name: "Beyond Veggie Burger",
        description: "Plant-based patty, vegan cheddar, fresh lettuce, tomato, vegan mayo.",
        price: 18.50,
        category: "Burger",
        stock: 45,
        vendorId: vendor._id,
        images: UNSPLASH_IMAGES.Burger,
      },

      // PIZZA
      {
        name: "Artisanal Margherita Pizza",
        description: "San Marzano tomato sauce, fresh buffalo mozzarella, basil, extra virgin olive oil.",
        price: 18.00,
        category: "Pizza",
        stock: 40,
        vendorId: vendor._id,
        images: UNSPLASH_IMAGES.Pizza,
      },
      {
        name: "Spicy Diavola Pizza",
        description: "Spicy calabrese salami, crushed red pepper, mozzarella, honey drizzle.",
        price: 22.00,
        category: "Pizza",
        stock: 25,
        vendorId: vendor._id,
        images: [UNSPLASH_IMAGES.Pizza[1], UNSPLASH_IMAGES.Pizza[2], UNSPLASH_IMAGES.Pizza[0]],
      },
      {
        name: "Truffle Mushroom Pizza",
        description: "White base, roasted wild mushrooms, truffle oil, mozzarella, parmesan.",
        price: 25.00,
        category: "Pizza",
        stock: 20,
        vendorId: vendor._id,
        images: [UNSPLASH_IMAGES.Pizza[2], UNSPLASH_IMAGES.Pizza[0], UNSPLASH_IMAGES.Pizza[1]],
      },
      {
        name: "Four Cheese Bianco Pizza",
        description: "Mozzarella, gorgonzola, provolone, and parmesan with garlic confit.",
        price: 21.00,
        category: "Pizza",
        stock: 35,
        vendorId: vendor._id,
        images: UNSPLASH_IMAGES.Pizza,
      },

      // DRINKS
      {
        name: "Matcha Yuzu Lemonade",
        description: "Ceremonial grade matcha perfectly blended with fresh yuzu and sparkling water.",
        price: 8.50,
        category: "Drinks",
        stock: 100,
        vendorId: vendor._id,
        images: UNSPLASH_IMAGES.Drinks,
      },
      {
        name: "Lavender Cold Brew",
        description: "Steeped cold brew coffee infused with subtle lavender syrup and a splash of oat milk.",
        price: 6.50,
        category: "Drinks",
        stock: 80,
        vendorId: vendor._id,
        images: [UNSPLASH_IMAGES.Drinks[1], UNSPLASH_IMAGES.Drinks[2], UNSPLASH_IMAGES.Drinks[0]],
      },
      {
        name: "Fresh Strawberry Mojito",
        description: "Muddled fresh strawberries, mint, lime juice, and sparkling water.",
        price: 9.00,
        category: "Drinks",
        stock: 60,
        vendorId: vendor._id,
        images: [UNSPLASH_IMAGES.Drinks[2], UNSPLASH_IMAGES.Drinks[0], UNSPLASH_IMAGES.Drinks[1]],
      },

      // DESSERT
      {
        name: "Dark Chocolate Lava Cake",
        description: "Decadent dark chocolate fondant with a molten center, served with vanilla bean ice cream.",
        price: 14.00,
        category: "Dessert",
        stock: 20,
        vendorId: vendor._id,
        images: UNSPLASH_IMAGES.Dessert,
      },
      {
        name: "Pistachio Rose Cheesecake",
        description: "Creamy cheesecake infused with rose water, topped with crushed pistachios.",
        price: 12.50,
        category: "Dessert",
        stock: 30,
        vendorId: vendor._id,
        images: [UNSPLASH_IMAGES.Dessert[1], UNSPLASH_IMAGES.Dessert[2], UNSPLASH_IMAGES.Dessert[0]],
      },
      {
        name: "Classic Tiramisu",
        description: "Espresso-soaked ladyfingers layered with mascarpone cream and dusted with cocoa.",
        price: 11.00,
        category: "Dessert",
        stock: 40,
        vendorId: vendor._id,
        images: [UNSPLASH_IMAGES.Dessert[2], UNSPLASH_IMAGES.Dessert[0], UNSPLASH_IMAGES.Dessert[1]],
      },

      // CHINESE
      {
        name: "Szechuan Spicy Noodles",
        description: "Hand-pulled noodles tossed in a fiery Szechuan chili oil sauce with minced pork.",
        price: 16.00,
        category: "Chinese",
        stock: 50,
        vendorId: vendor._id,
        images: UNSPLASH_IMAGES.Chinese,
      },
      {
        name: "Crispy Peking Duck",
        description: "Traditional roasted duck with crispy skin, served with pancakes and hoisin sauce.",
        price: 32.00,
        category: "Chinese",
        stock: 15,
        vendorId: vendor._id,
        images: [UNSPLASH_IMAGES.Chinese[1], UNSPLASH_IMAGES.Chinese[2], UNSPLASH_IMAGES.Chinese[0]],
      },
      {
        name: "Dim Sum Platter",
        description: "Assorted handmade dumplings including har gow, siu mai, and veggie potstickers.",
        price: 22.50,
        category: "Chinese",
        stock: 35,
        vendorId: vendor._id,
        images: [UNSPLASH_IMAGES.Chinese[2], UNSPLASH_IMAGES.Chinese[0], UNSPLASH_IMAGES.Chinese[1]],
      }
    ];

    await Product.insertMany(dummyProducts);
    console.log(`Successfully seeded ${dummyProducts.length} products!`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
