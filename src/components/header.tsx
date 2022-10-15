import { useUserQuery } from "../hooks/useUserQuery";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSetAccessToken } from "../hooks/useAccessToken";
import { useQueryClient } from "@tanstack/react-query";
import { clearApiToken } from "../api";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const user = useUserQuery().data!;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const setAccessToken = useSetAccessToken();
  const queryClient = useQueryClient();
  const logout = () => {
    clearApiToken();
    setAccessToken(null);
    queryClient.clear();
  };

  const dropdown = (
    <div
      className={`transition-all origin-top-right bg-base-100 shadow-md rounded-md absolute top-14 right-2 min-w-[10rem] ${
        dropdownOpen
          ? "scale-100 opacity-100"
          : "scale-50 opacity-0 pointer-events-none"
      }`}
    >
      <p className=" max-w-xs truncate border-b-2 p-2">Hi {user.name}</p>

      <ul>
        <Link href="settings">
          <li
            className="cursor-pointer hover:bg-base-200 p-2 "
            onClick={() => setDropdownOpen(false)}
          >
            Settings
          </li>
        </Link>
        <li className="cursor-pointer hover:bg-base-200 p-2" onClick={logout}>
          Logout
        </li>
      </ul>
    </div>
  );

  return (
    <header className="relative z-10">
      {dropdown}
      <div className="bg-base-200 w-full px-3 h-12 flex flex-1 items-center relative">
        <div className="flex gap-4">
          <Link href="/">Home</Link>
          {user.isAdmin && <Link href="/admin">Admin</Link>}
        </div>
        <div
          className="ml-auto flex gap-4"
          onClick={() => setDropdownOpen((old) => !old)}
        >
          <ThemeToggle />
          <div className="w-9 h-9 cursor-pointer">
            <Image
              className="rounded-full"
              width={36}
              height={36}
              src={user.picture}
              alt={user.name}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
