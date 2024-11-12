import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnectionString = process.env.DB_CONNECTION;

const connectDB = async () => {
    try {
        await mongoose.connect(dbConnectionString);
        console.log('Connected to MongoDB Atlas successfully');
    } catch (error) {
        console.log(`Error connecting to MongoDB Atlas: ${error}`);
    }
};

export default connectDB;
