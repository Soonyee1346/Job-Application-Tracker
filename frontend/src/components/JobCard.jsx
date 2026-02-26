import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function JobCard({ job, isOverlay = false, onDelete, onUpdate }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: job.id, disabled: isOverlay });

  const style = !isOverlay ? {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
  } : {
    cursor: "grabbing"
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`group bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-sm w-full ${isOverlay ? 'border-blue-500 shadow-2xl rotate-3' : 'hover:border-blue-500/50'}`}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-gray-100 group-hover:text-blue-400 transition-colors leading-tight">
          {job.company}
        </h3>
        {!isOverlay && (
          <button onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(job.id);
            }}
            className="text-gray-500 hover:text-red-500 transition-colors px-2">
            x
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 font-medium mb-3">{job.position}</p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-800">
        <span className="text-[10px] font-mono text-green-500/80 bg-green-500/5 px-1.5 py-0.5 rounded">
          {job.salary || "$ Undisclosed"}
        </span>
        <span className="text-[9px] text-gray-600 bg-blue-500/5  px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">
          {!isOverlay && (
            <button onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onUpdate(job.id);
              }}
              className="text-gray-500 hover:text-yellow-500 transition-colors px-2">
              Update
            </button>
          )}
        </span>
      </div>
    </div>
  );
}