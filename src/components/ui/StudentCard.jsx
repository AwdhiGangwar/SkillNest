import React from "react";

function StudentCard({
  image,
  name,
  country,
  grade,
  tag,
}) {
  return (
    <div className="relative w-[284px] bg-white border border-gray-200 rounded-[16px] pt-6 pr-4 pb-4 pl-4 flex flex-col items-center gap-3">

      {/* Tag */}
      {tag && (
        <div className="absolute top-4 right-4">
          <span className="bg-blue-100 text-blue-600 text-sm font-medium px-4 py-1 rounded-xl">
            {tag}
          </span>
        </div>
      )}

      {/* Profile Circle Background */}
      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name */}
      <h2 className="text-xl font-semibold text-gray-900 mt-2">
        {name}
      </h2>

      {/* Details */}
      <p className="text-gray-500 text-base">
        {country}
        <span className="mx-2">|</span>
        {grade}
      </p>

    </div>
  );
}

export default StudentCard;
