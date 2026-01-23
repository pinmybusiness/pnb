'use client';

const CallerDisplay = ({ caller }) => {
  const { name, phone, formattedPhone } = caller || {};

  const cleanName = name?.trim() || "";
  const displayName =
    cleanName !== "" && cleanName !== phone ? cleanName : null;

  // LIMIT name length
  const MAX_LEN = 20;
  const shortName =
    displayName && displayName.length > MAX_LEN
      ? displayName.substring(0, MAX_LEN) + "..."
      : displayName;

  return (
    <div className="flex flex-col items-start max-w-[150px] md:max-w-[90px]">
      {/* Name */}
      {displayName && (
        <div
          className="text-sm font-medium text-gray-900 truncate"
          title={displayName}
        >
          {shortName}
        </div>
      )}

      {/* Phone */}
      {formattedPhone && (
        <div
          className={`${
            displayName ? "text-xs text-gray-500" : "text-sm text-gray-900"
          } truncate`}
          title={formattedPhone}
        >
          {formattedPhone}
        </div>
      )}
    </div>
  );
};

export default CallerDisplay;
