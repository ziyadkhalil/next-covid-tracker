import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { useAccessToken } from "../../hooks/useAccessToken";
import { useLoginMutation } from "../../hooks/useLoginMutation";

function usePasswordlessMutation() {
  return useMutation<
    unknown,
    AxiosError,
    { type: "link" | "code"; email: string }
  >((params) => api.post("/api/auth/passwordless", params));
}

export default function Passwordless() {
  const router = useRouter();
  const token = useAccessToken().data;
  useEffect(() => {
    if (token) router.replace("/");
  }, [router, token]);
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"link" | "code">();
  const [code, setCode] = useState("");
  const loginMutation = useLoginMutation();

  const passwordlessMutation = usePasswordlessMutation();
  const onSubmit = (type: "link" | "code") => {
    setType(type);
    passwordlessMutation.mutate(
      { type, email },
      {
        onError: () => {
          setType(undefined);
        },
      }
    );
  };

  const onCodeLogin = () =>
    loginMutation.mutate(
      { type: "code", email, code },
      {
        onSuccess: () => {
          router.replace("/");
        },
      }
    );

  return (
    <div className="bg-base-100 flex-1 flex justify-center items-center flex-col">
      <div className="bg-base-200 text-base-content rounded-md p-5 max-w-full md:max-w-2xl w-full flex flex-col flex-1 md:flex-none">
        <h1 className="font-sans text-2xl mb-3">Passwordless Login</h1>
        <form className="flex-1 flex flex-col h-full">
          {passwordlessMutation.isSuccess && type === "code" ? (
            <>
              <div className="form-control mb-4">
                <label className="label">Code</label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Code"
                  type="password"
                  className="input input-primary"
                />
              </div>
              <button
                className={
                  "btn btn-primary btn-block mb-4" +
                  (loginMutation.isLoading ? " loading" : "")
                }
                disabled={!code || loginMutation.isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  onCodeLogin();
                }}
              >
                Login
              </button>
            </>
          ) : passwordlessMutation.isSuccess && type === "link" ? (
            <div className="h-56 flex items-center justify-center">
              <p>Login link has been sent to your email!</p>
            </div>
          ) : (
            <>
              <div className="form-control mb-4">
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  placeholder="username@email.com"
                  disabled={passwordlessMutation.isLoading}
                  type="email"
                  className="input input-primary"
                />
              </div>
              <button
                disabled={!email || passwordlessMutation.isLoading}
                className={
                  `btn btn-primary btn-block mb-4` +
                  (passwordlessMutation.isLoading && type === "code"
                    ? " loading"
                    : "")
                }
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit("code");
                }}
              >
                Send Code
              </button>
              <button
                disabled={!email || passwordlessMutation.isLoading}
                className={
                  `btn btn-secondary btn-block mb-4` +
                  (passwordlessMutation.isLoading && type === "link"
                    ? " loading"
                    : "")
                }
                onClick={(e) => {
                  e.preventDefault();
                  onSubmit("link");
                }}
              >
                Send Link
              </button>
            </>
          )}
          <Link passHref href="login">
            <a className="btn btn-link btn-block">Login with password</a>
          </Link>
        </form>

        <div className="divider">{"Don't have an account?"}</div>

        <Link passHref href="register">
          <a className="btn btn-outline">Create Account</a>
        </Link>
      </div>
    </div>
  );
}
