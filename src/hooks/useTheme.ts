import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useTheme() {
  return useQuery(
    ["theme"],
    () => {
      return typeof window !== "undefined"
        ? window.localStorage.getItem("theme")
        : "light";
    },
    {
      initialData: "light",
    }
  ).data!;
}

export function useSetTheme() {
  const queryClient = useQueryClient();
  return (theme: "dark" | "light") => {
    queryClient.setQueryData(["theme"], theme);
    localStorage.setItem("theme", theme);
  };
}
