import mongoose from "mongoose";

 const connectDB = async () => {
    try {

        const db = await mongoose.connect(process.env.MOGNODB_URL)
        console.log('DB connected successfully!!')
        
    } catch (error) {

        console.error('Error in connection DB', error)
        
    }
}

export default connectDB;