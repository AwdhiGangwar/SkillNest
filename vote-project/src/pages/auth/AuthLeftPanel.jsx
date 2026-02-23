const AuthLeftPanel = () => {
  return (
    <div className="w-[40%] min-h-screen bg-[#0D2232] text-white flex flex-col items-center justify-center relative overflow-hidden">

      {/* Logo Section */}
      <div className="flex items-center gap-4 mb-6 z-10">
        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
          <span className="text-[#0D2232] font-bold text-xl">SN</span>
        </div>

        <h1 className="text-3xl font-semibold tracking-wide">
          Skill Nest
        </h1>
      </div>

      {/* Tagline */}
      <p className="text-gray-300 text-center max-w-xs z-10">
        Learn smarter. Grow faster.  
        Build your future with us.
      </p>

      {/* Decorative Gradient Glow */}
      <div className="absolute bottom-[-100px] w-[500px] h-[500px] bg-blue-500 opacity-20 blur-3xl rounded-full" />

    </div>
  );
};

export default AuthLeftPanel;