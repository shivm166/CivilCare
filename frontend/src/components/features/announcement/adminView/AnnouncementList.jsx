import { useState } from "react";
import { FiEdit2, FiTrash2, FiMessageSquare, FiClock, FiSearch, FiSend } from "react-icons/fi";

export default function AnnouncementList({
  announcements = [],
  handleEdit,
  handleDelete,
  handleReply,
  isDeleting,
  isReplying,
}) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [replyForm, setReplyForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredAnnouncements = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "recent") {
      return matchesSearch;
    }
    if (filterType === "commented") {
      return matchesSearch && a.comments?.length > 0;
    }
    return matchesSearch;
  })
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, filterType === "recent" ? 3 : undefined);

  const onReply = (announcementId, commentId) => {
    const reply = replyForm[commentId];
    if (!reply?.trim()) return;

    handleReply(announcementId, commentId, reply);
    setReplyForm({ ...replyForm, [commentId]: "" });
  };

  return (
    <div className="lg:flex lg:flex-col lg:h-full">
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4 lg:flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["all", "recent", "commented"].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`flex-1 sm:flex-none px-3 py-2 text-xs font-medium rounded-lg transition-all capitalize ${
                  filterType === filter
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements - Mobile: normal flow, Desktop: scrollable */}
      <div className="lg:flex-1 lg:overflow-y-auto lg:pr-2 lg:min-h-0">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 sm:p-12 text-center">
            <p className="text-gray-500 text-sm sm:text-base">
              {searchTerm ? "No announcements match your search" : "No announcements yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 lg:pb-4">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 break-words">
                        {announcement.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">
                        {announcement.description}
                      </p>
                    </div>
                    <div className="flex gap-1 sm:gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <FiEdit2 className="text-xs sm:text-sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(announcement._id)}
                        disabled={isDeleting}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        title="Delete"
                      >
                        <FiTrash2 className="text-xs sm:text-sm" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiClock className="flex-shrink-0" />
                      <span className="hidden sm:inline">
                        {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
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
                      onClick={() =>
                        setSelectedAnnouncement(
                          selectedAnnouncement?._id === announcement._id ? null : announcement
                        )
                      }
                      className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-all font-medium"
                    >
                      <FiMessageSquare className="flex-shrink-0" />
                      {announcement.comments?.length || 0}
                      <span className="hidden sm:inline">Comments</span>
                    </button>
                  </div>

                  {selectedAnnouncement?._id === announcement._id && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                        <FiMessageSquare />
                        Comments ({announcement.comments?.length || 0})
                      </h4>

                      {announcement.comments?.length === 0 ? (
                        <p className="text-gray-500 text-xs sm:text-sm text-center py-4 sm:py-6">No comments yet</p>
                      ) : (
                        <div className="space-y-2 sm:space-y-3">
                          {announcement.comments.map((comment) => (
                            <div key={comment._id} className="bg-gray-50 rounded-lg p-2.5 sm:p-3 border border-gray-200">
                              <div className="flex items-start gap-2 mb-2">
                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                  {comment.user?.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                    {comment.user?.name || "Unknown"}
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
                              <p className="text-xs sm:text-sm text-gray-700 mb-2 break-words">{comment.comment}</p>

                              {comment.adminReply ? (
                                <div className="bg-indigo-50 rounded-lg p-2 sm:p-2.5 border-l-4 border-indigo-500">
                                  <p className="text-xs font-semibold text-indigo-700 mb-1">Admin Reply:</p>
                                  <p className="text-xs sm:text-sm text-gray-700 break-words">{comment.adminReply}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(comment.repliedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex gap-2 mt-2">
                                  <input
                                    type="text"
                                    value={replyForm[comment._id] || ""}
                                    onChange={(e) =>
                                      setReplyForm({ ...replyForm, [comment._id]: e.target.value })
                                    }
                                    className="flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                    placeholder="Type reply..."
                                  />
                                  <button
                                    onClick={() => onReply(announcement._id, comment._id)}
                                    disabled={isReplying}
                                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-1.5"
                                  >
                                    <FiSend className="text-xs sm:text-sm" />
                                    <span className="hidden sm:inline text-xs sm:text-sm">Reply</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
