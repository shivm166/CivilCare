import { useState } from "react";
import { FiMessageSquare, FiClock, FiChevronDown, FiChevronUp, FiSend } from "react-icons/fi";

export default function AnnouncementCard({
  announcement,
  isExpanded,
  onToggleExpand,
  commentForm,
  onCommentChange,
  onAddComment,
  isCommenting,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all">
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2">
            {announcement.title}
          </h3>
          <p className={`text-xs sm:text-sm text-gray-600 leading-relaxed ${!isExpanded ? 'line-clamp-2 sm:line-clamp-none' : ''}`}>
            {announcement.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <FiClock className="flex-shrink-0" />
            <span className="hidden sm:inline">
              {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              at{" "}
              {new Date(announcement.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="sm:hidden">
              {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </span>
          <button
            onClick={() => onToggleExpand(announcement._id)}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all font-medium"
          >
            <FiMessageSquare className="flex-shrink-0" />
            {announcement.comments?.length || 0}
            <span className="hidden sm:inline">Comments</span>
            {isExpanded ? <FiChevronUp className="flex-shrink-0" /> : <FiChevronDown className="flex-shrink-0" />}
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4 sm:p-5 bg-gray-50">
          {/* Add Comment Form */}
          <div className="mb-4 sm:mb-5">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
              Add Comment
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={commentForm || ""}
                onChange={(e) => onCommentChange(announcement._id, e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && onAddComment(announcement._id)}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Share your thoughts..."
              />
              <button
                onClick={() => onAddComment(announcement._id)}
                disabled={isCommenting}
                className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <FiSend className="text-sm" />
                <span className="hidden sm:inline">{isCommenting ? "Posting..." : "Post"}</span>
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-800">
              All Comments ({announcement.comments?.length || 0})
            </h4>
            {announcement.comments?.length === 0 ? (
              <p className="text-gray-500 text-xs sm:text-sm text-center py-4 sm:py-6">
                No comments yet. Be the first!
              </p>
            ) : (
              announcement.comments.map((comment) => (
                <div key={comment._id} className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                  <div className="flex items-start gap-2 sm:gap-3 mb-2">
                    <div className="w-7 h-7 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                      {comment.user?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                        {comment.user?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mb-2 break-words">
                    {comment.comment}
                  </p>

                  {comment.adminReply && (
                    <div className="bg-blue-50 rounded-lg p-2 sm:p-3 border-l-4 border-blue-500">
                      <p className="text-xs font-semibold text-blue-700 mb-1">Admin Reply:</p>
                      <p className="text-xs sm:text-sm text-gray-700">{comment.adminReply}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment.repliedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
