const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const memberRoutes = require("./routes/memberRoutes");
const { sendFeeReminders } = require("./utils/reminder");
const path = require("path");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error", err));

// API routes
app.use("/api/members", memberRoutes);

// Manual trigger route
app.post("/send-reminders", async (req, res) => {
  try {
    await sendFeeReminders();
    console.log("✅ Reminders sent via manual trigger.");
    res.status(200).json({ success: true, message: "Reminders sent successfully" });
  } catch (err) {
    console.error("❌ Reminder failed:", err.message);
    res.status(500).json({ success: false, error: "Failed to send reminders", details: err.message });
  }
});

// Only serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve frontend static files
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  // Development route
  app.get("/", (req, res) => {
    res.json({ 
      message: "Backend API is running!", 
      frontend: "http://localhost:5173" 
    });
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));