// components/ExportControls.tsx
import React from "react";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { exportToExcel, ExportData } from "@/utils/export-analytics";

interface ExportControlsProps {
  data: ExportData;
}

const ExportControls: React.FC<ExportControlsProps> = ({ data }) => {
  const handleExcelExport = () => {
    exportToExcel(data);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleExcelExport}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-lg"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Export Excel
      </button>
    </div>
  );
};

export default ExportControls;
