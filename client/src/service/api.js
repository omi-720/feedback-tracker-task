const API_BASE_URL = "http://localhost:5000";

// API Service
export const api = {
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
