import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Loader2, AlertCircle, Send } from "lucide-react";
import { useComplaints, useCreateComplaint } from "../../hooks/useComplaints";

// Responsive + scalable RaiseComplaintPage (attachments removed)

const RaiseComplaintPage = () => {
  const {
    data: complaints = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useComplaints();
  const createMutation = useCreateComplaint();

  const [localComplaints, setLocalComplaints] = useState(complaints);

  useEffect(() => {
    setLocalComplaints(complaints);
  }, [complaints]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur", defaultValues: { priority: "medium" } });

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title.trim(),
        description: data.description?.trim() || "",
        priority: data.priority || "medium",
      };

      const result = await createMutation.mutateAsync(payload);

      if (result && result._id) {
        setLocalComplaints((prev) => [result, ...(prev || [])]);
      } else {
        refetch?.();
      }

      toast.success("Complaint submitted successfully");
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit complaint");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Form column */}
        <section className="md:col-span-5 bg-white rounded-xl shadow p-6 flex flex-col">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            Raise a New Complaint
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...register("title", {
                  required: "Title is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                aria-invalid={errors.title ? "true" : "false"}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide details..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                {...register("priority")}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High (Urgent)</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  createMutation.isLoading ||
                  createMutation.isPending
                }
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ||
                createMutation.isLoading ||
                createMutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Complaint
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* List column */}
        <section className="md:col-span-7 bg-white rounded-xl shadow p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              My Complaints ({localComplaints?.length || 0})
            </h2>
            <button
              onClick={() => refetch?.()}
              className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
              aria-label="Refresh complaints"
            >
              Refresh
            </button>
          </div>

          {isLoading && (
            <div className="text-center py-10">
              <Loader2 className="animate-spin mx-auto" size={40} />
              <p className="mt-3 text-sm text-gray-600">
                Loading complaints...
              </p>
            </div>
          )}

          {isError && (
            <div className="text-red-600 text-center py-10 flex items-center gap-2">
              <AlertCircle />
              <span>
                {error?.response?.data?.message ||
                  "Failed to load complaints. Please try again."}
              </span>
            </div>
          )}

          {!isLoading && !isError && localComplaints?.length === 0 && (
            <p className="text-gray-500 text-center py-10">
              No complaints raised yet.
            </p>
          )}

          <div
            className="space-y-4 overflow-auto"
            style={{ maxHeight: "60vh" }}
          >
            {localComplaints?.map((complaint) => (
              <article
                key={complaint._id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                aria-labelledby={`complaint-${complaint._id}-title`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3
                      id={`complaint-${complaint._id}-title`}
                      className="font-semibold text-lg"
                    >
                      {complaint.title}
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm">
                      {complaint.description || "No description"}
                    </p>

                    <div className="flex gap-3 mt-3 text-sm flex-wrap items-center">
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
                        {String(complaint.status || "pending")
                          .replace("_", " ")
                          .toUpperCase()}
                      </span>

                      <span className="text-gray-500">
                        Priority: <strong>{complaint.priority}</strong>
                      </span>
                      <span className="text-gray-500">
                        {new Date(complaint.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RaiseComplaintPage;
