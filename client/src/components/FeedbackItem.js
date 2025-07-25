import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Trash2 } from "lucide-react";

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

export default FeedbackItem;
