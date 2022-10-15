import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "../api";
import { ReportParams } from "../shared/reportSchema";

export function useReportMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    ReportParams & { id: string; name: string },
    AxiosError,
    ReportParams
  >((params) => api.post("/api/report", params).then((res) => res.data), {
    onSuccess: (report) => {
      queryClient.setQueryData<ReportParams[]>(["reports"], (old) =>
        old ? [report, ...old] : undefined
      );
      queryClient.refetchQueries(["user-reports"]);
    },
  });
}
