import { Merchant } from "@/models/merchant.model";

const mongoose = require("mongoose");
require("dotenv").config();
const ServiceProvider = require("./src/models/serviceProvider.model");


async function fixIndexes() {
  await mongoose.connect(process.env.MONGODB_URI);

  // 1. Remove problematic documents
  await Merchant.deleteMany({ user: null });

  // 2. Refresh indexes
  await Merchant.collection.dropIndexes();

  // 3. Create proper index
  await Merchant.collection.createIndex({ name: 1 }, { unique: true });

  console.log("Indexes fixed successfully");
  process.exit(0);
}

fixIndexes().catch((err) => {
  console.error("Error fixing indexes:", err);
  process.exit(1);
});
