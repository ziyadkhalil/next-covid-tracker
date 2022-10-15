import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AppLayout } from "../components/app-layout";

import { useUserQuery } from "../hooks/useUserQuery";
import Map, { Marker, Popup, MapRef } from "react-map-gl";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "../api";
import { ReportParams } from "../shared/reportSchema";
import "mapbox-gl/dist/mapbox-gl.css";

import { useTheme } from "../hooks/useTheme";
import { config } from "../config";

export function useReportsQuery(
  options?: UseQueryOptions<(ReportParams & { _id: string })[]>
) {
  return useQuery<(ReportParams & { _id: string })[]>(
    ["user-reports"],
    () => api.get("/api/admin/report").then((res) => res.data),
    options
  );
}
const Admin = () => {
  const theme = useTheme();
  const router = useRouter();
  const [selectedReport, setSelectedReport] = useState<
    ReportParams & { _id: string }
  >();
  const userQuery = useUserQuery();
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    if (userQuery.data?.isAdmin === false) router.replace("/");
  }, [router, userQuery.data]);

  const reportsQuery = useReportsQuery();

  useEffect(() => {
    reportsQuery.data?.length &&
      mapRef.current?.flyTo({
        center: {
          lng: reportsQuery.data[0].location.coordinates[0],
          lat: reportsQuery.data[0].location.coordinates[1],
        },
      });
  }, [reportsQuery.data]);
  return (
    <div className="relative">
      <Map
        ref={mapRef}
        mapboxAccessToken={config.mapAccessToken}
        initialViewState={{
          zoom: 12,
          longitude: reportsQuery.data?.[0]?.location.coordinates[0] ?? 0,
          latitude: reportsQuery.data?.[0]?.location.coordinates[1] ?? 29,
        }}
        style={{ width: "100vw", height: "calc(100vh - 48px)" }}
        mapStyle={`mapbox://styles/mapbox/navigation-${
          theme === "dark" ? "night" : "day"
        }-v1`}
      >
        {selectedReport && (
          <Popup
            onClose={() => setSelectedReport(undefined)}
            longitude={selectedReport.location.coordinates[0]}
            latitude={selectedReport.location.coordinates[1]}
            anchor="top"
          >
            <h1>{selectedReport.temperature}</h1>
            <div className="flex gap-2 flex-wrap ">
              {selectedReport.symptoms.join(" · ")}
            </div>
          </Popup>
        )}
        {reportsQuery.data?.map((report) => (
          <Marker
            key={report._id}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedReport(report);
            }}
            longitude={report.location.coordinates[0]}
            latitude={report.location.coordinates[1]}
          />
        ))}
      </Map>
    </div>
  );
};

Admin.getLayout = AppLayout;

export default Admin;
