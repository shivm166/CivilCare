import React, { useState } from "react";
import { Edit, Trash2, Shield, Users as UsersIcon } from "lucide-react";
import { useUsers, useDeleteUser } from "../../../../hooks/api/useSuperAdmin";
import PageLoader from "../../../error/PageLoader";
import EditUserModal from "../../../../components/features/superAdmin/EditUserModal";

function UserCard({ user, onEdit, onDelete, isDeleting }) {
  return (
    <div className="relative card bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Top-right action buttons */}
      <div className="absolute right-3 top-3 flex space-x-2">
        <button
          onClick={() => onEdit(user)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit user"
        >
          <Edit className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={() => onDelete(user._id)}
          disabled={isDeleting}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Delete user"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>

      {/* User Avatar/Initial */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center gap-1">
            <Shield className="w-4 h-4" />
            Role:
          </span>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              user.globalRole === "super_admin"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {user.globalRole === "super_admin" ? "Super Admin" : "User"}
          </span>
        </div>

        {user.phone && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Phone:</span>
            <span className="text-gray-900">{user.phone}</span>
          </div>
        )}

        {user.societyCount !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <UsersIcon className="w-4 h-4" />
              Societies:
            </span>
            <span className="font-medium text-gray-900">
              {user.societyCount}
            </span>
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
          Joined:{" "}
          {user.createdAt && new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

function SuperAdminUsers() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading, isError } = useUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const users = Array.isArray(data?.users) ? data.users : [];

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      deleteUser(userId);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">
          Manage users and their global roles across the system
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Super Admins</p>
          <p className="text-2xl font-bold text-purple-600">
            {users.filter((u) => u.globalRole === "super_admin").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm text-gray-600">Regular Users</p>
          <p className="text-2xl font-bold text-blue-600">
            {users.filter((u) => u.globalRole !== "super_admin").length}
          </p>
        </div>
      </div>

      {/* Users Grid */}
      {isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Failed to load users. Please try again.
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
          <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No users found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </div>
  );
}

export default SuperAdminUsers;
