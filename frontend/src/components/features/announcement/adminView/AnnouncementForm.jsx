import { FiEdit2 } from "react-icons/fi";

export default function AnnouncementForm({
  form,
  setForm,
  editingId,
  setEditingId,
  handleSubmit,
  isCreating,
  isUpdating,
  announcements = [],
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            {editingId ? <><FiEdit2 /> Edit</> : <>➕ Create</>}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="Announcement title"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-none"
              rows="5"
              placeholder="Write description..."
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-60 shadow-lg shadow-indigo-500/30"
            >
              {editingId ? (isUpdating ? "Updating..." : "Update") : (isCreating ? "Creating..." : "Create")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm({ title: "", description: "" });
                  setEditingId(null);
                }}
                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Announcements</span>
            <span className="font-semibold text-gray-900">{announcements.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Comments</span>
            <span className="font-semibold text-gray-900">
              {announcements.reduce((sum, a) => sum + (a.comments?.length || 0), 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">This Week</span>
            <span className="font-semibold text-gray-900">
              {announcements.filter(a => new Date(a.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
