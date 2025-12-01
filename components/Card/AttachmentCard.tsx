import React from "react";

interface AttachmentCardProps {
  attachment: {
    attachmentID: number;
    url: string;
  };
  showDelete?: boolean;
  onDelete?: (attachment: any) => void;

  // new props
  width?: string;   // Tailwind width class — e.g., "w-40"
  height?: string;  // Tailwind height class for preview — e.g., "h-32"
}

const AttachmentCard: React.FC<AttachmentCardProps> = ({
  attachment,
  showDelete = false,
  onDelete,

  width = "w-40",   // default width
  height = "h-32",  // default preview height
}) => {
  const isImage = /\.(jpeg|jpg|gif|png|webp)$/i.test(attachment.url);
  const fileName =
    attachment.url.split("/").pop()?.split("_").slice(1).join("_") || "file";

  return (
    <div className={`relative border rounded-lg overflow-hidden bg-gray-50 group ${width}`}>
      
      {/* Preview */}
      {isImage ? (
        <img
          src={attachment.url}
          alt="attachment"
          className={`w-full ${height} object-cover`}
        />
      ) : (
        <div className={`flex items-center justify-center ${height} bg-gray-200`}>
          <svg
            className="w-12 h-12 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      )}

      {/* File name */}
      <div className="p-2 text-xs text-center text-gray-600 truncate">
        {fileName}
      </div>

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        
        <a
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-gray-800 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100"
        >
          View
        </a>

        {showDelete && (
          <button
            className="bg-white ml-2 text-red-700 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.(attachment);
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default AttachmentCard;
