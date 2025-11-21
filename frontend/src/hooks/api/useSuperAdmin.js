import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteSocietyById, deleteUserById, getAllSocieties, getAllUsers, getSuperAdminStats, updateSociety } from "../../api/services/superadmin.api";
import { getSocietyById } from "../../api/services/society.api";

export const useSuperAdminStats = () => {
  return useQuery({
    queryKey: ["superadminStats"],
    queryFn: getSuperAdminStats,
    staleTime: 1000 * 60 * 2,
  });
};

export const useSocieties = () => {
  return useQuery({
    queryKey: ["superadmin", "societies"],
    queryFn: getAllSocieties,
  });
};

export const useSocietyById = (id) => {
  return useQuery({
    queryKey: ["superadmin", "society", id],
    queryFn: () => getSocietyById(id),
    enabled: !!id,
  });
};

export const useUpdateSociety = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSociety(id, data),
    onSuccess: () => {
      toast.success("Society updated successfully");
      queryClient.invalidateQueries(["superadmin", "societies"]);
      queryClient.invalidateQueries(["superadmin", "society"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update society");
    },
  });
};

export const useDeleteSociety = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSocietyById,
    onSuccess: () => {
      toast.success("Society deleted successfully");
      queryClient.invalidateQueries(["superadmin", "societies"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete society");
    },
  });
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["superadmin", "users"],
    queryFn: getAllUsers,
  });
};

export const useUserById = (id) => {
  return useQuery({
    queryKey: ["superadmin", "user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries(["superadmin", "users"]);
      queryClient.invalidateQueries(["superadmin", "user"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserById,
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(["superadmin", "users"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};