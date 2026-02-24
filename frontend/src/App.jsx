import { useState, useEffect } from "react";
import Column from "./components/Column";
import AddJobModal from "./components/AddJobModal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Could not connect to Backend:", err));
  }, []);

  const handleAddJob = async (jobData) => {
    try {
      const response = await fetch("http://localhost:8000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application.json"},
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        const newJob = await response.json();
        setJobs((prevJobs) => [ ...prevJobs, newJob]);
      }
    } catch (err) {
      console.error("Backend unreachable", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-100 p-6">
      <header className="max-w-7xl mx-auto mb-10 flex justify-between items-end">
        <h1 className="text-2xl font-black tracking-tighter italic text-white">JOB_TRACKER</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black py-2 px-6 rounded-md shadow-lg shadow-blue-900/20 transition-all"
        >
          + NEW APPLICATION
        </button>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-8 snap-x">
        {STATUS_COLUMNS.map((status) => (
          <Column key={status} title={status} jobs={jobs.filter(j => j.status === status)} />
        ))}
      </div>

      <AddJobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddJob} 
      />
    </div>
  );
}

export default App;