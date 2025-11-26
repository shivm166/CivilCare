import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  X,
  Zap,
} from "lucide-react";

import {
  useCreateComplaint,
  useGetMyComplaints,
} from "../../../../hooks/api/useComplaints";

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

  // COLORS
  const priorityColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };

  // Status configs
  const statusConfigs = {
    pending: {
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      icon: <Clock className="w-4 h-4" />,
    },
    in_progress: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: <Zap className="w-4 h-4" />,
    },
    resolved: {
      color: "bg-green-100 text-green-700 border-green-200",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    closed: {
      color: "bg-gray-100 text-gray-700 border-gray-200",
      icon: <X className="w-4 h-4" />,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      {/* TOAST MESSAGE (Improved Design) */}
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

      {/* Custom Animations */}
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
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            Raise & Track Complaints
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Submit your concerns and monitor their progress in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* FORM CARD */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden h-fit sticky top-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6" />
                New Complaint
              </h2>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Brief summary of the issue (e.g., Leaking tap in bathroom)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 transition-colors"
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
                  placeholder="Detailed information, location, and photos (optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none transition-colors"
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
                  className={`w-full px-4 py-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-colors ${
                    priorityColors[form.priority]
                  }`}
                >
                  <option className="bg-white text-red-600" value="high">
                    🔴 High (Urgent)
                  </option>
                  <option className="bg-white text-amber-600" value="medium">
                    🟡 Medium (Standard)
                  </option>
                  <option className="bg-white text-green-600" value="low">
                    🟢 Low (Non-urgent)
                  </option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isCreating || !form.title || !form.description}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl"
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
            </div>
          </div>

          {/* COMPLAINT LIST */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden h-fit">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Your Complaints
                </span>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-medium">
                  {complaints.length} Total
                </span>
              </h2>
            </div>

            <div className="p-6 sm:p-8">
              {/* Loading */}
              {isLoading && (
                <div className="flex flex-col items-center py-12">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading...</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-600 text-sm">
                    Failed to load complaints.
                  </p>
                </div>
              )}

              {/* No Data */}
              {!isLoading && !error && complaints.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No complaints raised yet</p>
                </div>
              )}

              {/* List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {complaints.map((c) => {
                  const status = statusConfigs[c.status] || {
                    color: "bg-gray-100 text-gray-700 border-gray-200",
                    icon: <AlertCircle className="w-4 h-4" />,
                  };
                  const priorityClass =
                    priorityColors[c.priority] ||
                    "bg-gray-100 text-gray-700 border-gray-200";

                  return (
                    <div
                      key={c._id}
                      className="border-2 border-gray-100 rounded-xl p-4 sm:p-5 hover:shadow-md transition bg-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg flex-1">
                          {c.title}
                        </h3>

                        {/* Priority Tag */}
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${priorityClass}`}
                        >
                          {c.priority?.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {c.description}
                      </p>

                      {/* Status + Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${status.color}`}
                        >
                          {status.icon}
                          {c.status?.replace(/[_-]/g, " ").toUpperCase()}
                        </div>

                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {c.createdAt &&
                            new Date(c.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                        </div>
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
