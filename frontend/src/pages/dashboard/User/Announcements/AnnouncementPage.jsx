import { useState, useEffect } from "react";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import {
  useGetUserAnnouncements,
  useAddComment,
} from "../../../../hooks/api/useAnnouncements";

export default function AnnouncementPage() {
  const { activeSocietyId } = useSocietyContext();

  // State
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [commentForm, setCommentForm] = useState({});

  // Hooks
  const { data: announcements, isLoading } = useGetUserAnnouncements(activeSocietyId);
  const { addComment, isCommenting } = useAddComment();

  // ✅ UPDATED: Mark announcements as read AND trigger Sidebar update
  useEffect(() => {
    if (announcements && announcements.length > 0 && activeSocietyId) {
      const storageKey = `lastSeenAnnouncements_${activeSocietyId}`;
      localStorage.setItem(storageKey, new Date().toISOString());
      
      // ✅ Dispatch custom event to notify Sidebar
      window.dispatchEvent(new Event('announcementsRead'));
    }
  }, [announcements, activeSocietyId]);

  // Handlers
  const handleAddComment = (announcementId) => {
    const comment = commentForm[announcementId];
    if (!comment || comment.trim() === "") return;

    addComment(
      { id: announcementId, comment },
      {
        onSuccess: () => {
          setCommentForm({ ...commentForm, [announcementId]: "" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-lg text-gray-600">Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            📣 Society Announcements
          </h1>
          <p className="text-gray-600 mt-2">
            Stay updated with the latest news and announcements
          </p>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {!announcements || announcements.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <p className="text-gray-500 text-lg">
                No announcements available at the moment.
              </p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition"
              >
                {/* Announcement Content */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-3">
                    {announcement.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <p>
                      Posted on {new Date(announcement.createdAt).toLocaleDateString()} at{" "}
                      {new Date(announcement.createdAt).toLocaleTimeString()}
                    </p>
                    <button
                      onClick={() =>
                        setSelectedAnnouncement(
                          selectedAnnouncement?._id === announcement._id
                            ? null
                            : announcement
                        )
                      }
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {selectedAnnouncement?._id === announcement._id
                        ? "Hide Comments"
                        : `💬 ${announcement.comments?.length || 0} Comments`}
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {selectedAnnouncement?._id === announcement._id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    {/* Add Comment */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Add a Comment
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={commentForm[announcement._id] || ""}
                          onChange={(e) =>
                            setCommentForm({
                              ...commentForm,
                              [announcement._id]: e.target.value,
                            })
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddComment(announcement._id);
                            }
                          }}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Write your comment..."
                        />
                        <button
                          onClick={() => handleAddComment(announcement._id)}
                          disabled={isCommenting}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                        >
                          {isCommenting ? "Posting..." : "Post"}
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        All Comments ({announcement.comments?.length || 0})
                      </h4>
                      {announcement.comments?.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          No comments yet. Be the first to comment!
                        </p>
                      ) : (
                        announcement.comments.map((comment) => (
                          <div
                            key={comment._id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-semibold text-gray-800">
                                  {comment.user?.name || "Unknown User"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-2">{comment.comment}</p>

                            {/* Admin Reply */}
                            {comment.adminReply && (
                              <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500 mt-3">
                                <p className="text-sm font-semibold text-blue-700 mb-1">
                                  Admin Reply:
                                </p>
                                <p className="text-gray-700">{comment.adminReply}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Replied on{" "}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
