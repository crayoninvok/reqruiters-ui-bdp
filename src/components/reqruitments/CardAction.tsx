import React from "react";
import { Eye, Trash2, Edit } from "lucide-react";

interface CardActionsProps {
  onView: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  showEdit?: boolean;
}

export const CardActions: React.FC<CardActionsProps> = ({
  onView,
  onEdit,
  onDelete,
  showEdit = false
}) => {
  const baseButtonClass = "flex items-center gap-1 px-3 py-2 text-sm rounded-lg font-medium transition-colors";

  return (
    <div className="flex gap-2">
      <button
        onClick={onView}
        className={`${baseButtonClass} bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400`}
        aria-label="View application details"
      >
        <Eye className="w-4 h-4" />
        View
      </button>
      
      {showEdit && onEdit && (
        <button
          onClick={onEdit}
          className={`${baseButtonClass} bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/20 dark:hover:bg-gray-900/30 text-gray-600 dark:text-gray-400`}
          aria-label="Edit application"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      )}
      
      <button
        onClick={onDelete}
        className={`${baseButtonClass} bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400`}
        aria-label="Delete application"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
};