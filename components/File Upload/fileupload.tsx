import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileWithPreview extends File {
  preview: string;
}

interface MyDropzoneProps {
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  acceptedTypes?: string[];
}

export default function MyDropzone({
  className,
  onFilesChange,
  acceptedTypes = ["image/*", "application/pdf"],
}: MyDropzoneProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

      setFiles((prev) => {
        const updated = [...prev, ...newFiles];
        onFilesChange?.(updated);
        return updated;
      });
    },
    [onFilesChange]
  );

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onFilesChange?.(updated);
      return updated;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
  });

  return (
    <>
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`${className} p-8 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 transition-colors`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-700">Drop the files here ...</p>
        ) : (
          <p className="text-gray-500">
            Drag and drop files here, or click to select
          </p>
        )}
      </div>

      {/* Preview List */}
  <ul className="flex gap-4 mt-4 flex-wrap">
  {files.map((file, index) => {
    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    return (
      <li
        key={index}
        className="relative border rounded-lg overflow-hidden bg-gray-50 w-28 h-28 group shadow-sm flex flex-col items-center justify-center"
      >
        {/* Preview */}
        {isImage ? (
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 p-2">
            <svg
              className="w-10 h-10 text-gray-500 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-xs text-gray-600 text-center truncate w-full">
              {file.name}
            </span>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 gap-1 p-1">
          <a
            href={file.preview}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-medium hover:bg-gray-100 w-full text-center"
          >
            View 
          </a>

          <button
            type="button"
            onClick={() => removeFile(index)}
            className="bg-white text-red-700 px-2 py-1 rounded text-xs font-medium hover:bg-gray-100 w-full"
          >
            Remove
          </button>
        </div>
      </li>
    );
  })}
</ul>

    </>
  );
}
