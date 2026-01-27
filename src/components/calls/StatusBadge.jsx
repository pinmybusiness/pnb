import { CheckCircle, XCircle } from "lucide-react";

const StatusBadge = ({ answered, size = "medium" }) => {
  const config = answered
    ? {
        label: "Answered",
        Icon: CheckCircle,
        classes: "bg-green-50 text-green-700 border border-green-200"
      }
    : {
        label: "Missed",
        Icon: XCircle,
        classes: "bg-red-50 text-red-700 border border-red-200"
      };

  const sizeClass = {
    small: "px-2 py-0.5 text-xs rounded-lg",
    medium: "px-3 py-1 text-sm rounded-xl",
    large: "px-4 py-1.5 text-base rounded-2xl"
  }[size];

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClass} ${config.classes}`}>
      {/* <config.Icon className="h-4 w-4" /> */}
      {config.label}
    </span>
  );
};

export default StatusBadge;
