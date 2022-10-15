import Link from "next/link";
import { AppLayout } from "../components/app-layout";
import { useUserCasesQuery } from "../hooks/useUserReportsQuery";
import Image from "next/image";
import { spinner } from "../components/spinner";

const Home = () => {
  const userCasesQuery = useUserCasesQuery();

  const loading = (
    <div className="flex-1 items-center justify-center flex flex-col gap-2">
      {spinner}
    </div>
  );

  const empty = (
    <div className="flex-1 items-center justify-center flex flex-col gap-2">
      <p>You have not reported any case yet</p>
      <Link href="report">
        <button className="btn btn-primary">Report</button>
      </Link>
    </div>
  );

  const error = (
    <div className="flex-1 items-center justify-center flex flex-col gap-2">
      <p>An error occured</p>
    </div>
  );

  return userCasesQuery.isLoading ? (
    loading
  ) : userCasesQuery.isError ? (
    error
  ) : userCasesQuery.data.length === 0 ? (
    empty
  ) : (
    <div className="page flex flex-1 flex-col">
      <div className="flex mb-4">
        <h2 className="text-4xl flex-1">Your reports</h2>
        <Link href="report">
          <button className="btn btn-secondary min-h-0 h-8">Report</button>
        </Link>
      </div>
      <div className="flex-1 basis-0 overflow-y-auto">
        {userCasesQuery.data.map((report) => (
          <div key={report._id} className="border-b border-gray-200  p-3">
            <div className="flex mb-2">
              <p className="font-medium text-2xl flex-1">
                {report.temperature}
              </p>
              <p className="text-sm font-medium text-gray-600">
                {new Date(report.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {report.symptoms.map((symptom) => (
                <div className="badge badge-accent" key={symptom}>
                  {symptom}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Home.getLayout = AppLayout;

export default Home;
