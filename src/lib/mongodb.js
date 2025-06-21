import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export default async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
