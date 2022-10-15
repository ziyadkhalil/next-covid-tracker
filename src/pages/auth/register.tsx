import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useAccessToken, useSetAccessToken } from "../../hooks/useAccessToken";
import { registerSchema, RegisterParams } from "../../shared/registerSchema";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { setApiToken } from "../../api";
import Image from "next/image";
import { spinner } from "../../components/spinner";

const useRegisterMutation = () => {
  const setAccessToken = useSetAccessToken();
  return useMutation<{ access_token: string }, AxiosError, RegisterParams>(
    (params) =>
      axios.post("/api/auth/register", params).then((res) => res.data),
    {
      onSuccess: ({ access_token }) => {
        setAccessToken(access_token);
        setApiToken(access_token);
      },
    }
  );
};

export default function Register() {
  const router = useRouter();
  const token = useAccessToken().data;
  useEffect(() => {
    if (token) router.replace("/");
  }, [router, token]);

  const registerMutation = useRegisterMutation();
  const [state, setState] = useState({ email: "", name: "", password: "" });
  const [errors, setErrors] = useState({ email: "", name: "", password: "" });
  const onChange =
    (input: keyof typeof state) => (e: ChangeEvent<HTMLInputElement>) =>
      setState((old) => ({ ...old, [input]: e.target.value }));

  const onSubmit = () => {
    const parsed = registerSchema.safeParse(state);
    if (!parsed.success) {
      const formatted = parsed.error.format();

      return setErrors({
        email: formatted.email?._errors[0] ?? "",
        name: formatted.name?._errors[0] ?? "",
        password: formatted.password?._errors[0] ?? "",
      });
    }
    setErrors({ name: "", password: "", email: "" });
    registerMutation.mutate(parsed.data, {
      onSuccess: () => router.replace("/"),
    });
  };
  return (
    <div className="bg-base-100 flex-1 flex justify-center items-center flex-col">
      <div className="bg-base-200 text-base-content rounded-md p-5 max-w-full md:max-w-2xl w-full flex flex-col flex-1 md:flex-none">
        <h1 className="font-sans text-2xl mb-3">Register</h1>
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
          <div className="form-control">
            <label htmlFor="name" className="label">
              Name
            </label>
            <input
              id="name"
              placeholder="John Doe"
              className="input"
              value={state.name}
              onChange={onChange("name")}
            />
            <label className="label text-error">{errors.name}</label>
          </div>
          <div className="form-control mb-4">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              value={state.password}
              onChange={onChange("password")}
              placeholder="Password"
              type="password"
              className="input"
            />
            <label className="label text-error">{errors.password}</label>
          </div>

          <button
            className="btn btn-primary btn-block mb-4"
            disabled={
              registerMutation.isLoading ||
              !Object.values(state).reduce((old, curr) => old && !!curr, true)
            }
            onClick={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {registerMutation.isLoading ? spinner : "Register"}
          </button>
        </form>
        <div className="divider">{"Already have an account?"}</div>
        <Link passHref href="login">
          <a className="btn btn-outline">Login</a>
        </Link>
      </div>
    </div>
  );
}
