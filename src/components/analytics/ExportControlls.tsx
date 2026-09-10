// components/ExportControls.tsx
import React from "react";
import { Printer, FileSpreadsheet } from "lucide-react";
import { exportToExcel, ExportData } from "@/utils/export-analytics";

interface ExportControlsProps {
  data: ExportData;
}

const ExportControls: React.FC<ExportControlsProps> = ({ data }) => {
  const handleExcelExport = () => {
    exportToExcel(data);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs sm:text-sm font-medium rounded-xl transition-all shadow-md"
        title="Cetak atau Simpan halaman sebagai PDF"
      >
        <Printer className="w-4 h-4 text-blue-400" />
        <span>Cetak / PDF</span>
      </button>

      <button
        onClick={handleExcelExport}
        className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-medium rounded-xl transition-all shadow-md shadow-emerald-600/20"
        title="Unduh data analitik dalam format Excel"
      >
        <FileSpreadsheet className="w-4 h-4" />
        <span>Ekspor Excel</span>
      </button>
    </div>
  );
};

export default ExportControls;
