import Link from "next/link";
import { useRouter } from "next/router";
import { MouseEventHandler, useEffect, useState } from "react";
import { AppLayout } from "../components/app-layout";
import { useReportMutation } from "../hooks/useReportMutation";
import { useUserLocationQuery } from "../hooks/useUserLocationQuery";

const symptoms = [
  "Fever or chills",
  "Cough",
  "Shortness of breath or difficulty breathing",
  "Fatigue",
  "Muscle or body aches",
  "Headache",
  "New loss of taste or smell",
  "Sore throat",
  "Congestion or runny nose",
  "Nausea or vomiting",
  "Diarrhea",
] as const;

type Symptom = typeof symptoms[number];

const Report = () => {
  const [temperature, setTemperature] = useState<number>();
  const router = useRouter();

  const [symptomsChecked, setSymptomsChecked] = useState(
    symptoms.reduce((prev, curr) => ({ ...prev, [curr]: false }), {}) as Record<
      typeof symptoms[number],
      boolean
    >
  );
  const userLocationQuery = useUserLocationQuery();

  const reportMutation = useReportMutation();
  const onSubmit: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    reportMutation.mutate(
      {
        temperature: temperature!,
        location: {
          type: "Point",
          coordinates: [
            userLocationQuery.data!.longitude,
            userLocationQuery.data!.latitude,
          ],
        },
        symptoms: Object.entries(symptomsChecked).reduce(
          (old, curr) => (curr[1] ? [...old, curr[0] as Symptom] : old),
          [] as Symptom[]
        ),
      },
      { onSuccess: () => router.replace("/") }
    );
  };

  const toggleSymptom = (symptom: Symptom) =>
    setSymptomsChecked((old) => ({ ...old, [symptom]: !old[symptom] }));

  return (
    <div className="page flex-1">
      <h1 className="text-4xl mb-4">Report case</h1>
      {!userLocationQuery.isSuccess ? (
        <div className="flex-1 items-center justify-center flex flex-col gap-2">
          {userLocationQuery.isError ? (
            <>
              <p className="text-lg font-semibold">
                {`Wasn't able to detect your location`}{" "}
              </p>
              <p>Give permission to access your location and try again</p>
              <button
                className="btn btn-secondary"
                onClick={void userLocationQuery.refetch}
              >
                Get location
              </button>
            </>
          ) : (
            <p>Detecting location... </p>
          )}
        </div>
      ) : (
        <form className="flex flex-1 flex-col">
          <div className="form-control mb-4">
            <label>Temperature °C</label>
            <input
              type="number"
              className="input input-primary"
              min={36}
              max={42}
              value={temperature ? temperature : ""}
              onChange={(e) => setTemperature(e.target.valueAsNumber)}
            />
          </div>
          <div className="form-control">
            <label className="mb-2">Symptoms</label>
            <div className="flex gap-2 flex-wrap">
              {symptoms.map((symptom) => (
                <div
                  className="flex min-w-full  md:min-w-[40%] items-center basis-0 mb-2"
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                >
                  <input
                    type="checkbox"
                    checked={symptomsChecked[symptom]}
                    className="checkbox checkbox-primary mr-2"
                  />
                  <label>{symptom}</label>
                </div>
              ))}
            </div>
          </div>
          <button
            className={
              "btn btn-primary btn-block mt-auto" +
              (reportMutation.isLoading ? " loading" : "")
            }
            onClick={onSubmit}
            disabled={!temperature || reportMutation.isLoading}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

Report.getLayout = AppLayout;

export default Report;
