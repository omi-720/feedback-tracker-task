import React, { useState, useEffect } from "react";
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  MessageSquare,
  Users,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

// API Service
const api = {
  async fetchFeedback() {
    const response = await fetch(`${API_BASE_URL}/feedback`);
    if (!response.ok) throw new Error("Failed to fetch feedback");
    return response.json();
  },

  async submitFeedback(feedback) {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to submit feedback");
    }
    return response.json();
  },

  async voteFeedback(id, action) {
    const response = await fetch(`${API_BASE_URL}/feedback/${id}/vote`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (!response.ok) throw new Error("Failed to vote");
    return response.json();
  },

  async deleteFeedback(id) {
    const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete feedback");
    return response.json();
  },
};

// Feedback Form Component
const FeedbackForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-xl">
          <MessageSquare className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Share Your Feedback
        </h2>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${
                errors.name
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none ${
                errors.email
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-colors focus:outline-none resize-none ${
              errors.message
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-blue-500"
            }`}
            placeholder="Share your thoughts, suggestions, or feedback..."
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
          <p className="text-gray-500 text-sm mt-1">
            {formData.message.length}/500 characters
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
};

// Feedback Item Component
const FeedbackItem = ({ feedback, onVote, onDelete, loading }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      setIsDeleting(true);
      await onDelete(feedback.id);
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800 mb-1">
            {feedback.name}
          </h3>
          <p className="text-gray-500 text-sm">{feedback.email}</p>
          <p className="text-gray-400 text-xs mt-1">
            {formatDate(feedback.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              feedback.votes > 0
                ? "bg-green-100 text-green-700"
                : feedback.votes < 0
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {feedback.votes > 0 ? "+" : ""}
            {feedback.votes}
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">{feedback.message}</p>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => onVote(feedback.id, "upvote")}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            <ThumbsUp className="w-4 h-4" />
            Upvote
          </button>

          <button
            onClick={() => onVote(feedback.id, "downvote")}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <ThumbsDown className="w-4 h-4" />
            Downvote
          </button>
        </div>

        <button
          onClick={handleDelete}
          disabled={loading || isDeleting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

// Stats Component
const Stats = ({ feedbackList }) => {
  const totalFeedback = feedbackList.length;
  const totalVotes = feedbackList.reduce((sum, item) => sum + item.votes, 0);
  const avgVotes =
    totalFeedback > 0 ? (totalVotes / totalFeedback).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-blue-100 text-sm">Total Feedback</p>
            <p className="text-3xl font-bold">{totalFeedback}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-green-100 text-sm">Total Votes</p>
            <p className="text-3xl font-bold">{totalVotes}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-purple-100 text-sm">Avg. Rating</p>
            <p className="text-3xl font-bold">{avgVotes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {success}
          </div>
        )}

        {/* Stats */}
        <Stats feedbackList={feedbackList} />

        {/* Feedback Form */}
        <FeedbackForm onSubmit={handleSubmitFeedback} loading={loading} />

        {/* Feedback List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Feedback
            </h2>
            <button
              onClick={fetchFeedback}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {loading && feedbackList.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-4" />
              <p className="text-gray-500">Loading feedback...</p>
            </div>
          ) : feedbackList.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Feedback Yet
              </h3>
              <p className="text-gray-500">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {feedbackList.map((feedback) => (
                <FeedbackItem
                  key={feedback.id}
                  feedback={feedback}
                  onVote={handleVote}
                  onDelete={handleDelete}
                  loading={loading}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500">
          <p>&copy; 2025 Feedback Tracker. Built with React & Node.js</p>
        </footer>
      </div>
    </div>
  );
};

export default FeedbackTracker;
