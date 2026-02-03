"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileAccepted: (file: File) => void;
  isUploading: boolean;
}

export function FileDropzone({ onFileAccepted, isUploading }: FileDropzoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        setError("Please upload a valid .xlsx file (max 10MB)");
        return;
      }

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
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all",
          isDragActive
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-primary-400 hover:bg-gray-50",
          isUploading && "cursor-not-allowed opacity-60",
          error && "border-red-400 bg-red-50"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          {isUploading ? (
            <>
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
              <div>
                <p className="font-medium text-navy-500">Analyzing your data...</p>
                <p className="text-sm text-gray-500">This may take a moment</p>
              </div>
            </>
          ) : fileName ? (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-navy-500">File ready</p>
                <p className="text-sm text-gray-500">{fileName}</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                {isDragActive ? (
                  <FileSpreadsheet className="h-7 w-7 text-primary-600" />
                ) : (
                  <Upload className="h-7 w-7 text-primary-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-navy-500">
                  {isDragActive ? "Drop your file here" : "Drag & drop your claims file"}
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse (.xlsx, max 10MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <p className="mt-4 text-xs text-center text-gray-500">
        Your data is processed in memory only. No patient information is stored.
      </p>
    </div>
  );
}
