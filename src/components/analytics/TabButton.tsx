// components/TabButton.tsx
import React from "react";

interface TabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const TabButton: React.FC<TabButtonProps> = ({
  id,
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={() => onClick(id)}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500/30"
        : "text-gray-300 hover:text-white hover:bg-gray-600/50 border border-transparent hover:border-gray-500/30 backdrop-blur-sm"
    }`}
  >
    {label}
  </button>
);

export default TabButton;
