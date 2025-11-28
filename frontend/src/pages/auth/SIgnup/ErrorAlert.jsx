import { AlertCircle } from "lucide-react";

export const ErrorAlert = ({ error }) => {
  if (!error) return null;
  const responseData = error.response?.data;

  let errorMessages = [];

  // 1. Check for  API m
  const metaMessage =
    responseData?.meta?.message || responseData?.data?.meta?.message;
  if (metaMessage) {
    errorMessages = [metaMessage];
  } else if (responseData?.errors && Array.isArray(responseData.errors)) {
    errorMessages = responseData.errors;
  } else if (responseData?.message) {
    errorMessages = [responseData.message];
  } else {
    errorMessages = [error.message];
  }

  return (
    <div className="alert alert-error mb-4 shadow-md">
      <AlertCircle className="w-5 h-5" />
      <div className="flex flex-col text-sm">
        {errorMessages.map((msg, index) => (
          <span key={index}>
            {msg.startsWith('"') ? msg.slice(1, -1).replace(/"/g, "") : msg}
          </span>
        ))}
      </div>
    </div>
  );
};
