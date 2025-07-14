import prisma from "../utils/prisma.js";

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Successfully connected to Neon PostgreSQL");
  } catch (err) {
    console.error("❌ Error connecting to Neon DB:", err.message);
    process.exit(1);
  }
};

export default connectDB;
