// ContactTab Component
import React from "react";
import { Contact } from "lucide-react";
import { HiredEmployee } from "@/types/types";

interface ContactTabProps {
  employee: HiredEmployee;
}

export const ContactTab: React.FC<ContactTabProps> = ({ employee }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Contact className="w-5 h-5" />
        Emergency Contact
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contact Name
          </label>
          <p className="text-gray-900 dark:text-white">
            {employee.emergencyContactName || "Not specified"}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contact Phone
          </label>
          <p className="text-gray-900 dark:text-white">
            {employee.emergencyContactPhone || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
};