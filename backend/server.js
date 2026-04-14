const express = require("express");

const connectDB = require("./config/db");

const clientRoutes = require("./routes/clientRoutes");
const projectRoutes = require("./routes/projectRoutes");
const vendorRoutes = require("./routes/vendorRoutes");


const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: "https://fullstack-frontend-4-ym5y.onrender.com" }));
app.use(express.json());

// Static
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/vendors", vendorRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API running...");
});

// Server
app.listen(5000, () => {
  console.log("Server running on 5000");
});