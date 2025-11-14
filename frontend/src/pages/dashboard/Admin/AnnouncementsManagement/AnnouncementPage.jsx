import { useState } from "react";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import {
  useGetAdminAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  useReplyToComment,
} from "../../../../hooks/api/useAnnouncements";

export default function AnnouncementPage() {
  const { activeSocietyId } = useSocietyContext();

  // State
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [replyForm, setReplyForm] = useState({});

  // Hooks
  const { data: announcements, isLoading } = useGetAdminAnnouncements(activeSocietyId);
  const { createAnnouncement, isCreating } = useCreateAnnouncement();
  const { updateAnnouncement, isUpdating } = useUpdateAnnouncement();
  const { deleteAnnouncement, isDeleting } = useDeleteAnnouncement();
  const { replyToComment, isReplying } = useReplyToComment();

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;

    if (editingId) {
      updateAnnouncement(
        { id: editingId, formData: form },
        {
          onSuccess: () => {
            setForm({ title: "", description: "" });
            setEditingId(null);
          },
        }
      );
    } else {
      createAnnouncement(form, {
        onSuccess: () => {
          setForm({ title: "", description: "" });
        },
      });
    }
  };

  const handleEdit = (announcement) => {
    setForm({ title: announcement.title, description: announcement.description });
    setEditingId(announcement._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      deleteAnnouncement(id);
    }
  };

  const handleReply = (announcementId, commentId) => {
    const reply = replyForm[commentId];
    if (!reply || reply.trim() === "") return;

    replyToComment(
      { announcementId, commentId, reply },
      {
        onSuccess: () => {
          setReplyForm({ ...replyForm, [commentId]: "" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-lg text-gray-600">Loading announcements...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📢 Announcement Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create and manage announcements for your society
          </p>
        </div>

        {/* Create/Edit Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {editingId ? "✏️ Edit Announcement" : "➕ Create New Announcement"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter announcement title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                rows="4"
                placeholder="Enter announcement description"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
              >
                {editingId
                  ? isUpdating
                    ? "Updating..."
                    : "Update"
                  : isCreating
                  ? "Creating..."
                  : "Create"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm({ title: "", description: "" });
                    setEditingId(null);
                  }}
                  className="px-6 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {!announcements || announcements.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <p className="text-gray-500 text-lg">
                No announcements yet. Create your first one!
              </p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition"
              >
                {/* Announcement Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {announcement.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {announcement.description}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Posted on {new Date(announcement.createdAt).toLocaleDateString()} at{" "}
                      {new Date(announcement.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        setSelectedAnnouncement(
                          selectedAnnouncement?._id === announcement._id
                            ? null
                            : announcement
                        )
                      }
                      className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition"
                    >
                      {selectedAnnouncement?._id === announcement._id
                        ? "Hide"
                        : `💬 ${announcement.comments?.length || 0}`}
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {selectedAnnouncement?._id === announcement._id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      💬 Comments ({announcement.comments?.length || 0})
                    </h4>
                    {announcement.comments?.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        No comments yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {announcement.comments.map((comment) => (
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
                            <p className="text-gray-700 mb-3">{comment.comment}</p>

                            {/* Admin Reply */}
                            {comment.adminReply ? (
                              <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                                <p className="text-sm font-semibold text-blue-700 mb-1">
                                  Admin Reply:
                                </p>
                                <p className="text-gray-700">{comment.adminReply}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Replied on{" "}
                                  {new Date(comment.repliedAt).toLocaleString()}
                                </p>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={replyForm[comment._id] || ""}
                                  onChange={(e) =>
                                    setReplyForm({
                                      ...replyForm,
                                      [comment._id]: e.target.value,
                                    })
                                  }
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Type your reply..."
                                />
                                <button
                                  onClick={() =>
                                    handleReply(announcement._id, comment._id)
                                  }
                                  disabled={isReplying}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                  Reply
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
