import React from "react";
import { MessageSquare, RefreshCw } from "lucide-react";
import FeedbackItem from "./FeedbackItem";

const FeedbackList = ({
  feedbackList,
  onVote,
  onDelete,
  onRefresh,
  loading,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Recent Feedback</h2>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
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
          <p className="text-gray-500">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {feedbackList.map((feedback) => (
            <FeedbackItem
              key={feedback.id}
              feedback={feedback}
              onVote={onVote}
              onDelete={onDelete}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
