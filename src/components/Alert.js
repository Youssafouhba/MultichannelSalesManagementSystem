import React from 'react';


const Alert = ({ type, message }) => {
  const isSuccess = type === 'success';

  return (
    <div
      className={`p-4 pl-12 relative rounded-lg leading-5 ${
        isSuccess ? 'bg-green-50 text-green-900 dark:bg-green-600 dark:text-white' : 'bg-red-50 text-red-900 dark:bg-red-600 dark:text-white'
      }`}
      role="alert"
    >
      <svg
        className={`h-5 w-5 ${
          isSuccess ? 'text-green-400 dark:text-green-300' : 'text-red-400 dark:text-red-300'
        } absolute left-0 top-0 ml-4 mt-4`}
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d={isSuccess ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'} />
      </svg>
      {message}
    </div>
  );
};

export default Alert;