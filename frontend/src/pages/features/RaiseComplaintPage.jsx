import React from "react";
import { useForm } from "react-hook-form";
import { useSocietyContext } from "../../context/SocietyContext";
import { useComplaints, useCreateComplaint } from "../../hooks/useComplaints";

const RaiseComplaintPage = () => {
  const { activeSociety } = useSocietyContext();
  const societyId = activeSociety?.societyId;

  const { data, isLoading } = useComplaints(societyId);
  const { mutateAsync, isPending } = useCreateComplaint();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { title: "", description: "", priority: "low" },
  });

  const onSubmit = async (values) => {
    await mutateAsync({
      ...values,
      society: societyId,
    });
    reset();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Complaints</h1>

      {/* Complaint Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border rounded-lg p-4 space-y-4"
      >
        <input
          {...register("title", { required: true })}
          placeholder="Title"
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          {...register("description")}
          placeholder="Description"
          className="w-full border rounded px-3 py-2"
        />
        <select
          {...register("priority")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          disabled={!societyId || isPending}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>

      {/* Complaints List */}
      <div className="bg-white border rounded-lg">
        <h2 className="px-4 py-3 border-b font-medium">Previous Complaints</h2>
        {isLoading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : (data?.complaints || []).length === 0 ? (
          <p className="p-4 text-gray-500">No complaints yet.</p>
        ) : (
          <ul className="divide-y">
            {data.complaints.map((c) => (
              <li key={c._id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{c.title}</h3>
                    <p className="text-sm text-gray-600">{c.description}</p>
                  </div>
                  <span className="text-xs capitalize bg-gray-100 px-2 py-1 rounded">
                    {c.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RaiseComplaintPage;
