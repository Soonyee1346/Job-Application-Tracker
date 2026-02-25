import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function JobCard({ job }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: job.id });

  const actuallyDragging = isDragging || !!transform;

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    width: actuallyDragging ? "280px" : undefined,
    zIndex: actuallyDragging ? 50 : undefined,
    opacity: actuallyDragging ? 0.8 : 1,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="group bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-sm hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-gray-100 group-hover:text-blue-400 transition-colors leading-tight">
          {job.company}
        </h3>
      </div>
      <p className="text-xs text-gray-400 font-medium mb-3">{job.position}</p>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-800">
        <span className="text-[10px] font-mono text-green-500/80 bg-green-500/5 px-1.5 py-0.5 rounded">
          {job.salary || "$ Undisclosed"}
        </span>
        <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
          Ref: {job.id}
        </span>
      </div>
    </div>
  );
}