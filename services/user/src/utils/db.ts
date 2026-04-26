import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI as string);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB connection failed. Error:")
    console.error(error);
  }
  
}

export default connectDb;