import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  activateAccount,
  verifyInvitationToken,
} from "../../api/services/activation.api";

// Hook for account activation
export const useActivation = () => {
  const navigate = useNavigate();

  const activationMutation = useMutation({
    mutationFn: (data) => activateAccount(data),
    onSuccess: (data) => {
      toast.success("Account activated successfully!");
      setTimeout(() => {
        navigate("/user/dashboard");
      }, 1500);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to activate account"
      );
    },
  });

  return {
    activateAccount: activationMutation.mutate,
    isActivating: activationMutation.isPending,
    activationError: activationMutation.error,
  };
};

// Hook for verifying invitation token
export const useVerifyToken = (token) => {
  return useQuery({
    queryKey: ["verifyToken", token],
    queryFn: () => verifyInvitationToken(token),
    enabled: !!token,
    retry: false,
  });
};
