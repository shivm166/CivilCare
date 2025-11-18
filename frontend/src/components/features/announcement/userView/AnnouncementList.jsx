import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import AnnouncementCard from "./AnnouncementCard";

export default function AnnouncementList({
  announcements = [],
  onAddComment,
  isCommenting,
}) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [commentForm, setCommentForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Filter and sort announcements
  const filteredAnnouncements = announcements
    .filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterType === "recent") {
        return matchesSearch; // Will slice later to get top 3
      }
      if (filterType === "commented") {
        return matchesSearch && a.comments?.length > 0;
      }
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, filterType === "recent" ? 3 : undefined); // Show only 3 most recent

  const handleToggleExpand = (id) => {
    setSelectedAnnouncement(selectedAnnouncement === id ? null : id);
  };

  const handleCommentChange = (announcementId, value) => {
    setCommentForm({ ...commentForm, [announcementId]: value });
  };

  const handleAddComment = (announcementId) => {
    const comment = commentForm[announcementId];
    if (!comment?.trim()) return;

    onAddComment(announcementId, comment);
    setCommentForm({ ...commentForm, [announcementId]: "" });
  };

  return (
    <div className="lg:flex lg:flex-col lg:h-full">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4 lg:flex-shrink-0">
        <div className="space-y-2 sm:space-y-0 sm:flex sm:gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-xs sm:text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["all", "recent", "commented"].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all capitalize ${
                  filterType === filter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements - Scrollable on Desktop */}
      <div className="lg:flex-1 lg:overflow-y-auto lg:pr-2 lg:min-h-0">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
            <p className="text-gray-500 text-sm sm:text-base">
              {searchTerm ? "No matching announcements" : "No announcements yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 lg:pb-4">
            {filteredAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id}
                announcement={announcement}
                isExpanded={selectedAnnouncement === announcement._id}
                onToggleExpand={handleToggleExpand}
                commentForm={commentForm[announcement._id]}
                onCommentChange={handleCommentChange}
                onAddComment={handleAddComment}
                isCommenting={isCommenting}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
