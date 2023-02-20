import React from "react";
import "./styles/verifysignature.css";

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="error-alert">
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
