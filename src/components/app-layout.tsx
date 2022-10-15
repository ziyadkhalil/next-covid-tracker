import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useUserQuery } from "../hooks/useUserQuery";
import { Header } from "./header";
import { spinner } from "./spinner";

function Protected({ children }: { children: ReactNode }) {
  const userQuery = useUserQuery();
  const router = useRouter();

  useEffect(() => {
    if (!userQuery.isSuccess && userQuery.fetchStatus === "idle") {
      router.replace("/auth/passwordless");
    }
  }, [
    router,
    userQuery.fetchStatus,
    userQuery.isLoading,
    userQuery.isSuccess,
    userQuery.status,
  ]);

  if (!userQuery.isSuccess)
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        {spinner}
      </div>
    );

  return <>{children}</>;
}

export function AppLayout(children: ReactNode) {
  return (
    <Protected>
      <Header />
      {children}
    </Protected>
  );
}
