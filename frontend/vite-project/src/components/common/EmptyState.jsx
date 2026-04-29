import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "Nothing here",
  description = "There is no data to display.",
  actionLabel,
  onAction,
  icon: Icon = Inbox,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      
      {/* Icon */}
      <div className="bg-gray-100 p-4 rounded-full mb-4">
        <Icon size={28} className="text-gray-500" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h2>

      {/* Description */}
      <p className="text-gray-500 max-w-md mb-6">
        {description}
      </p>

      {/* Optional Action Button */}
      {actionLabel && (
        <button
          onClick={onAction}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm shadow transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;