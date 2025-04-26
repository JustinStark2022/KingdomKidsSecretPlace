import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <img
        src="/images/kingdomkidslogo.png"
        alt="Kingdom Kids Secret Place Logo"
        className="h-20 w-20 object-contain mb-2"
      />
      <h1 className="text-2xl font-extrabold text-[#ffffff] bg-[#0072ce] px-2 py-1 rounded">
        Kingdom Kids Secret Place
      </h1>
    </div>
  );
};

export default Logo;
