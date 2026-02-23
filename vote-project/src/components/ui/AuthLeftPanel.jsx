const AuthLeftPanel = () => {
  return (
    <div className="w-[40%] bg-[#0D2232] text-white flex flex-col items-center justify-center relative overflow-hidden">

      {/* Logo */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-white rounded-lg" />
        <h1 className="text-3xl font-semibold">Skill Nest</h1>
      </div>

      <p className="text-center text-gray-300 max-w-xs">
        Learn, grow and track your progress with us.
      </p>

      {/* Optional Illustration */}
      {/* <img src={bg} className="absolute bottom-0 opacity-20" /> */}

    </div>
  );
};

export default AuthLeftPanel;