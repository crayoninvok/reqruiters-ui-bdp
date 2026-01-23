"use client";
import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { RecruitmentFormFilters } from "@/services/recruitment.service";
import {
  Position,
  EducationLevel,
  Gender,
  Province,
  RecruitmentStatus,
  Certificate,
  PernahTidak,
} from "@/types/types";
import { CertificateMultiSelect } from "./CertificateMultiSelect";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (filters: RecruitmentFormFilters, format: "excel" | "pdf") => void;
  currentFilters: RecruitmentFormFilters;
  exporting: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  currentFilters,
  exporting,
}) => {
  const [format, setFormat] = useState<"excel" | "pdf">("excel");
  const [filterOption, setFilterOption] = useState<"current" | "all" | "custom">("current");
  const [showCustomFilters, setShowCustomFilters] = useState(false);
  const [customFilters, setCustomFilters] = useState<RecruitmentFormFilters>({
    page: 1,
    limit: 50,
    search: "",
    status: "",
    certificate: [],
    province: "",
    education: "",
    pernahKerjaDiTambang: "",
    appliedPosition: "",
    startDate: "",
    endDate: "",
    gender: "",
  });

  React.useEffect(() => {
    if (isOpen) {
      setFilterOption("current");
      setFormat("excel");
      setShowCustomFilters(false);
      // Reset custom filters
      setCustomFilters({
        page: 1,
        limit: 50,
        search: "",
        status: "",
        certificate: [],
        province: "",
        education: "",
        pernahKerjaDiTambang: "",
        appliedPosition: "",
        startDate: "",
        endDate: "",
        gender: "",
      });
    }
  }, [isOpen]);

  const handleFilterChange = (
    key: keyof RecruitmentFormFilters,
    value: string | number | string[]
  ) => {
    setCustomFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleExport = () => {
    let filtersToUse: RecruitmentFormFilters;
    
    if (filterOption === "current") {
      // Use current filters from the page
      filtersToUse = currentFilters;
    } else if (filterOption === "custom") {
      // Use custom filters
      filtersToUse = {
        ...customFilters,
        page: 1,
        limit: 50,
      };
    } else {
      // No filters = all data
      filtersToUse = {
        page: 1,
        limit: 50,
        search: "",
        status: "",
        certificate: [],
        province: "",
        education: "",
        pernahKerjaDiTambang: "",
        appliedPosition: "",
        startDate: "",
        endDate: "",
        gender: "",
      };
    }
    
    onExport(filtersToUse, format);
  };

  const clearCustomFilters = () => {
    setCustomFilters({
      page: 1,
      limit: 50,
      search: "",
      status: "",
      certificate: [],
      province: "",
      education: "",
      pernahKerjaDiTambang: "",
      appliedPosition: "",
      startDate: "",
      endDate: "",
      gender: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold text-white">Export Data</h2>
          <button
            onClick={onClose}
            disabled={exporting}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Format Export
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setFormat("excel")}
                disabled={exporting}
                className={`p-4 rounded-lg border-2 transition-all ${
                  format === "excel"
                    ? "border-green-500 bg-green-500/20 text-green-300"
                    : "border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="font-semibold">Excel</div>
                    <div className="text-xs opacity-75">.xlsx format</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setFormat("pdf")}
                disabled={exporting}
                className={`p-4 rounded-lg border-2 transition-all ${
                  format === "pdf"
                    ? "border-red-500 bg-red-500/20 text-red-300"
                    : "border-gray-600 bg-gray-700/30 text-gray-300 hover:border-gray-500"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="text-left">
                    <div className="font-semibold">PDF</div>
                    <div className="text-xs opacity-75">.pdf format</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Filter Options */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Data yang akan di-export
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 cursor-pointer hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="filterOption"
                  checked={filterOption === "current"}
                  onChange={() => {
                    setFilterOption("current");
                    setShowCustomFilters(false);
                  }}
                  disabled={exporting}
                  className="w-4 h-4 text-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-white">
                    Gunakan Filter Saat Ini
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Export data sesuai dengan filter yang sedang aktif
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 cursor-pointer hover:bg-gray-700/50 transition-colors">
                <input
                  type="radio"
                  name="filterOption"
                  checked={filterOption === "all"}
                  onChange={() => {
                    setFilterOption("all");
                    setShowCustomFilters(false);
                  }}
                  disabled={exporting}
                  className="w-4 h-4 text-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-white">Semua Data</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Export semua data tanpa filter apapun
                  </div>
                </div>
              </label>

              <div>
                <label className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="radio"
                    name="filterOption"
                    checked={filterOption === "custom"}
                    onChange={() => {
                      setFilterOption("custom");
                      setShowCustomFilters(true);
                    }}
                    disabled={exporting}
                    className="w-4 h-4 text-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-white">Filter Kustom</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Atur filter khusus untuk export
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCustomFilters(!showCustomFilters)}
                    disabled={exporting || filterOption !== "custom"}
                    className="p-1 hover:bg-gray-600/50 rounded transition-colors disabled:opacity-50"
                  >
                    {showCustomFilters ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </label>

                {/* Custom Filters Panel */}
                {filterOption === "custom" && showCustomFilters && (
                  <div className="mt-3 p-4 bg-gray-700/20 rounded-lg border border-gray-600/30 space-y-4">
                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Tanggal Mulai
                        </label>
                        <input
                          type="date"
                          value={customFilters.startDate || ""}
                          onChange={(e) =>
                            handleFilterChange("startDate", e.target.value)
                          }
                          disabled={exporting}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Tanggal Akhir
                        </label>
                        <input
                          type="date"
                          value={customFilters.endDate || ""}
                          onChange={(e) =>
                            handleFilterChange("endDate", e.target.value)
                          }
                          disabled={exporting}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Search */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Pencarian
                      </label>
                      <input
                        type="text"
                        value={customFilters.search || ""}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                        placeholder="Cari nama, nomor telepon..."
                        disabled={exporting}
                        className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>

                    {/* Main Filters Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Position */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Posisi
                        </label>
                        <select
                          value={customFilters.appliedPosition || ""}
                          onChange={(e) =>
                            handleFilterChange("appliedPosition", e.target.value)
                          }
                          disabled={exporting}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <option value="" className="bg-gray-800 text-white">
                            Semua Posisi
                          </option>
                          {Object.values(Position)
                            .sort((a, b) =>
                              a.replace(/_/g, " ").localeCompare(b.replace(/_/g, " "))
                            )
                            .map((position) => (
                              <option
                                key={position}
                                value={position}
                                className="bg-gray-800 text-white"
                              >
                                {position.replace(/_/g, " ")}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Status
                        </label>
                        <select
                          value={customFilters.status || ""}
                          onChange={(e) => handleFilterChange("status", e.target.value)}
                          disabled={exporting}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <option value="" className="bg-gray-800 text-white">
                            Semua Status
                          </option>
                          {Object.values(RecruitmentStatus).map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-gray-800 text-white"
                            >
                              {status.replace(/_/g, " ")}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Education */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Pendidikan
                        </label>
                        <select
                          value={customFilters.education || ""}
                          onChange={(e) => handleFilterChange("education", e.target.value)}
                          disabled={exporting}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <option value="" className="bg-gray-800 text-white">
                            Semua Pendidikan
                          </option>
                          {Object.values(EducationLevel).map((education) => (
                            <option
                              key={education}
                              value={education}
                              className="bg-gray-800 text-white"
                            >
                              {education}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Province */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Provinsi
                        </label>
                        <select
                          value={customFilters.province || ""}
                          onChange={(e) => handleFilterChange("province", e.target.value)}
                          disabled={exporting}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <option value="" className="bg-gray-800 text-white">
                            Semua Provinsi
                          </option>
                          {Object.values(Province)
                            .sort((a, b) =>
                              a.replace(/_/g, " ").localeCompare(b.replace(/_/g, " "))
                            )
                            .map((province) => (
                              <option
                                key={province}
                                value={province}
                                className="bg-gray-800 text-white"
                              >
                                {province.replace(/_/g, " ")}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Jenis Kelamin
                        </label>
                        <select
                          value={customFilters.gender || ""}
                          onChange={(e) => handleFilterChange("gender", e.target.value)}
                          disabled={exporting}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <option value="" className="bg-gray-800 text-white">
                            Semua
                          </option>
                          {Object.values(Gender)
                            .sort((a, b) =>
                              a.replace(/_/g, " ").localeCompare(b.replace(/_/g, " "))
                            )
                            .map((gender) => (
                              <option
                                key={gender}
                                value={gender}
                                className="bg-gray-800 text-white"
                              >
                                {gender.replace(/_/g, " ")}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Mining Experience */}
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">
                          Pengalaman Tambang
                        </label>
                        <select
                          value={customFilters.pernahKerjaDiTambang || ""}
                          onChange={(e) =>
                            handleFilterChange("pernahKerjaDiTambang", e.target.value)
                          }
                          disabled={exporting}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <option value="" className="bg-gray-800 text-white">
                            Semua
                          </option>
                          {Object.values(PernahTidak).map((experience) => {
                            const displayText =
                              experience === "PERNAH" ? "Pernah" : "Tidak Pernah";
                            return (
                              <option
                                key={experience}
                                value={experience}
                                className="bg-gray-800 text-white"
                              >
                                {displayText}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    {/* Certificate Multi-Select */}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Sertifikat
                      </label>
                      <CertificateMultiSelect
                        options={Object.values(Certificate)}
                        selected={customFilters.certificate || []}
                        onChange={(selected) =>
                          handleFilterChange("certificate", selected)
                        }
                        placeholder="Pilih sertifikat..."
                      />
                    </div>

                    {/* Clear Filters Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={clearCustomFilters}
                        disabled={exporting}
                        className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                      >
                        Hapus Semua Filter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700/50">
          <button
            onClick={onClose}
            disabled={exporting}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              format === "excel"
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {exporting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Exporting...</span>
              </div>
            ) : (
              `Export ${format.toUpperCase()}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

