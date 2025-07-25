import React from "react";
import { MessageSquare, Users, TrendingUp } from "lucide-react";

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

export default Stats;
