"use client";
import React from "react";

/**
 * Error message component for displaying loading failures
 * Shows a user-friendly error message with the content name that failed to load
 * @param {Object} props - Component props
 * @param {string} props.contentName - Name of the content that failed to load
 * @returns {React.ReactElement} Error message component
 */
const ErrorMessage = ({ contentName }) => (
  <div className="text-center">
    {/* Error Title */}
    <h1 className="text-3xl font-bold text-purple-800 mb-4">
      Failed to load {contentName}
    </h1>
    {/* Error Message */}
    <p className="text-xl text-purple-600">Please try again later</p>
  </div>
);

export default ErrorMessage;
