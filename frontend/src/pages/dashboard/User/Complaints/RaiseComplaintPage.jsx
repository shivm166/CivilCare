// frontend/src/pages/dashboard/User/Complaints/RaiseComplaintPage.jsx (REDESIGNED)

import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Send,
  X,
  Zap,
  ListTodo,
  Flame, 
  Triangle, 
  Droplet, 
} from "lucide-react";

import {
  useCreateComplaint,
  useGetMyComplaints,
} from "../../../../hooks/api/useComplaints";
import StatusBadge from "../../../../components/common/StatusBadge/StatusBadge"; // Reusing StatusBadge

const priorityOptions = [
  {
    level: "high",
    label: "High (Urgent)",
    icon: Flame,
    color: "text-red-600 bg-red-100 border-red-500",
  },
  {
    level: "medium",
    label: "Medium (Standard)",
    icon: Triangle,
    color: "text-amber-600 bg-amber-100 border-amber-500",
  },
  {
    level: "low",
    label: "Low (Non-urgent)",
    icon: Droplet,
    color: "text-green-600 bg-green-100 border-green-500",
  },
];

export default function RaiseComplaintPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [showToast, setShowToast] = useState(false);

  const { createComplaint, isCreating } = useCreateComplaint();
  const { data: complaints = [], isLoading, error } = useGetMyComplaints();

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

  const getPriorityAccentClass = (priority) => {
    switch (priority) {
      case "high":
        return "border-red-500 hover:shadow-red-200/50";
      case "medium":
        return "border-amber-500 hover:shadow-amber-200/50";
      case "low":
        return "border-green-500 hover:shadow-green-200/50";
      default:
        return "border-gray-300 hover:shadow-gray-200/50";
    }
  };

  const selectedPriority =
    priorityOptions.find((p) => p.level === form.priority) ||
    priorityOptions[1];

  return (
    <div className="min-h-screen bg-gray-50">
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

            <button
              onClick={() => setShowToast(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in { 
          from { transform: translateX(400px); opacity: 0; } 
          to { transform: translateX(0); opacity: 1; } 
        }
        .animate-slide-in { animation: slide-in 0.4s ease-out; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-extrabold text-gray-900 mb-2">
            Raise & Track Issues
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Submit your concerns and monitor their progress in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          <div className="lg:col-span-2 h-fit lg:sticky lg:top-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  New Complaint
                </h2>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="Brief summary of the issue"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 bg-white shadow-sm transition-shadow outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      rows={5}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Detailed information and location"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 focus:ring-1 bg-white resize-none shadow-sm transition-shadow outline-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <div className="flex gap-3 flex-wrap">
                      {priorityOptions.map(
                        ({ level, label, icon: Icon, color }) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() =>
                              setForm({ ...form, priority: level })
                            }
                            className={`
                            flex items-center gap-2 px-4 py-2 text-sm rounded-full font-medium transition-all
                            ${
                              form.priority === level
                                ? `${color} border-2 shadow-md ring-2 ring-offset-2 ring-indigo-500`
                                : "text-gray-600 bg-gray-100 border border-gray-300 hover:bg-gray-200"
                            }
                          `}
                          >
                            <Icon className="w-4 h-4" />
                            {label.split(" ")[0]}{" "}
                          </button>
                        )
                      )}
                    </div>
                    <p
                      className={`mt-2 text-xs font-medium ${
                        selectedPriority.color.split(" ")[0]
                      } flex items-center gap-1`}
                    >
                      <selectedPriority.icon className="w-3 h-3" />
                      Selected: {selectedPriority.label}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isCreating || !form.title || !form.description}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit New Complaint
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-purple-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <ListTodo className="w-5 h-5" />
                  My Submitted Issues
                </h2>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-medium text-white">
                  {complaints.length} Total
                </span>
              </div>

              <div className="p-4 sm:p-6">
                {(isLoading || error) && (
                  <div className="text-center py-12">
                    {isLoading ? (
                      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    ) : (
                      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    )}
                    <p className="text-gray-600 font-medium">
                      {isLoading
                        ? "Loading your complaints..."
                        : "Failed to load complaints."}
                    </p>
                  </div>
                )}

                {!isLoading && !error && complaints.length === 0 && (
                  <div className="text-center py-12">
                    <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">
                      You haven't raised any complaints yet.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {complaints.map((c) => {
                    const accentClass = getPriorityAccentClass(c.priority);
                    const PriorityIcon =
                      priorityOptions.find((p) => p.level === c.priority)
                        ?.icon || Zap;

                    return (
                      <div
                        key={c._id}
                        className={`block p-4 bg-white border-l-4 rounded-lg shadow-sm transition-all hover:shadow-lg hover:border-l-8 ${accentClass} cursor-pointer`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="font-bold text-gray-900 text-base line-clamp-1">
                              {c.title}
                            </p>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {c.description}
                            </p>
                          </div>

                          <div className="flex-shrink-0">
                            <StatusBadge
                              type={c.status}
                              compact
                              isPulse={
                                c.status === "pending" ||
                                c.status === "in_progress"
                              }
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t border-gray-100 mt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium capitalize">
                            <PriorityIcon
                              className={`w-4 h-4 ${
                                c.priority === "high"
                                  ? "text-red-500"
                                  : c.priority === "medium"
                                  ? "text-amber-500"
                                  : "text-green-500"
                              }`}
                            />
                            {c.priority} Priority
                          </div>

                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1 sm:mt-0">
                            <Clock className="w-3 h-3" />
                            Filed on:{" "}
                            {new Date(c.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              day: "numeric",
                              month: "short",
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
    </div>
  );
}
