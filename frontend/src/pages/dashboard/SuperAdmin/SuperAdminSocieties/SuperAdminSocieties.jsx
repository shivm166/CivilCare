import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Edit, Trash2 } from "lucide-react";
import { getAllSocieties } from "../../../../api/services/superadmin.api";

function SocietyCard({ society, onDelete, onEdit }) {
  return (
    <div className="relative card bg-white p-4 rounded-lg shadow-sm">
      {/* Top-right action buttons */}
      <div className="absolute right-3 top-3 flex space-x-2">
        <button
          onClick={() => onEdit(society)}
          className="btn btn-ghost btn-sm tooltip tooltip-bottom"
          data-tip="Update"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(society._id)}
          className="btn btn-ghost btn-sm tooltip tooltip-bottom"
          data-tip="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      <div className="mb-3">
        <h3 className="text-lg font-semibold">{society.name}</h3>
        <p className="text-sm text-gray-500">{society.address}</p>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <div>
          <strong>City:</strong> {society.city || "-"}
        </div>
        <div>
          <strong>State:</strong> {society.state || "-"}
        </div>
        <div>
          <strong>Pincode:</strong> {society.pincode || "-"}
        </div>
        <div>
          <strong>Created:</strong>{" "}
          {society.createdAt && new Date(society.createdAt).toLocaleDateString() }
        </div>
      </div>
    </div>
  );
}

function SuperAdminSocieties() {

  const { data, isLoading, isError } = useQuery({
    queryKey: ["superadmin", "societies"],
    queryFn: getAllSocieties,
  });

  const societies = Array.isArray(data?.societies) ? data.societies : data ?? [];

  const handleDelete = () =>{

  }

  const handleEdit = () =>{

  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Societies</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 rounded-lg bg-white shadow-sm animate-pulse h-40" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-500">Failed to load societies.</div>
      ) : societies.length === 0 ? (
        <div className="text-gray-600">No societies found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {societies.map((s) => (
            <SocietyCard key={s._id} society={s} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SuperAdminSocieties;
