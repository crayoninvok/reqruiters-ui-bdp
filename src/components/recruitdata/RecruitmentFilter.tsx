import React from "react";
import {
  Position,
  EducationLevel,
  Gender,
  Province,
  RecruitmentStatus,
  Certificate,
  PernahTidak
} from "@/types/types";
import { CertificateMultiSelect } from "./CertificateMultiSelect";
import { RecruitmentFormFilters } from "@/services/recruitment.service";

interface RecruitmentFiltersProps {
  filters: RecruitmentFormFilters;
  onFilterChange: (
    key: keyof RecruitmentFormFilters,
    value: string | number | string[]
  ) => void;
}

export const RecruitmentFilters: React.FC<RecruitmentFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-sm border border-slate-600/30 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
      {/* Date Range Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 pb-4 border-b border-gray-600/30">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange("startDate", e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm placeholder-gray-400 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Tanggal Akhir
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange("endDate", e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm placeholder-gray-400 text-sm"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              onFilterChange("startDate", "");
              onFilterChange("endDate", "");
            }}
            className="px-4 py-2 text-sm bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 rounded-md transition-colors flex items-center gap-2 backdrop-blur-sm border border-gray-600/30"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Hapus Tanggal
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Jenis Kelamin
          </label>
          <select
            value={filters.gender || ""}
            onChange={(e) => onFilterChange("gender", e.target.value)}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
          >
            <option value="" className="bg-gray-800 text-white">
              Semua Jenis Kelamin
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
      </div>

      {/* Main filters - Updated to 7 columns to accommodate new filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Pencarian
          </label>
          <input
            type="text"
            placeholder="Cari nama, telepon..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm placeholder-gray-400 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Posisi
          </label>
          <select
            value={filters.appliedPosition}
            onChange={(e) => onFilterChange("appliedPosition", e.target.value)}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
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

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Pendidikan
          </label>
          <select
            value={filters.education}
            onChange={(e) => onFilterChange("education", e.target.value)}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
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

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Provinsi
          </label>
          <select
            value={filters.province}
            onChange={(e) => onFilterChange("province", e.target.value)}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
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

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
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

        {/* FIXED: Mining Experience Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Pengalaman Tambang
          </label>
          <select
            value={filters.pernahKerjaDiTambang || ""}
            onChange={(e) => onFilterChange("pernahKerjaDiTambang", e.target.value)}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
          >
            <option value="" className="bg-gray-800 text-white">
              Semua Pengalaman
            </option>
            {Object.values(PernahTidak).map((experience) => {
              const displayText = experience === "PERNAH" ? "Pernah" : "Tidak Pernah";

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

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Item per halaman
          </label>
          <select
            value={filters.limit}
            onChange={(e) => onFilterChange("limit", parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
          >
            <option value={10} className="bg-gray-800 text-white">
              10 per halaman
            </option>
            <option value={25} className="bg-gray-800 text-white">
              25 per halaman
            </option>
            <option value={50} className="bg-gray-800 text-white">
              50 per halaman
            </option>
          </select>
        </div>
      </div>

      {/* Certificate Multi-Select */}
      <div className="mt-4 pt-4 border-t border-gray-600/30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <CertificateMultiSelect
            options={Object.values(Certificate)}
            selected={filters.certificate || []}
            onChange={(selected) => onFilterChange("certificate", selected)}
            placeholder="Pilih sertifikat untuk filter..."
          />

          {/* Filter summary - Updated to include mining experience */}
          <div className="lg:col-span-2 flex items-end">
            <div className="text-sm text-gray-400">
              {(filters.search ||
                filters.appliedPosition ||
                filters.education ||
                filters.gender ||
                filters.province ||
                filters.status ||
                filters.pernahKerjaDiTambang ||
                (filters.certificate && filters.certificate.length > 0) ||
                filters.startDate ||
                filters.endDate) && (
                <div className="flex flex-wrap gap-2">
                  <span className="font-medium text-gray-300">
                    Filter aktif:
                  </span>
                  {filters.search && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600/50 text-gray-200 text-xs rounded backdrop-blur-sm border border-gray-500/30">
                      Pencarian: {filters.search}
                    </span>
                  )}
                  {filters.appliedPosition && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600/50 text-gray-200 text-xs rounded backdrop-blur-sm border border-gray-500/30">
                      Posisi: {filters.appliedPosition.replace(/_/g, " ")}
                    </span>
                  )}
                  {filters.education && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600/50 text-gray-200 text-xs rounded backdrop-blur-sm border border-gray-500/30">
                      Pendidikan: {filters.education}
                    </span>
                  )}
                  {filters.gender && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600/50 text-gray-200 text-xs rounded backdrop-blur-sm border border-gray-500/30">
                      Jenis Kelamin: {filters.gender.replace(/_/g, " ")}
                    </span>
                  )}
                  {filters.province && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600/50 text-gray-200 text-xs rounded backdrop-blur-sm border border-gray-500/30">
                      Provinsi: {filters.province.replace(/_/g, " ")}
                    </span>
                  )}
                  {filters.status && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600/50 text-gray-200 text-xs rounded backdrop-blur-sm border border-gray-500/30">
                      Status: {filters.status}
                    </span>
                  )}
                  {filters.pernahKerjaDiTambang && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600/50 text-gray-200 text-xs rounded backdrop-blur-sm border border-gray-500/30">
                      Tambang: {String(filters.pernahKerjaDiTambang) === "PERNAH" ? "Pernah" : "Tidak pernah"}
                    </span>
                  )}
                  {filters.certificate && filters.certificate.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600/50 text-gray-200 text-xs rounded backdrop-blur-sm border border-gray-500/30">
                      Sertifikat: {filters.certificate.length} dipilih
                    </span>
                  )}
                  {(filters.startDate || filters.endDate) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600/50 text-gray-200 text-xs rounded backdrop-blur-sm border border-gray-500/30">
                      Rentang tanggal aktif
                    </span>
                  )}
                  <button
                    onClick={() => {
                      Object.keys(filters).forEach((key) => {
                        if (key === "page")
                          onFilterChange(
                            key as keyof RecruitmentFormFilters,
                            1
                          );
                        else if (key === "limit")
                          onFilterChange(
                            key as keyof RecruitmentFormFilters,
                            10
                          );
                        else if (key === "certificate")
                          onFilterChange(
                            key as keyof RecruitmentFormFilters,
                            []
                          );
                        else
                          onFilterChange(
                            key as keyof RecruitmentFormFilters,
                            ""
                          );
                      });
                    }}
                    className="text-xs text-red-400 hover:text-red-300 underline transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>    
    </div>
  );
};