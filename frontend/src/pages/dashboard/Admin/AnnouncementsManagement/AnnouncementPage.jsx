import { useState, useEffect } from "react";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import {
  useGetAdminAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  useReplyToComment,
} from "../../../../hooks/api/useAnnouncements";
import AnnouncementForm from "../../../../components/features/announcement/adminView/AnnouncementForm";
import AnnouncementList from "../../../../components/features/announcement/adminView/AnnouncementList";

export default function AnnouncementPage() {
  const { activeSocietyId } = useSocietyContext();

  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const { data: announcements = [], isLoading } = useGetAdminAnnouncements(activeSocietyId);
  const { createAnnouncement, isCreating } = useCreateAnnouncement();
  const { updateAnnouncement, isUpdating } = useUpdateAnnouncement();
  const { deleteAnnouncement, isDeleting } = useDeleteAnnouncement();
  const { replyToComment, isReplying } = useReplyToComment();

  // Fix mobile viewport height & prevent body scroll
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    // Prevent body scroll on desktop only
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;

    if (editingId) {
      updateAnnouncement(
        { id: editingId, formData: form },
        { onSuccess: () => { setForm({ title: "", description: "" }); setEditingId(null); } }
      );
    } else {
      createAnnouncement(form, { onSuccess: () => setForm({ title: "", description: "" }) });
    }
  };

  const handleEdit = (announcement) => {
    setForm({ title: announcement.title, description: announcement.description });
    setEditingId(announcement._id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this announcement?")) {
      deleteAnnouncement(id);
    }
  };

  const handleReply = (announcementId, commentId, reply) => {
    replyToComment({ announcementId, commentId, reply });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Fixed Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              📢 Announcements
            </h1>
            <p className="text-gray-600 text-xs mt-1">Manage society announcements</p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 space-y-4">
          {/* Form */}
          <AnnouncementForm
            form={form}
            setForm={setForm}
            editingId={editingId}
            setEditingId={setEditingId}
            handleSubmit={handleSubmit}
            isCreating={isCreating}
            isUpdating={isUpdating}
            announcements={announcements}
          />

          {/* Announcements */}
          <div>
            <AnnouncementList
              announcements={announcements}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleReply={handleReply}
              isDeleting={isDeleting}
              isReplying={isReplying}
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div 
        className="hidden lg:flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden"
        style={{ height: 'calc(var(--vh, 1vh) * 100)' }}
      >
        {/* Fixed Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  📢 Announcements
                </h1>
                <p className="text-gray-600 text-sm mt-1">Manage society announcements</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
                  {announcements.length} Total
                </span>
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg font-medium">
                  {announcements.filter((a) => a.comments?.length > 0).length} Commented
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          <div className="max-w-7xl mx-auto px-6 py-6 h-full">
            <div className="flex gap-6 h-full">
              {/* Left Sidebar - Fixed */}
              <aside className="w-80 flex-shrink-0">
                <AnnouncementForm
                  form={form}
                  setForm={setForm}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  handleSubmit={handleSubmit}
                  isCreating={isCreating}
                  isUpdating={isUpdating}
                  announcements={announcements}
                />
              </aside>

              {/* Right Content - Scrollable */}
              <main className="flex-1 min-w-0 min-h-0 h-full">
                <AnnouncementList
                  announcements={announcements}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleReply={handleReply}
                  isDeleting={isDeleting}
                  isReplying={isReplying}
                />
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
