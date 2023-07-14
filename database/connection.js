const mongoose = require("mongoose");
require('dotenv').config()
;
const {MONGO_URI} = process.env;

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
    