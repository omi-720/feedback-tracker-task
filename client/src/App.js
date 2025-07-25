import React, { useState, useEffect } from "react";
import { api } from "./service/api";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import Stats from "./components/Stats";
import Alert from "./components/Alert";

const FeedbackTracker = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.fetchFeedback();
      setFeedbackList(response.data || []);
      setError("");
    } catch (err) {
      setError(
        "Failed to load feedback. Please check if the backend server is running."
      );
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (formData) => {
    try {
      setLoading(true);
      const response = await api.submitFeedback(formData);
      setSuccess("Feedback submitted successfully!");
      await fetchFeedback();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id, action) => {
    try {
      setLoading(true);
      await api.voteFeedback(id, action);
      await fetchFeedback();
    } catch (err) {
      setError("Failed to vote. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteFeedback(id);
      await fetchFeedback();
      setSuccess("Feedback deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete feedback. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Feedback Tracker
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Share your thoughts, vote on feedback, and help us improve together.
            Your voice matters in building a better experience for everyone.
          </p>
        </div>

        {/* Alerts */}
        <Alert type="error" message={error} onClose={() => setError("")} />
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />

        {/* Stats */}
        <Stats feedbackList={feedbackList} />

        {/* Feedback Form */}
        <FeedbackForm onSubmit={handleSubmitFeedback} loading={loading} />

        {/* Feedback List */}
        <FeedbackList
          feedbackList={feedbackList}
          onVote={handleVote}
          onDelete={handleDelete}
          onRefresh={fetchFeedback}
          loading={loading}
        />

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500">
          <p>&copy; 2025 Feedback Tracker. Built with React & Node.js</p>
        </footer>
      </div>
    </div>
  );
};

export default FeedbackTracker;
