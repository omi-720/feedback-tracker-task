const express = require("express");
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data storage configuration
const DATA_FILE = path.join(__dirname, "feedback.json");

// In-memory storage as fallback
let feedbackData = [];

// Initialize data storage
const initializeData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    feedbackData = JSON.parse(data);
    console.log("Loaded existing feedback data");
  } catch (error) {
    console.log("No existing data file found, starting with empty array");
    feedbackData = [];
    await saveDataToFile();
  }
};

// Save data to JSON file
const saveDataToFile = async () => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(feedbackData, null, 2));
  } catch (error) {
    console.error("Error saving data to file:", error);
  }
};

// Validation middleware
const validateFeedback = (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Name is required and must be a non-empty string" });
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res
      .status(400)
      .json({ error: "Message is required and must be a non-empty string" });
  }

  next();
};

// Routes

// GET /feedback - Fetch all feedback
app.get("/feedback", (req, res) => {
  try {
    // Sort by votes (descending) and then by creation date
    const sortedFeedback = [...feedbackData].sort((a, b) => {
      if (b.votes !== a.votes) {
        return b.votes - a.votes;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({
      success: true,
      data: sortedFeedback,
      count: sortedFeedback.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch feedback",
      message: error.message,
    });
  }
});

// POST /feedback - Submit new feedback
app.post("/feedback", validateFeedback, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newFeedback = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      votes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    feedbackData.push(newFeedback);
    await saveDataToFile();

    res.status(201).json({
      success: true,
      data: newFeedback,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to submit feedback",
      message: error.message,
    });
  }
});

// PUT /feedback/:id/vote - Upvote or downvote feedback
app.put("/feedback/:id/vote", (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'upvote' or 'downvote'

    if (!action || !["upvote", "downvote"].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Action must be either "upvote" or "downvote"',
      });
    }

    const feedbackIndex = feedbackData.findIndex((item) => item.id === id);

    if (feedbackIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Feedback not found",
      });
    }

    const feedback = feedbackData[feedbackIndex];

    if (action === "upvote") {
      feedback.votes += 1;
    } else {
      feedback.votes -= 1;
    }

    feedback.updatedAt = new Date().toISOString();

    saveDataToFile();

    res.json({
      success: true,
      data: feedback,
      message: `Feedback ${action}d successfully`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update vote",
      message: error.message,
    });
  }
});

// DELETE /feedback/:id - Delete feedback
app.delete("/feedback/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const feedbackIndex = feedbackData.findIndex((item) => item.id === id);

    if (feedbackIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Feedback not found",
      });
    }

    const deletedFeedback = feedbackData.splice(feedbackIndex, 1)[0];
    await saveDataToFile();

    res.json({
      success: true,
      data: deletedFeedback,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete feedback",
      message: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Feedback Tracker API is running",
    timestamp: new Date().toISOString(),
    feedbackCount: feedbackData.length,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Start server
const startServer = async () => {
  await initializeData();
  app.listen(PORT, () => {
    console.log(`🚀 Feedback Tracker API server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 API endpoints:`);
    console.log(`   GET    /feedback`);
    console.log(`   POST   /feedback`);
    console.log(`   PUT    /feedback/:id/vote`);
    console.log(`   DELETE /feedback/:id`);
  });
};

startServer().catch(console.error);

module.exports = app;
