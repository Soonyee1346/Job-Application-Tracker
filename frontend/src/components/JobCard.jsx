export default function JobCard({ job }){
    return (
        <div clasName="bg-gray-700 p-4 rounded shadow border-l-4 border-blue-500 hover:bg-gray600 transition">
            <h3 className="font-bold text-white text-lg">{job.company}</h3>
            <p className="text-sm text-gray-300">{job.position}</p>
            <div className="mt-3 flex justify-between items-center">
                <span className="text-xs font-mono text-green-400 bg-green-900/30 px-2 py-1 rounded">
                    {job.salary || "N/A"}
                </span>
                <span className="text-[10px] text-gray-500 uppercase">
                    ID: {job.id}
                </span>
            </div>
        </div>
    );
}