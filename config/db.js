const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database connected: ${conn.connection.host}`.bgMagenta.white);
    } catch (err) {
        console.log(err.message);
        console.log(`Error occurred during database connectivity`.bgRed.white);
    }
};

module.exports = connectDB;
