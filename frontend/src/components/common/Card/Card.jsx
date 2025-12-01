// frontend/src/components/common/Card/Card.jsx
import React from "react";

const Card = ({
  children,
  className = "",
  noPadding = false,
  header,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}
      {...props}
    >
      {/* Optional Header Section */}
      {header && (
        <div className="p-4 sm:p-5 border-b border-gray-200">{header}</div>
      )}

      {/* Content Section */}
      <div className={noPadding ? "" : "p-4 sm:p-5"}>{children}</div>
    </div>
  );
};

export default Card;
