import { PhoneIncoming, PhoneOutgoing } from "lucide-react";

const DirectionBadge = ({ inbound, size = "medium" }) => {
  const config = inbound
    ? {
        label: "Incoming",
        Icon: PhoneIncoming,
        classes: "bg-green-50 text-green-700 border border-green-200"
      }
    : {
        label: "Outgoing",
        Icon: PhoneOutgoing,
        classes: "bg-blue-50 text-blue-700 border border-blue-200"
      };

  const sizeClass = {
    small: "px-2 py-0.5 text-xs rounded-lg",
    medium: "px-3 py-1 text-sm rounded-xl",
    large: "px-4 py-1.5 text-base rounded-2xl"
  }[size];

  return (
    <span className={`inline-flex items-center gap-1 ${sizeClass} ${config.classes}`}>
      <config.Icon className="h-4 w-4" />
      <span className="hidden md:inline">
        {config.label}
      </span>
    </span>
  );
};

export default DirectionBadge;
