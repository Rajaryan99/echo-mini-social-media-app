import mongoose from 'mongoose';

const mongoURI = process.env.MOGNODB_URL || 'mongodb://127.0.0.1:27017/echo-mini-social-media-app';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('DB connected successfully!!');
  } catch (error) {
    console.error('Error in connection DB');
    console.error(error.message);
    console.error('If you are using MongoDB Atlas, make sure your current IP is whitelisted in Atlas > Network Access.');
  }
};

export default connectDB;