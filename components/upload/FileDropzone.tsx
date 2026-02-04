"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  isUploading: boolean;
}

export function FileDropzone({ onFileAccepted, isUploading }: FileDropzoneProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileName(file.name);
        onFileAccepted(file);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200",
        isDragActive
          ? "border-primary-500 bg-primary-50"
          : fileName
          ? "border-green-300 bg-green-50"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
        isUploading && "cursor-not-allowed opacity-60"
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-3">
        {isUploading ? (
          <>
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-primary-500" />
            <p className="text-sm text-gray-500">Analyzing...</p>
          </>
        ) : fileName ? (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <Check className="h-5 w-5 text-green-600" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-navy-500">{fileName}</p>
              <p className="text-xs text-gray-400 mt-1">Click to change</p>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Upload className="h-5 w-5 text-gray-500" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm text-navy-500">
                {isDragActive ? "Drop here" : "Drop your .xlsx file here"}
              </p>
              <p className="text-xs text-gray-400 mt-1">or click to browse</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
