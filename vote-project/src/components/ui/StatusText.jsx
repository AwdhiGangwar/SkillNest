const StatusText = ({
  text,
  color = "text-gray-500",
  className = "",
}) => {
  return (
    <span
      className={`text-xs font-normal ${color} ${className}`}
    >
      {text}
    </span>
  );
};

export default StatusText;