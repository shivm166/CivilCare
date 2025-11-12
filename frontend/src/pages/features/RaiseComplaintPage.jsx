// pages/RaiseComplaintPage.jsx
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2, AlertCircle, Send } from "lucide-react";
import { useComplaints, useCreateComplaint } from "../../hooks/useComplaints";

const RaiseComplaintPage = () => {
  const { data: complaints = [], isLoading, isError, error } = useComplaints();
  const createMutation = useCreateComplaint();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        description: data.description || "", // Prevent null
        priority: data.priority || "medium",
      };

      await createMutation.mutateAsync(payload);
      reset(); // Reset form on success
    } catch (err) {
      // Error already handled in mutation
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Raise a New Complaint
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              {...register("title", {
                required: "Title is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Water leakage in corridor"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Provide details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High (Urgent)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isSubmitting || createMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Submitting...
              </>
            ) : (
              <>
                <Send size={20} />
                Submit Complaint
              </>
            )}
          </button>
        </form>
      </div>

      {/* My Complaints List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Complaints ({complaints.length})
        </h2>

        {isLoading && (
          <div className="text-center py-10">
            <Loader2 className="animate-spin mx-auto" size={40} />
            <p>Loading complaints...</p>
          </div>
        )}

        {isError && (
          <div className="text-red-600 text-center py-10 flex items-center gap-2">
            <AlertCircle />
            {error?.response?.data?.message ||
              "Failed to load complaints. Please refresh."}
          </div>
        )}

        {!isLoading && !isError && complaints.length === 0 && (
          <p className="text-gray-500 text-center py-10">
            No complaints raised yet.
          </p>
        )}

        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{complaint.title}</h3>
                  <p className="text-gray-600 mt-1">
                    {complaint.description || "No description"}
                  </p>
                  <div className="flex gap-3 mt-3 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        complaint.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : complaint.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : complaint.status === "resolved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {complaint.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span className="text-gray-500">
                      Priority: <strong>{complaint.priority}</strong>
                    </span>
                    <span className="text-gray-500">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RaiseComplaintPage;
