import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  X,
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
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  // Support multiple status values safely
  const statusConfigs = {
    pending: {
      color: "bg-blue-100 text-blue-700",
      icon: <Clock className="w-4 h-4" />,
    },
    in_progress: {
      color: "bg-purple-100 text-purple-700",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    "in-progress": {
      color: "bg-purple-100 text-purple-700",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    resolved: {
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    closed: {
      color: "bg-gray-100 text-gray-700",
      icon: <X className="w-4 h-4" />,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* TOAST MESSAGE */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-white rounded-xl shadow-2xl border border-green-200 p-4 pr-12 min-w-[320px] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-50"></div>
            <div className="relative flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-bold text-gray-900 mb-1">Success!</h4>
                <p className="text-sm text-gray-600">
                  Your complaint has been submitted successfully.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowToast(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-200">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 animate-progress"></div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes slide-in { 
          from { transform: translateX(400px); opacity: 0; } 
          to { transform: translateX(0); opacity: 1; } 
        }
        @keyframes progress { 
          from { width: 100%; } 
          to { width: 0%; } 
        }
        .animate-slide-in { animation: slide-in 0.4s ease-out; }
        .animate-progress { animation: progress 5s linear; }
      `}</style>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* HEADER */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Raise & Track Complaints
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Submit your concerns and monitor their progress in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* FORM CARD */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
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
                  placeholder="Brief summary"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
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
                  placeholder="Detailed information"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isCreating || !form.title || !form.description}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
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
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Your Complaints
                </span>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {complaints.length}
                </span>
              </h2>
            </div>

            <div className="p-6 sm:p-8">
              {/* Loading */}
              {isLoading && (
                <div className="flex flex-col items-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
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
                  <p className="text-gray-600">No complaints yet</p>
                </div>
              )}

              {/* List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {complaints.map((c) => {
                  // safe status config with fallback
                  const status = statusConfigs[c.status] || {
                    color: "bg-gray-100 text-gray-700",
                    icon: <AlertCircle className="w-4 h-4" />,
                  };

                  return (
                    <div
                      key={c._id}
                      className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md transition bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg flex-1">
                          {c.title}
                        </h3>

                        {/* Priority Tag */}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            priorityColors[c.priority] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {c.priority?.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">
                        {c.description}
                      </p>

                      {/* Status + Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-200">
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${status.color} text-xs font-semibold`}
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
