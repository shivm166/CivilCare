import { useState, useEffect } from "react";
import { useSocietyContext } from "../../../../contexts/SocietyContext";
import {
  useGetUserAnnouncements,
  useAddComment,
} from "../../../../hooks/api/useAnnouncements";
import AnnouncementList from "../../../../components/features/announcement/userView/AnnouncementList";

export default function AnnouncementPage() {
  const { activeSocietyId } = useSocietyContext();

  const { data: announcements = [], isLoading } = useGetUserAnnouncements(activeSocietyId);
  const { addComment, isCommenting } = useAddComment();

  // Mark announcements as read
  useEffect(() => {
    if (announcements && announcements.length > 0 && activeSocietyId) {
      const storageKey = `lastSeenAnnouncements_${activeSocietyId}`;
      localStorage.setItem(storageKey, new Date().toISOString());
      window.dispatchEvent(new Event("announcementsRead"));
    }
  }, [announcements, activeSocietyId]);

  // Fix mobile viewport height
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  const handleAddComment = (announcementId, comment) => {
    addComment({ id: announcementId, comment });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* Sticky Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
              📣 Announcements
            </h1>
            <p className="text-gray-600 text-xs mt-1">
              {announcements.length} announcement{announcements.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <AnnouncementList
            announcements={announcements}
            onAddComment={handleAddComment}
            isCommenting={isCommenting}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div
        className="hidden lg:flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 overflow-hidden"
        style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                  📣 Society Announcements
                </h1>
                <p className="text-gray-600 text-sm mt-1">Stay updated with the latest news</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg font-medium">
                  {announcements.length} Total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          <div className="max-w-5xl mx-auto px-6 py-6 h-full">
            <AnnouncementList
              announcements={announcements}
              onAddComment={handleAddComment}
              isCommenting={isCommenting}
            />
          </div>
        </div>
      </div>
    </>
  );
}
