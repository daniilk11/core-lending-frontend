'use client'
import React from 'react';

const ErrorMessage = ({contentName}) => (
    <div className="text-center">
        <h1 className="text-3xl font-bold text-purple-800 mb-4">Failed to load {contentName}</h1>
        <p className="text-xl text-purple-600">Please try again later</p>
    </div>
);

export default ErrorMessage;
