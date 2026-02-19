import { useState, useEffect } from "react";
import Column from "./components/Column";

const STATUS_COLUMNS = [
  "Wishlist",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
  "Declined"
]

function App() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("API Error:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-black mb-8">JOB TRACKER</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {STATUS_COLUMNS.map(status => (
          <Column
            key={status}
            title={status}
            jobs={jobs.filter(j => j.status === status)}
          />
        ))}
      </div>
    </div>
  )
}

export default App;