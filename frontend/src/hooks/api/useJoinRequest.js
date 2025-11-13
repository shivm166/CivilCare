import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendJoinRequest, searchSocietyByCode } from "../lib/api"; // ⬅️ CHANGED
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

// Hook to search society by JoiningCode ⬅️ CHANGED
export const useSearchSociety = (joiningCode, enabled = false) => {
  return useQuery({
    queryKey: ["searchSociety", joiningCode], // ⬅️ CHANGED
    queryFn: () => searchSocietyByCode(joiningCode), // ⬅️ CHANGED
    enabled: enabled && !!joiningCode, // ⬅️ CHANGED
    retry: false,
    staleTime: 0,
  });
};

// Hook to send join request
export const useSendJoinRequest = (onSuccessCallback) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: sendRequest, isPending } = useMutation({
    mutationFn: sendJoinRequest,
    onSuccess: (data) => {
      toast.success("Join request sent successfully! 🎉");

      // Invalidate user societies to refresh
      queryClient.invalidateQueries({ queryKey: ["userSocieties"] });
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });

      // Call custom callback if provided
      if (onSuccessCallback) {
        onSuccessCallback();
      } else {
        // Redirect to home after 1 second
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to send join request";
      toast.error(errorMessage);
    },
  });

  return { sendRequest, isPending };
};
