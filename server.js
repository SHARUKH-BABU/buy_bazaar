const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRout.js");
const cors = require("cors");
const categoryRoutes = require("./routes/categoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const path = require("path");
// Configure env
dotenv.config();

// Database config
connectDB();

// Rest object
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"))
app.use(express.static(path.join(__dirname, "/client/build")))
// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

// Rest API
app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build/index.html"))
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`server is running at : localhost:${PORT}`.bgBlue.white);
});
