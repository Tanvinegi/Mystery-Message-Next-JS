import mongoose from "mongoose";


type ConnectionObj ={
    isConnected?: number;
}

const connection: ConnectionObj = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log(
            "MongoDB is already connected. No need to connect again."
        )
        return;
    }
    try {
       const db = await mongoose.connect(process.env.MONGODB_URI|| "", {})
       connection.isConnected = db.connections[0].readyState;

       console.log("DB CONNECTED")
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); 
    }
}

export default dbConnect;