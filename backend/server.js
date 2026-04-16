const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const clientRoutes = require("./routes/clientRoutes");
const projectRoutes = require("./routes/projectRoutes");
const vendorRoutes = require("./routes/vendorRoutes");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: "https://fullstack-frontend-4-ym5y.onrender.com",
  credentials: true,
}));

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

// ✅ IMPORTANT FIX
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});