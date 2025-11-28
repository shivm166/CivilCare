import { AlertCircle } from "lucide-react";

const ErrorAlert = ({ error }) => {
  if (!error) return null;

  const responseData = error.response?.data;

  const metaMessage =
    responseData?.meta?.message || responseData?.data?.meta?.message;

  const errorMessages = metaMessage
    ? [metaMessage]
    : Array.isArray(responseData?.errors)
    ? responseData.errors
    : responseData?.message
    ? [responseData.message]
    : [error.message];

  return (
    <div className="alert alert-error mb-4 shadow-md flex items-start gap-3">
      <AlertCircle className="w-5 h-5 mt-1" />
      <div className="text-sm flex flex-col">
        {errorMessages.map((msg, i) => (
          <span key={i}>
            {typeof msg === "string"
              ? msg.replace(/^\"|\"$/g, "")
              : String(msg)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ErrorAlert;
