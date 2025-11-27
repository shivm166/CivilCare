// frontend/src/components/common/Button/Button.jsx
import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  icon: Icon,
  size = "md",
  animate = true,
  disabled,
  ...props
}) => {
  let baseStyle =
    "flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";
  let sizeStyle = "";
  let colorStyle = "";

  // Size Styles
  switch (size) {
    case "sm":
      sizeStyle = "px-3 py-1.5 text-xs";
      break;
    case "lg":
      sizeStyle = "px-6 py-3.5 text-base";
      break;
    case "md":
    default:
      sizeStyle = "px-4 py-2.5 text-sm";
      break;
  }

  // Color Styles
  switch (variant) {
    case "secondary":
      colorStyle =
        "bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm hover:shadow-md";
      break;
    case "ghost":
      colorStyle = "bg-transparent text-gray-700 hover:bg-gray-100";
      break;
    case "danger":
      colorStyle =
        "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-500/30";
      break;
    case "success":
      colorStyle =
        "bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-500/30";
      break;
    case "primary":
    default:
      colorStyle =
        "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30";
      break;
  }

  const content = (
    <>
      {isLoading ? (
        <Loader2
          className={`animate-spin ${size === "sm" ? "w-3 h-3" : "w-4 h-4"}`}
        />
      ) : (
        Icon && <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      )}
      <span>
        {isLoading
          ? children.toString().includes("...")
            ? children
            : `Loading...`
          : children}
      </span>
    </>
  );

  const buttonContent = (
    <button
      className={`${baseStyle} ${sizeStyle} ${colorStyle} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {content}
    </button>
  );

  if (animate) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {buttonContent}
      </motion.div>
    );
  }

  return buttonContent;
};

export default Button;
