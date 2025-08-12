"use client";
import React, { useState, useEffect } from "react";
import {
  RecruitmentFormService,
  RecruitmentFormFilters,
} from "@/services/recruitment.service";
import {
  RecruitmentForm,
  RecruitmentStatus,
  Province,
  EducationLevel,
  Position,
} from "@/types/types";
import Link from "next/link";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { exportRecruitmentToPDF } from "@/utils/export-pdf-recruitdata";

export default function RecruitmentDataPage() {
  const [recruitmentForms, setRecruitmentForms] = useState<RecruitmentForm[]>(
    []
  );
  const [allRecruitmentForms, setAllRecruitmentForms] = useState<RecruitmentForm[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState<RecruitmentFormFilters>({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    province: "",
    education: "",
    appliedPosition: "",
  });
  const [stats, setStats] = useState<any>(null);

  // Fetch recruitment forms
  const fetchRecruitmentForms = async () => {
    try {
      setLoading(true);
      const response = await RecruitmentFormService.getRecruitmentForms(
        filters
      );
      setRecruitmentForms(response.recruitmentForms);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching recruitment forms:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch recruitment data",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all recruitment forms for export
  const fetchAllRecruitmentForms = async () => {
    try {
      const response = await RecruitmentFormService.getRecruitmentForms({
        ...filters,
        limit: 1000, // Get all records
        page: 1,
      });
      setAllRecruitmentForms(response.recruitmentForms);
    } catch (error) {
      console.error("Error fetching all recruitment forms:", error);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await RecruitmentFormService.getRecruitmentStats();
      setStats(response.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchRecruitmentForms();
    fetchAllRecruitmentForms();
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle filter changes
  const handleFilterChange = (
    key: keyof RecruitmentFormFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : (value as number), // Reset to page 1 when other filters change
    }));
  };

  // Export to Excel
  const exportToExcel = () => {
    setExporting(true);
    try {
      const exportData = allRecruitmentForms.map((form) => ({
        "Full Name": form.fullName,
        "WhatsApp Number": form.whatsappNumber,
        "Applied Position": form.appliedPosition?.replace(/_/g, " ") || "Not specified",
        "Education": form.education,
        "Province": form.province.replace(/_/g, " "),
        "Status": form.status,
        "Application Date": form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Recruitment Data");
      
      // Auto-size columns
      const colWidths = exportData.reduce((acc, row) => {
        Object.keys(row).forEach((key, index) => {
          const value = String(row[key as keyof typeof row]);
          acc[index] = Math.max(acc[index] || 0, value.length + 2);
        });
        return acc;
      }, {} as Record<number, number>);
      
      worksheet['!cols'] = Object.values(colWidths).map(width => ({ width }));

      const fileName = `recruitment_data_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      Swal.fire({
        title: "Success",
        text: "Data exported to Excel successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to export data to Excel",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setExporting(false);
    }
  };

  // Export to PDF using utility
  const exportToPDF = () => {
    setExporting(true);
    try {
      exportRecruitmentToPDF(allRecruitmentForms, {
        title: "Recruitment Data Report",
        includeCharts: true,
        includeDetailedTable: true,
        includeSummaryStats: true,
      });

      Swal.fire({
        title: "Success",
        text: "Recruitment report with charts exported successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to export recruitment report",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setExporting(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (
    id: string,
    newStatus: RecruitmentStatus
  ) => {
    try {
      await RecruitmentFormService.updateRecruitmentStatus(id, newStatus);
      await fetchRecruitmentForms(); // Refresh data
      await fetchAllRecruitmentForms(); // Refresh export data
      Swal.fire({
        title: "Success",
        text: "Status updated successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update status",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete recruitment form for ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await RecruitmentFormService.deleteRecruitmentForm(id);
        await fetchRecruitmentForms();
        await fetchAllRecruitmentForms();
        Swal.fire({
          title: "Deleted!",
          text: "Recruitment form has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to delete recruitment form",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  const getStatusColor = (status: RecruitmentStatus) => {
    switch (status) {
      case RecruitmentStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case RecruitmentStatus.ON_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case RecruitmentStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && recruitmentForms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recruitment Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage candidate applications and track recruitment progress
          </p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            disabled={exporting || allRecruitmentForms.length === 0}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            Export Excel
          </button>
          
          <button
            onClick={exportToPDF}
            disabled={exporting || allRecruitmentForms.length === 0}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
            Export PDF
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalForms}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Applications
                </p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {stats.statusBreakdown.map((stat: any) => (
            <div
              key={stat.status}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.count}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {stat.status.replace("_", " ").toLowerCase()}
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                    stat.status
                  )}`}
                >
                  {stat.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search name, phone..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            {Object.values(RecruitmentStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={filters.province}
            onChange={(e) => handleFilterChange("province", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Provinces</option>
            {Object.values(Province).map((province) => (
              <option key={province} value={province}>
                {province.replace("_", " ")}
              </option>
            ))}
          </select>

          <select
            value={filters.education}
            onChange={(e) => handleFilterChange("education", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Education</option>
            {Object.values(EducationLevel).map((education) => (
              <option key={education} value={education}>
                {education}
              </option>
            ))}
          </select>

          <select
            value={filters.appliedPosition}
            onChange={(e) =>
              handleFilterChange("appliedPosition", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Positions</option>
            {Object.values(Position).map((position) => (
              <option key={position} value={position}>
                {position.replace(/_/g, " ")}
              </option>
            ))}
          </select>

          <select
            value={filters.limit}
            onChange={(e) =>
              handleFilterChange("limit", parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Education
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Province
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : recruitmentForms.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No recruitment data found
                  </td>
                </tr>
              ) : (
                recruitmentForms.map((form) => (
                  <tr
                    key={form.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {form.fullName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {form.whatsappNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {form.appliedPosition?.replace(/_/g, " ") ||
                        "Not specified"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {form.education}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {form.province.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={form.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            form.id,
                            e.target.value as RecruitmentStatus
                          )
                        }
                        className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(
                          form.status
                        )}`}
                      >
                        {Object.values(RecruitmentStatus).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/recruitdata/${form.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/inputformdata/${form.id}`}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(form.id, form.fullName)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange("page", pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
              {pagination.page}
            </span>
            <button
              onClick={() => handleFilterChange("page", pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}