import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col h-full items-center  text-center">
      <img
        src="/images/faithfortresslogo2resized.png"
        alt="My Faith Fortress Logo"
        className="h-64 w-64 p-0 object-cover"
      />
    </div>
  );
};

export default Logo;
