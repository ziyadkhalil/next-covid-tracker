import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

import { useAccessToken } from "./useAccessToken";

export function useUserQuery() {
  const token = useAccessToken().data;
  return useQuery<{
    name: string;
    picture: string;
    id: string;
    isAdmin: boolean;
  }>(
    ["user-data"],
    () => api.get("/api/auth/user-data").then((res) => res.data),
    { enabled: !!token }
  );
}
