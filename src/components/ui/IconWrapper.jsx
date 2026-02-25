const IconWrapper = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center cursor-pointer"
    >
      {children}
    </div>
  );
};

export default IconWrapper;