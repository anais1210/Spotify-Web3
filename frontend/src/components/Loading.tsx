// components/Loading.tsx
import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="loader border-t-transparent border-solid animate-spin border-4 border-blue-500 rounded-full w-16 h-16"></div>
    </div>
  );
};

export default Loading;
