import React, { useState, useRef, useEffect } from "react";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const CertificateMultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select certificates...",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-medium text-gray-300 mb-1">
        Certificates
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-left flex items-center justify-between backdrop-blur-sm hover:bg-gray-600/50 transition-colors"
      >
        <span className="truncate text-gray-200">
          {selected.length === 0
            ? placeholder
            : `${selected.length} certificate${
                selected.length > 1 ? "s" : ""
              } selected`}
        </span>
        <svg
          className={`w-4 h-4 transition-transform text-gray-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Selected Items Display */}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.map((cert) => (
            <span
              key={cert}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded backdrop-blur-sm border border-blue-400/20"
            >
              {cert.replace(/_/g, " ")}
              <button
                onClick={() => handleToggleOption(cert)}
                className="ml-1 hover:text-blue-100 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-gray-800/90 backdrop-blur-md border border-gray-600/50 rounded-md shadow-2xl max-h-60 overflow-auto">
          <div className="p-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-300">
                Select Certificates
              </span>
              {selected.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {options.map((option) => (
              <label
                key={option}
                className="flex items-center p-2 hover:bg-gray-700/50 rounded cursor-pointer transition-colors backdrop-blur-sm"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => handleToggleOption(option)}
                  className="mr-2 text-blue-400 bg-gray-700 border-gray-500 rounded focus:ring-blue-400 focus:ring-2"
                />
                <span className="text-sm text-gray-100">
                  {option.replace(/_/g, " ")}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
