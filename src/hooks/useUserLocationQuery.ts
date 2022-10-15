import { useQuery } from "@tanstack/react-query";

export function useUserLocationQuery() {
  return useQuery(
    ["location"],
    () =>
      new Promise<GeolocationCoordinates>((res, rej) => {
        if (!window.navigator.geolocation) rej();
        window.navigator.geolocation.getCurrentPosition(
          (pos) => {
            res(pos.coords);
          },
          () => rej()
        );
      })
  );
}
