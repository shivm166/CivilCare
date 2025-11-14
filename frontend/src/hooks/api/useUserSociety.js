import { useMutation, useQuery } from "@tanstack/react-query";
import {
  joinSociety,
  getUserSociety,
  getUsersOfSociety,
  removeUser,
  updateUserRole,
} from "../api/userSocietyRel.api";

// join society
export const useJoinSociety = () => {
  return useMutation({
    mutationFn: joinSociety,
  });
};

// my society
export const useMySociety = () => {
  return useQuery({
    queryKey: ["my-society"],
    queryFn: getMySociety,
  });
};

// society users
export const useSocietyUsers = (societyId) => {
  return useQuery({
    queryKey: ["society-users", societyId],
    queryFn: () => getUsersOfSociety(societyId),
    enabled: !!societyId,
  });
};

// remove user
export const useRemoveUser = () => {
  return useMutation({
    mutationFn: removeUser,
  });
};

// update role
export const useUpdateRole = () => {
  return useMutation({
    mutationFn: ({ id, role }) => updateUserRole(id, { roleInSociety: role }),
  });
};
