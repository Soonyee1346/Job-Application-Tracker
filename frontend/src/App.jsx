import { useState, useEffect } from "react";
import Column from "./components/Column";

const STATUS_COLUMNS = [
  "Wishlist",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
  "Accepted",
  "Declined"
]

function App() {
  const [jobs, setJobs] = useState([]);

  // FETCH: The Bridge to FastAPI
  useEffect(() => {
    fetch("http://localhost:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Could not connect to Backend:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-100 p-6">
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tighter italic">JOB_TRACKER_v1.0</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest">System Status: <span className="text-green-500">Online</span></p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-4 rounded-md transition-all">
          + NEW APPLICATION
        </button>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-8 snap-x">
        {STATUS_COLUMNS.map((status) => (
          <Column
            key={status}
            title={status}
            jobs={jobs.filter(job => job.status === status)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;