import AuthLeftPanel from "../../pages/auth/AuthLeftPanel";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AuthLeftPanel />

      <div className="flex-1 flex items-center justify-center p-10">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;