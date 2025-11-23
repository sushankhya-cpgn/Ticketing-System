import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileWithPreview extends File {
  preview: string;
}

export default function MyDropzone({
  className,
  onFilesChange,
  acceptedTypes = ["image/*", "application/pdf"], // <-- you can change this
}: {
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  acceptedTypes?: string[];
}) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const newFiles = acceptedFiles.map((file: any) =>
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
      <div {...getRootProps()} className={className}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop files here, or click to select</p>
        )}
      </div>

      <ul className="flex gap-4 mt-4 flex-wrap">
        {files.map((file, index) => (
          <li key={index} className="relative">
            <img
              src={file.preview}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
              alt="preview"
              className="rounded border"
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="absolute top-0 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded-sm"
            >
              X
            </button>

            <p className="text-xs mt-1 text-center">{file.name}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
