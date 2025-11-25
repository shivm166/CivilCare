// frontend/src/components/common/Card/Card.jsx
import React from "react";
import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  noPadding = false,
  header,
  animate = false,
  variants,
  ...props
}) => {
  const CardContent = (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}
      {...props}
    >
      {header && (
        <div className="p-4 sm:p-5 border-b border-gray-200">{header}</div>
      )}
      <div className={noPadding ? "" : "p-4 sm:p-5"}>{children}</div>
    </div>
  );

  if (animate) {
    return <motion.div variants={variants}>{CardContent}</motion.div>;
  }

  return CardContent;
};

export default Card;
