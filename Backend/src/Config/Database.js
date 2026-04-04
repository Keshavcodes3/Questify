import mongoose from 'mongoose';

export default async function connection() {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected');
  } catch (error) {
    console.error('DB connection error:', error);
    process.exit(1);
  }
}