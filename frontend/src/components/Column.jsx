export default function Column({ title, jobs }) {
  const getHeaderColor = () => {
    if (title === "Accepted") return "border-green-500 text-green-400";
    if (title === "Declined") return "border-red-500 text-red-400";
    if (title === "Offer") return "border-yellow-500 text-yellow-400";
    return "border-blue-500 text-blue-400";
  };

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-3 flex flex-col min-w-[280px] h-[calc(100vh-200px)] overflow-y-auto">
      <div className={`border-b-2 ${getHeaderColor()} pb-2 mb-4 flex justify-between items-center px-1`}>
        <h2 className="font-black text-xs uppercase tracking-tighter">{title}</h2>
        <span className="bg-gray-900 text-[10px] px-2 py-0.5 rounded-full text-gray-400">{jobs.length}</span>
      </div>
      
      <div className="flex flex-col gap-3">
        {jobs.map(job => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  );
}