import { useState } from "react";
import { useNavigate } from "react-router-dom";

const avatars = [
  "/avatars/a1.png",
  "/avatars/a2.png",
  "/avatars/a3.png",
  "/avatars/a4.png",
  "/avatars/a5.png",
];

const AvatarSelector = () => {
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const handleContinue = () => {
    console.log("Selected Avatar:", avatars[selected]);
    navigate("/dashboard");
  };

  const getAvatarClass = (index) => {
    const isSelected = selected === index;
    return isSelected
      ? "w-10 h-10 rounded-full cursor-pointer border-2 border-blue-500 scale-110 transition"
      : "w-10 h-10 rounded-full cursor-pointer border-2 border-gray-200 hover:scale-105 transition";
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md w-[400px]">
      <h2 className="text-xl font-semibold mb-6">Choose Your Avatar</h2>

      {/* Large Preview */}
      <div className="flex justify-center mb-6">
        <img
          src={avatars[selected]}
          alt="selected avatar"
          className="w-28 h-28 rounded-full border-2 border-blue-500 object-cover"
        />
      </div>

      {/* Small Options */}
      <div className="flex justify-center gap-4 mb-6">
        {avatars.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`avatar option ${index}`}
            onClick={() => setSelected(index)}
            className={getAvatarClass(index)}
          />
        ))}
      </div>

      <button
        onClick={handleContinue}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default AvatarSelector;