const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://userdatabase:userdatabase@cluster0.67mcfth.mongodb.net/userdb?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        const con = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected: ${con.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;
    