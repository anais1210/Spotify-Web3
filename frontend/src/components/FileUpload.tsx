"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { upload } from "thirdweb/storage";
import { client } from "@/app/client";

interface FileUploadProps {
  onFileUpload: (uploadFile: string) => void; // Callback to return the uploaded file URL
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const renameFileWithTimestamp = (file: File) => {
    const timestamp = new Date().getTime(); // Get current timestamp
    const extension = file.name.split(".").pop(); // Get the file extension
    const newFileName = `${timestamp}.${extension}`; // Create new file name

    // Create a new file with the updated name
    return new File([file], newFileName, { type: file.type });
  };

  // File upload logic
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploadStatus("Uploading file...");
      try {
        const renamedFiles = acceptedFiles.map((file) =>
          renameFileWithTimestamp(file)
        );

        const uris = await upload({
          client,
          files: renamedFiles,
        });
        const uploadFile = uris.replace("ipfs://", "https://ipfs.io/ipfs/");
        console.log(uploadFile);
        onFileUpload(uploadFile); // Pass the uploaded file URL to the parent
        setUploadStatus("Upload successful!");
      } catch (error) {
        console.error("Error uploading album cover: ", error);
        setUploadStatus("Upload failed, please try again.");
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-400 p-6 text-center cursor-pointer bg-gray-700 rounded-lg"
      >
        <input {...getInputProps()} />
        <p>Drag and drop a cover image here, or click to select one</p>
      </div>
      {uploadStatus && (
        <p
          className={`mt-2 ${
            uploadStatus.includes("failed") ? "text-red-400" : "text-green-400"
          }`}
        >
          {uploadStatus}
        </p>
      )}
    </div>
  );
};

export default FileUpload;
