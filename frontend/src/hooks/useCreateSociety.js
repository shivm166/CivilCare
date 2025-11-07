import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSociety } from "../lib/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useCreateSociety = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createSocietyMutation, isPending } = useMutation({
    mutationFn: createSociety,
    onSuccess: (data) => {
      // Show success message
      toast.success("Society created successfully! 🎉");
      
      // Invalidate societies query to refetch
      queryClient.invalidateQueries({ queryKey: ["userSocieties"] });
      
      // Small delay to ensure cache is updated
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || "Failed to create society";
      toast.error(errorMessage);
    },
  });

  return { createSocietyMutation, isPending };
};

export default useCreateSociety;
