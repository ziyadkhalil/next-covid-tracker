import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { ReportParams } from "../shared/reportSchema";

export function useUserCasesQuery() {
  return useQuery<(ReportParams & { _id: string; created_at: string })[]>(
    ["reports"],
    () => api.get("/api/report").then((res) => res.data)
  );
}
