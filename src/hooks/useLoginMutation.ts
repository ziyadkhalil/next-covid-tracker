import { useSetAccessToken } from "./useAccessToken";
import { useMutation } from "@tanstack/react-query";
import { api, setApiToken } from "../api";
import { AxiosError } from "axios";
import { LoginParams } from "../shared/loginSchema";

export const useLoginMutation = () => {
  const setAccessToken = useSetAccessToken();
  return useMutation<
    { access_token: string; scope: string },
    AxiosError,
    LoginParams
  >((params) => api.post("/api/auth/login", params).then((res) => res.data), {
    onSuccess: ({ access_token }) => {
      setAccessToken(access_token);
      setApiToken(access_token);
    },
  });
};
