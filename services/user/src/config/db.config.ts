import mongoose from 'mongoose';
import ENV from './env.config.js';

const connectDb = async () => {
  try {
    mongoose.connect(ENV.MONGO_URI as string);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB connection failed. Error:")
    console.error(error);
  }
  
}

export default connectDb;