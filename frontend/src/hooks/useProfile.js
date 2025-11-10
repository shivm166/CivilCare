import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../lib/api";

const useProfile = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      // 🔄 refresh cached user data (like "authUser" or "profile")
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return { isPending, error, updateProfileMutation: mutate };
};

export default useProfile;
