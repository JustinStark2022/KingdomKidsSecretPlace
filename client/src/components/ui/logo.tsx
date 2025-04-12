import React from "react";



interface LogoProps {
  size?: "small" | "medium" | "large";
}

const Logo: React.FC<LogoProps> = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "h-8",
    medium: "h-16",
    large: "h-18"
  };

  return (
    <div className="flex items-center">
      <img
        src="/images/logo11bgg.png"
        alt="Kingdom Kids Secret Place"
        className={`${sizeClasses[size]} w-auto`}
      />
    </div>
  );
};

export default Logo;
