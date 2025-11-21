// frontend/src/hooks/api/auth/useProfile.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile } from "../../../api/services/auth.api.js";
import { updateProfile } from "../../../api/services/user.api.js";

const useProfile = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await getProfile();
      // FIX: Safely access res.data.user based on the backend's standardized response
      return res.data?.user ?? null;
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload) => {
      // updateProfile now returns the full API response object: { success, data, meta }
      const res = await updateProfile(payload);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    user: data,
    loading: isLoading, // This is now stable (boolean)
    error: isError,
    refetch,
    updateProfileMutation: mutation.mutate,
    updateProfileStatus: {
      isLoading: mutation.isPending,
      error: mutation.error,
    },
  };
};

export default useProfile;
