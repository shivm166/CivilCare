import React from "react";
import { useQuery,} from "@tanstack/react-query";
// import { getAllUsers,} from "../../lib/api";
// import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { getAllUsers } from "../../../../api/services/superadmin.api";

function UserCard({ user, onEdit, onDelete }) {
  return (
    <div className="relative card bg-white p-4 rounded-lg shadow-sm">
      <div className="absolute right-3 top-3 flex space-x-2">
        <button
          onClick={() => onEdit(user)}
          className="btn btn-ghost btn-sm tooltip tooltip-bottom"
          data-tip="Update"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(user._id)}
          className="btn btn-ghost btn-sm tooltip tooltip-bottom"
          data-tip="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      <div className="mb-3">
        <h3 className="text-lg font-semibold">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <div>
          <strong>Role:</strong> {user.globalRole || "user"}
        </div>
        <div>
          <strong>Phone:</strong> {user.phone || "-"}
        </div>
        <div>
          <strong>Joined:</strong>{" "}
          {/* {user.createdAt ? format(new Date(user.createdAt), "dd MMM yyyy") : "-"} */}
        </div>
      </div>
    </div>
  );
}

function SuperAdminUsers() {

  const { data, isLoading, isError } = useQuery({
    queryKey: ["superadmin", "users"],
    queryFn: getAllUsers,
    staleTime: 1000 * 60 * 2,
  });

  const users = Array.isArray(data?.users) ? data.users : data ?? [];

  const handleDelete = () =>{

  }

  const handleEdit = () =>{
    
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 rounded-lg bg-white shadow-sm animate-pulse h-40" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-red-500">Failed to load users.</div>
      ) : users.length === 0 ? (
        <div className="text-gray-600">No users found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <UserCard key={u._id} user={u} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SuperAdminUsers;
