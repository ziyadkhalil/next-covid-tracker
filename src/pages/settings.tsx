import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../api";
import { AppLayout } from "../components/app-layout";
import { useUserQuery } from "../hooks/useUserQuery";

function useUpdateNameMutation() {
  const queryClient = useQueryClient();
  return useMutation<unknown, AxiosError, { name: string }>(
    ({ name }) => api.patch("/api/auth/user-data", { name }),
    {
      onSuccess: (_, { name }) => {
        queryClient.setQueriesData(["user-data"], (old) => ({ ...old!, name }));
      },
    }
  );
}

function Settings() {
  const router = useRouter();
  const name = useUserQuery().data!.name;
  const [_name, setName] = useState(name);
  const updateMutation = useUpdateNameMutation();
  return (
    <div className="page flex-1 flex-col">
      <h2 className="text-4xl mb-4">Settings</h2>
      <div className="form-control">
        <label className="mb-1">Name</label>
        <input
          value={_name}
          onChange={(e) => setName(e.target.value)}
          className="input input-primary"
        />
      </div>
      <button
        onClick={() =>
          updateMutation.mutate(
            { name: _name },
            { onSuccess: () => router.replace("/") }
          )
        }
        className={
          "btn btn-primary btn-block mt-auto" +
          (updateMutation.isLoading ? " loading" : "")
        }
        disabled={name === _name || updateMutation.isLoading || !name}
      >
        Submit
      </button>
    </div>
  );
}

Settings.getLayout = AppLayout;

export default Settings;
