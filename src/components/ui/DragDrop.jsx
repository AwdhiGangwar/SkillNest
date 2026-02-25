import React, { useRef, useState } from "react";
import clsx from "clsx";
import { Image, FileText } from "lucide-react";

function DragDrop({
  type = "image", // image | pdf
  onFileSelect,
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const isImage = type === "image";

  const acceptType = isImage
    ? "image/png, image/jpeg"
    : "application/pdf";

  const Icon = isImage ? Image : FileText;

  const mainText = isImage
    ? "Drag & drop your image here, or"
    : "Drag & drop your document here, or";

  const subText = isImage
    ? "Supported formats: PNG and JPEG (max 10 MB)."
    : "Supported format: PDF (max 10 MB).";

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFile = (file) => {
    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div
      className={clsx(
        "relative w-full rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer",
        dragActive
          ? "bg-blue-50 border-blue-500"
          : "bg-white border-blue-300"
      )}
      onClick={handleClick}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      {/* Hidden input */}
      <input
        type="file"
        accept={acceptType}
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {/* Icon */}
      <div className="flex justify-center mb-3 text-blue-500">
        <Icon size={28} />
      </div>

      {/* Text */}
      <p className="text-gray-700 text-sm">
        {mainText}{" "}
        <span className="text-blue-600 font-medium underline">
          browse
        </span>
      </p>

      <p className="text-xs text-gray-500 mt-2">
        {subText}
      </p>
    </div>
  );
}

export default DragDrop;
