import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAccessToken() {
  return useQuery(["token"], () => localStorage.getItem("token"), {
    initialData:
      typeof window !== "undefined" ? localStorage.getItem("token") : undefined,
  });
}

export function useSetAccessToken() {
  const queryClient = useQueryClient();
  return (token: string | null) => {
    if (token === null) {
      localStorage.removeItem("token");
      return queryClient.setQueryData(["token"], null);
    }
    localStorage.setItem("token", token);
    queryClient.setQueryData(["token"], token);
  };
}
