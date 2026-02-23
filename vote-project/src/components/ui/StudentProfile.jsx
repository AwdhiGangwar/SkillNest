import { useState } from "react";

const avatars = [
  "/avatars/a1.png",
  "/avatars/a2.png",
  "/avatars/a3.png",
  "/avatars/a4.png",
  "/avatars/a5.png",
];

const StudentProfile = () => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-[400px]">

      <h2 className="text-xl font-semibold mb-6">
        Select Your Profile
      </h2>

      {/* Large Preview */}
      <div className="flex justify-center mb-6">
        <img
          src={avatars[selected]}
          alt="selected"
          className="w-28 h-28 rounded-full border object-cover"
        />
      </div>

      {/* Small Avatar Options */}
      <div className="flex justify-center gap-4">
        {avatars.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="avatar"
            onClick={() => setSelected(index)}
            className={`w-10 h-10 rounded-full cursor-pointer border transition
              ${selected === index
                ? "border-blue-500 scale-110"
                : "border-gray-200 hover:scale-105"
              }`}
          />
        ))}
      </div>

    </div>
  );
};

export default StudentProfile;