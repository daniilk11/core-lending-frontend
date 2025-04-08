import React from "react";

/**
 * Component for displaying detailed information in a consistent format
 * @param {Object} props - Component props
 * @param {string} props.title - Section title (default: "Details")
 * @param {boolean} props.showCollateral - Whether to show collateral toggle (default: false)
 * @param {Array<{label: string, value: string}>} props.details - Array of detail objects with label and value
 * @returns {React.ReactElement} Details section component
 */
const DetailsSection = ({
  title = "Details",
  showCollateral = false,
  details = [],
}) => {
  return (
    <div className="space-y-4">
      {/* Section Title */}
      <h4 className="font-medium text-lg text-[#c8b6ff]">{title}</h4>

      {/* Details List */}
      <div className="space-y-2 text-sm">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between">
            <span>{detail.label}</span>
            <span>{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsSection;
