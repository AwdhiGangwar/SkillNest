import React from "react";
import { Image, FileText } from "lucide-react";

function FilePreview({ type = "image", fileName }) {
  const isImage = type === "image";

  return (
    <div className="w-[72px] h-[124px] border border-dashed border-purple-500 rounded-[5px] flex flex-col items-center justify-center gap-2 bg-white">

      {isImage ? (
        <Image size={28} className="text-purple-500" />
      ) : (
        <FileText size={28} className="text-purple-500" />
      )}

      <p className="text-xs text-gray-600 text-center px-1 truncate">
        {fileName || (isImage ? "Image" : "PDF")}
      </p>
    </div>
  );
}

export default FilePreview;
