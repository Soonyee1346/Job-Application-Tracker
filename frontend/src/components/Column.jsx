import JobCard from "./JobCard";

export default function Column({ title, jobs }) {
    return (
        <div className="bg-gray-800 p-4 rounded-lg flex flex-ccol min-h-[500px]">
            <h2 className="text-blue-400 font-bold mb-4 uppercase text-sm tracking-widest border-b border-gray-700 pb-2">
                {title} ({jobs.length})
            </h2>
            <div className="flex flex-col gap-3">
                {jobs.map(job => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>
        </div>
    );
}