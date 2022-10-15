import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { z } from "zod";
import { spinner } from "../../components/spinner";
import { useLoginMutation } from "../../hooks/useLoginMutation";
import { useUserQuery } from "../../hooks/useUserQuery";
import { loginSchema } from "../../shared/loginSchema";

export default function Login() {
  const router = useRouter();
  const userQuery = useUserQuery();
  useEffect(() => {
    if (userQuery.isSuccess)
      userQuery.data.isAdmin ? router.replace("/admin") : router.replace("/");
  }, [router, userQuery.data, userQuery.isSuccess]);

  const loginMutation = useLoginMutation();
  const [state, setState] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const onChange =
    (input: keyof typeof state) => (e: ChangeEvent<HTMLInputElement>) =>
      setState((old) => ({ ...old, [input]: e.target.value }));

  const onSubmit = () => {
    const parsed = loginSchema
      .and(z.object({ type: z.literal("password") }))
      .safeParse({ ...state, type: "password" });
    if (!parsed.success) {
      const formatted = parsed.error.format();

      return setErrors({
        email: formatted.email?._errors[0] ?? "",
        password: formatted.password?._errors[0] ?? "",
      });
    }
    setErrors({ password: "", email: "" });
    loginMutation.mutate(parsed.data, {
      onSuccess: ({ scope }) =>
        scope.includes("read:reports")
          ? router.replace("/admin")
          : router.replace("/"),
    });
  };
  return (
    <div className="bg-base-100 flex-1  flex justify-center items-center flex-col">
      <div className="bg-base-200 text-base-content rounded-md p-5 max-w-full md:max-w-2xl w-full flex flex-col flex-1 md:flex-none">
        <h1 className="font-sans text-2xl mb-3">Login</h1>
        <form className="flex-1 flex flex-col h-full">
          <div className="form-control">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              placeholder="username@email.com"
              type="email"
              className="input"
              value={state.email}
              onChange={onChange("email")}
            />
            <label className="label text-error">{errors.email}</label>
          </div>
          <div className="form-control mb-4">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              className="input"
              value={state.password}
              onChange={onChange("password")}
            />
            <label className="label text-error">{errors.password}</label>
          </div>
          <button
            disabled={
              loginMutation.isLoading ||
              !Object.values(state).reduce((old, curr) => old && !!curr, true)
            }
            className="btn btn-primary btn-block mb-4"
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {loginMutation.isLoading ? spinner : "Login"}
          </button>
          <Link passHref href="passwordless">
            <a className="btn btn-link btn-block">Passwordless Login</a>
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
