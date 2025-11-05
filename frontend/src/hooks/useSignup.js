import { useMutation, useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();
const useSignup = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });
  return { isPending, error, signupMutation: mutate };
};

export default useSignup;
