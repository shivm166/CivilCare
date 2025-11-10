import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../lib/api.js";

const useProfile = () => {
  const queryClient = useQueryClient();


  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await getProfile();
      return res.user ?? res;
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const res = await updateProfile(payload);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    user: data,
    loading: isLoading,
    error: isError,
    refetch,
    updateProfileMutation: mutation.mutate,
    updateProfileStatus: {
      isLoading: mutation.isLoading,
      error: mutation.error,
    },
  };
};

export default useProfile;
