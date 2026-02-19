// src/components/Column.jsx
import JobCard from './JobCard';

export default function Column({ title, jobs }) {
  return (
    <div className="bg-gray-800/50 rounded-xl p-4 flex flex-col gap-4 min-h-[500px] border border-gray-700">
      <div className="flex justify-between items-center mb-2 px-1">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">
          {title}
        </h2>
        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
          {jobs.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}