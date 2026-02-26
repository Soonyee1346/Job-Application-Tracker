import { useState, useEffect } from "react";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core"
import Column from "./components/Column";
import AddJobModal from "./components/AddJobModal";
import JobCard from "./components/JobCard";

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
  const [activeId, setActiveId] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Could not connect to Backend:", err));
  }, []);

  const handleAddJob = async (jobData) => {
    try {
      console.log("Adding job:", jobData);
      const response = await fetch("http://localhost:8000/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        const newJob = await response.json();
        setJobs((prevJobs) => [...prevJobs, newJob]);
      }
    } catch (err) {
      console.error("Backend unreachable", err)
    }
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const jobId = active.id;
    const newStatus = over.id;

    setActiveId(null);

    setJobs((prevJobs) => prevJobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job));

    try {
      const response = await fetch(`http://localhost:8000/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to update job status");
    } catch (err) {
      fetch("http://localhost:8000/jobs")
        .then(res => res.json())
        .then(data => setJobs(data))
        .catch(err => console.error("Could not connect to Backend:", err));
      console.error("Backend unreachable", err)
    }
  }

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:8000/jobs/${jobId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      } else {
        console.error("Failed to delete job");
      }
    } catch (e) {
      console.error("Error connecting to backend:", err)
    }
  }

  const handleEditClick = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  }

  const handleUpdateJob = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:8000/jobs/${editingJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData )
      })

      if (response.ok) {
        const updatedJob = await response.json();
        setJobs((prevJobs) => prevJobs.map(job => job.id === editingJob.id ? updatedJob : job));
        setEditingJob(null);
      }
    } catch (err) {
      console.error("Failed to updated job: ", err);
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

      <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-8 snap-x">
          {STATUS_COLUMNS.map((status) => (
            <Column key={status} id={status} title={status} jobs={jobs.filter(j => j.status === status)} onDelete={handleDeleteJob} onEdit={handleEditClick} />
          ))}
        </div>
        
        <DragOverlay dropAnimation={null}>
          {activeId ? (
            <JobCard job={jobs.find(j => j.id === activeId)} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddJobModal
        isOpen={isModalOpen}
        initialData={editingJob}
        onClose={() => { 
          setIsModalOpen(false);
          setEditingJob(null);
        }}
        onAdd={editingJob ? handleUpdateJob : handleAddJob}
      />
    </div>
  );
}

export default App;