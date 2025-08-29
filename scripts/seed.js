// scripts/seed-properties.js
import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

const MONGODB_URI ="mongodb://127.0.0.1:27017/rentmanagement";

// === Property Schema ===
const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  rent: Number,
  rooms: Number,
  bathrooms: Number,
  area: Number,
  images: [String],
  availability: Boolean,
  amenities: [String],
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Property = mongoose.model("Property", propertySchema);

async function seedProperties() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Property.deleteMany({});
    console.log("🗑️ Cleared old properties");

    const ownerId = new mongoose.Types.ObjectId(
      "689edc266c7bfeee571aadc9"
    );

    const properties = [
      {
        title: "Spacious 2BHK Apartment",
        description:
          "A well-ventilated 2BHK apartment near the city center with modern interiors and balcony.",
        location: "Bangalore, Karnataka",
        rent: 18000,
        rooms: 2,
        bathrooms: 2,
        area: 1100,
        images: [
          "https://picsum.photos/800/400?random=11",
          "https://picsum.photos/800/400?random=12",
        ],
        availability: true,
        amenities: ["Parking", "24/7 Water", "Power Backup", "Lift"],
        ownerId,
      },
      {
        title: "Luxury Villa with Garden",
        description:
          "A premium 4BHK villa with a private garden, terrace, and luxurious interiors.",
        location: "Mysore, Karnataka",
        rent: 45000,
        rooms: 4,
        bathrooms: 3,
        area: 2600,
        images: [
          "https://picsum.photos/800/400?random=13",
          "https://picsum.photos/800/400?random=14",
        ],
        availability: true,
        amenities: ["Swimming Pool", "Private Garden", "Gym Access"],
        ownerId,
      },
      {
        title: "Affordable Studio Apartment",
        description:
          "Compact and affordable studio apartment ideal for students and working professionals.",
        location: "Hubli, Karnataka",
        rent: 8000,
        rooms: 1,
        bathrooms: 1,
        area: 500,
        images: [
          "https://picsum.photos/800/400?random=15",
          "https://picsum.photos/800/400?random=16",
        ],
        availability: false,
        amenities: ["WiFi", "Lift Access"],
        ownerId,
      },
      {
        title: "Modern 3BHK Duplex",
        description:
          "Stylish duplex home with 3 bedrooms, modular kitchen, and terrace garden.",
        location: "Belgaum, Karnataka",
        rent: 22000,
        rooms: 3,
        bathrooms: 3,
        area: 1500,
        images: [
          "https://picsum.photos/800/400?random=17",
          "https://picsum.photos/800/400?random=18",
        ],
        availability: true,
        amenities: ["Covered Parking", "CCTV Security", "Solar Heating"],
        ownerId,
      },
      {
        title: "Furnished PG for Girls",
        description:
          "Safe and fully furnished PG accommodation with food, laundry, and housekeeping services.",
        location: "Shimoga, Karnataka",
        rent: 6000,
        rooms: 1,
        bathrooms: 1,
        area: 350,
        images: [
          "https://picsum.photos/800/400?random=19",
          "https://picsum.photos/800/400?random=20",
        ],
        availability: true,
        amenities: ["WiFi", "Food Included", "Laundry", "Housekeeping"],
        ownerId,
      },
      {
        title: "Beachside Holiday Home",
        description:
          "Beautiful 2BHK holiday home located near Karwar beach with sea-facing balcony.",
        location: "Karwar, Karnataka",
        rent: 30000,
        rooms: 2,
        bathrooms: 2,
        area: 1300,
        images: [
          "https://picsum.photos/800/400?random=21",
          "https://picsum.photos/800/400?random=22",
        ],
        availability: true,
        amenities: ["Sea View", "Private Parking", "24/7 Security"],
        ownerId,
      },
      {
        title: "Penthouse with Rooftop Garden",
        description:
          "Luxury penthouse with rooftop garden, open kitchen, and panoramic city views.",
        location: "Bangalore, Karnataka",
        rent: 55000,
        rooms: 3,
        bathrooms: 3,
        area: 2800,
        images: [
          "https://picsum.photos/800/400?random=23",
          "https://picsum.photos/800/400?random=24",
        ],
        availability: false,
        amenities: ["Rooftop Garden", "Home Theater", "Smart Home Features"],
        ownerId,
      },
      {
        title: "Budget 1RK Apartment",
        description:
          "Affordable 1RK flat suitable for bachelors with easy access to public transport.",
        location: "Davangere, Karnataka",
        rent: 5000,
        rooms: 1,
        bathrooms: 1,
        area: 300,
        images: [
          "https://picsum.photos/800/400?random=25",
          "https://picsum.photos/800/400?random=26",
        ],
        availability: true,
        amenities: ["24/7 Water", "Nearby Bus Stop"],
        ownerId,
      },
    ];

    await Property.insertMany(properties);
    console.log("🏠 Properties seeded successfully");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding properties:", err);
    process.exit(1);
  }
}

seedProperties();
