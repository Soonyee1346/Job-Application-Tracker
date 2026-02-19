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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 md:p-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-white">
          JOB<span className="text-blue-500">FLOW</span>
        </h1>
        <p className="text-gray-400">Backend: FastAPI | Database: PostgreSQL</p>
      </header>

      {/* The Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {STATUS_COLUMNS.map((status) => (
          <Column 
            key={status} 
            title={status} 
            // Only pass the jobs that match this specific column
            jobs={jobs.filter(job => job.status === status)} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;