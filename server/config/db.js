// import mongoose from 'mongoose';

// const connectDB = async() => {
//     try {
//         await mongoose.connect(process.env.MONGO_URL, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//     } catch (error) {
//         process.exit(1);
//     }
// }

// export default connectDB;

import prisma from "./prisma.js";

const connectDB = async () => {
  try {
    // Authenticate/connect Prisma client (optional, as Prisma connects lazily, but good for fail-fast)
    await prisma.$connect();
    console.log("PostgreSQL connected via Prisma");
  } catch (err) {
    console.error("PostgreSQL connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
