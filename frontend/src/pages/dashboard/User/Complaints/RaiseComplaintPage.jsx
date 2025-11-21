import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  X,
  Zap,
  Loader2,
} from "lucide-react";
import {
  useCreateComplaint,
  useGetMyComplaints,
} from "../../../../hooks/api/useComplaints";
import toast from "react-hot-toast";

const STATUS_MAP = {
  pending: {
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Clock className="w-4 h-4" />,
  },
  in_progress: {
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  resolved: {
    color: "bg-green-100 text-green-700 border-green-200",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  closed: {
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: <X className="w-4 h-4" />,
  },
  high: {
    priorityColor: "bg-red-500 text-white border-red-600",
    icon: <Zap className="w-3 h-3" />,
  },
  medium: {
    priorityColor: "bg-amber-400 text-white border-amber-500",
    icon: <AlertCircle className="w-3 h-3" />,
  },
  low: {
    priorityColor: "bg-green-500 text-white border-green-600",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
};

export default function RaiseComplaintPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const { createComplaint, isCreating } = useCreateComplaint();
  const { data: complaints = [], isLoading, error } = useGetMyComplaints();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error("Title and description are required.");
      return;
    }

    createComplaint(form, {
      onSuccess: () => {
        setForm({ title: "", description: "", priority: "medium" });
        toast.success("Complaint submitted! We'll look into it shortly.");
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Failed to submit complaint."
        );
      },
    });
  };

  const complaintsList = Array.isArray(complaints) ? complaints : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden lg:h-full lg:sticky lg:top-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6" />
                New Complaint
              </h2>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Form elements condensed */}
              {["title", "description"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                    {field} <span className="text-red-500">*</span>
                  </label>
                  {field === "description" ? (
                    <textarea
                      rows={5}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Detailed information"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 resize-none outline-none transition-all"
                    />
                  ) : (
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="Brief summary"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 outline-none transition-all"
                    />
                  )}
                </div>
              ))}

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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/50 hover:shadow-xl"
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
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-pink-600 px-6 py-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Your Complaints
                </span>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {complaintsList.length}
                </span>
              </h2>
            </div>

            <div className="p-6 sm:p-8">
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
              {!error && complaintsList.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No complaints yet</p>
                </div>
              )}

              {/* List */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {complaintsList.map((c) => {
                  const status = STATUS_MAP[c.status.replace(/-/g, "_")] || {
                    color: "bg-gray-100 text-gray-700 border-gray-200",
                    icon: <AlertCircle className="w-4 h-4" />,
                  };
                  const priority = STATUS_MAP[c.priority] || {};

                  return (
                    <div
                      key={c._id}
                      className="border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-lg transition bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg flex-1">
                          {c.title}
                        </h3>

                        {/* Priority Tag - Enhanced style */}
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${priority.priorityColor} shadow-md border`}
                        >
                          {priority.icon}
                          {c.priority?.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {c.description}
                      </p>

                      {/* Status + Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-200">
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${status.color} text-xs font-semibold`}
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
