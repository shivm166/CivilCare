// frontend/src/pages/dashboard/User/Complaints/RaiseComplaintPage.jsx (MODIFIED)

import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  X,
  Zap,
  Wrench,
  ChevronRight,
} from "lucide-react";

import {
  useCreateComplaint,
  useGetMyComplaints,
} from "../../../../hooks/api/useComplaints";
import { Link } from "react-router-dom";
import StatusBadge from "../../../../components/common/StatusBadge/StatusBadge";

export default function RaiseComplaintPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [showToast, setShowToast] = useState(false);

  const { createComplaint, isCreating } = useCreateComplaint();
  const { data: complaints = [], isLoading, error } = useGetMyComplaints();

  // Auto-hide toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;

    createComplaint(form, {
      onSuccess: () => {
        setForm({ title: "", description: "", priority: "medium" });
        setShowToast(true);
      },
    });
  };

  // COLORS (Kept minimal for select border/text, main styling handled by StatusBadge)
  const prioritySelectColors = {
    high: "text-red-700 border-red-400",
    medium: "text-amber-700 border-amber-400",
    low: "text-green-700 border-green-400",
  };

  const getPriorityBorder = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-500";
      case "medium":
        return "border-amber-500";
      case "low":
        return "border-green-500";
      default:
        return "border-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOAST MESSAGE (Existing implementation retained) */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-white rounded-xl shadow-2xl border-2 border-green-400 p-4 pr-12 min-w-[320px] relative overflow-hidden">
            <div className="relative flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-bold text-gray-900 mb-1">
                  Complaint Submitted!
                </h4>
                <p className="text-sm text-gray-600">
                  We'll notify you on status change.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowToast(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Custom Animations (Existing implementation retained) */}
      <style>{`
        @keyframes slide-in { 
          from { transform: translateX(400px); opacity: 0; } 
          to { transform: translateX(0); opacity: 1; } 
        }
        .animate-slide-in { animation: slide-in 0.4s ease-out; }
      `}</style>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* HEADER */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Raise & Track Issues
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Submit your concerns and monitor their progress in real-time.
          </p>
        </div>

        {/* COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* COLUMN 1: NEW COMPLAINT FORM (Sticky Left Column on Desktop) */}
          <div className="lg:col-span-1 h-fit lg:sticky lg:top-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6" />
                New Complaint
              </h2>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Brief summary of the issue"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-colors outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Detailed information and location"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none transition-colors outline-none"
                  ></textarea>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority Level
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                    // Use the modified style for the select input itself
                    className={`w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 transition-colors outline-none font-semibold ${
                      prioritySelectColors[form.priority]
                    } border-2`}
                  >
                    <option className="text-red-600" value="high">
                      🔴 High (Urgent)
                    </option>
                    <option className="text-amber-600" value="medium">
                      🟡 Medium (Standard)
                    </option>
                    <option className="text-green-600" value="low">
                      🟢 Low (Non-urgent)
                    </option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isCreating || !form.title || !form.description}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl"
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Complaint
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* COLUMN 2: COMPLAINT LIST (Right Column on Desktop) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Wrench className="w-6 h-6" />
                My Submitted Issues
              </h2>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-medium text-white">
                {complaints.length} Total
              </span>
            </div>

            <div className="p-4 sm:p-6">
              {/* Loading & Error */}
              {(isLoading || error) && (
                <div className="text-center py-12">
                  {isLoading ? (
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  ) : (
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                  )}
                  <p className="text-gray-600 font-medium">
                    {isLoading ? "Loading..." : "Failed to load complaints."}
                  </p>
                </div>
              )}

              {/* No Data */}
              {!isLoading && !error && complaints.length === 0 && (
                <div className="text-center py-12">
                  <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No complaints raised yet</p>
                </div>
              )}

              {/* List (Uses new row structure) */}
              <div className="space-y-3 lg:space-y-0 lg:divide-y lg:divide-gray-100">
                {complaints.map((c) => {
                  const priorityClass = getPriorityBorder(c.priority);

                  return (
                    // Complaint Row (Desktop: grid, Mobile: stacked with border)
                    <div
                      key={c._id}
                      className={`relative flex flex-col lg:grid lg:grid-cols-[1fr_200px_100px] lg:gap-4 p-3 sm:p-4 bg-gray-50 lg:bg-white rounded-lg lg:rounded-none border-l-4 ${priorityClass} lg:border-l-0 lg:border-r-0 lg:border-t-0 border-r border-b border-gray-200 lg:border-none hover:bg-gray-100 transition-colors`}
                    >
                      {/* Mobile Top Bar / Priority Color Bar */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1.5 ${priorityClass} lg:hidden rounded-l-lg`}
                      ></div>

                      {/* Column 1: Title & Description */}
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-semibold text-gray-900 text-sm sm:text-base mb-1 line-clamp-1">
                          {c.title}
                        </p>
                        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
                          {c.description}
                        </p>
                      </div>

                      {/* Column 2: Status & Date */}
                      <div className="flex flex-col gap-1 mt-2 lg:mt-0 lg:items-end">
                        {/* Status Badge (using new component) */}
                        <StatusBadge
                          type={c.status}
                          compact
                          isPulse={
                            c.status === "pending" || c.status === "in_progress"
                          }
                        />
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(c.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </div>

                      {/* Column 3 (Hidden on Mobile): Priority */}
                      <div className="hidden lg:flex flex-col justify-center items-end">
                        {/* Priority Badge (using new component) */}
                        <StatusBadge type={c.priority} compact />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
