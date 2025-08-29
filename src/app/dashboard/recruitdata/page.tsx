"use client";
import React, { useState, useEffect } from "react";
import {
  RecruitmentFormService,
  RecruitmentFormFilters,
} from "@/services/recruitment.service";
import {
  RecruitmentForm,
  RecruitmentStatus,
} from "@/types/types";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { exportRecruitmentToPDF } from "@/utils/export-pdf-recruitdata";
import { useAuth } from "@/context/useAuth";
import { withAuthGuard } from "@/components/withGuard";
import { MigrationModal } from "@/components/recruitdata/MigrationModal";
import { RecruitmentFilters } from "@/components/recruitdata/RecruitmentFilter";
import { StatsCards } from "@/components/recruitdata/StatsCard";
import { RecruitmentTable } from "@/components/recruitdata/RecruitmentTable";
import { Pagination } from "@/components/recruitdata/Pagination";

function RecruitmentDataPage() {
  const { user } = useAuth();

  const [recruitmentForms, setRecruitmentForms] = useState<RecruitmentForm[]>([]);
  const [allRecruitmentForms, setAllRecruitmentForms] = useState<RecruitmentForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [migrationModal, setMigrationModal] = useState<{
    isOpen: boolean;
    candidate: RecruitmentForm | null;
  }>({ isOpen: false, candidate: null });
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
    certificate: [],
    province: "",
    education: "",
    appliedPosition: "",
    startDate: "",
    endDate: "",
  });
  const [stats, setStats] = useState<any>(null);

  // Fetch recruitment forms
  const fetchRecruitmentForms = async () => {
    try {
      setLoading(true);
      const response = await RecruitmentFormService.getRecruitmentForms(filters);
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
        limit: 1000,
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
    value: string | number | string[]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : (value as number),
    }));
  };

  // Handle migration modal
  const openMigrationModal = (candidate: RecruitmentForm) => {
    setMigrationModal({ isOpen: true, candidate });
  };

  const closeMigrationModal = () => {
    setMigrationModal({ isOpen: false, candidate: null });
  };

  const handleMigrationSuccess = () => {
    fetchRecruitmentForms();
    fetchAllRecruitmentForms();
    fetchStats();
  };

  // Handle delete already migrated candidate
  const handleDeleteMigratedCandidate = async (form: RecruitmentForm) => {
    const result = await Swal.fire({
      title: "Delete Already Migrated Candidate?",
      html: `
        <p><strong>${form.fullName}</strong> has already been migrated to employee records.</p>
        <p class="text-sm text-gray-600 mt-2">This will only delete the recruitment form. The employee record will remain intact.</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete recruitment form",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await RecruitmentFormService.deleteRecruitmentForm(form.id);

        await Swal.fire({
          title: "Deleted!",
          text: "Recruitment form has been deleted. Employee record remains intact.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        window.location.reload();
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

  // Export to Excel
  const exportToExcel = () => {
    setExporting(true);
    try {
      const exportData = allRecruitmentForms.map((form) => ({
        "Full Name": form.fullName,
        "WhatsApp Number": form.whatsappNumber,
        "Applied Position":
          form.appliedPosition?.replace(/_/g, " ") || "Not specified",
        Education: form.education,
        Province: form.province.replace(/_/g, " "),
        Certificates: form.certificate.join(", "),
        Status: form.status,
        "Already Migrated": form.hiredEmployee ? "Yes" : "No",
        "Employee ID": form.hiredEmployee?.employeeId || "N/A",
        "Application Date": form.createdAt
          ? new Date(form.createdAt).toLocaleDateString()
          : "N/A",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Recruitment Data");

      const colWidths = exportData.reduce((acc, row) => {
        Object.keys(row).forEach((key, index) => {
          const value = String(row[key as keyof typeof row]);
          acc[index] = Math.max(acc[index] || 0, value.length + 2);
        });
        return acc;
      }, {} as Record<number, number>);

      worksheet["!cols"] = Object.values(colWidths).map((width) => ({ width }));

      const fileName = `recruitment_data_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
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

  // Handle status update with confirmation
  const handleStatusUpdate = async (
    id: string,
    newStatus: RecruitmentStatus,
    candidateName: string
  ) => {
    const result = await Swal.fire({
      title: "Confirm Status Update",
      text: `Change status to "${newStatus.replace(
        /_/g,
        " "
      )}" for ${candidateName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await RecruitmentFormService.updateRecruitmentStatus(id, newStatus);

        await Swal.fire({
          title: "Success",
          text: "Status updated successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        window.location.reload();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Failed to update status",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  // Handle delete with confirmation and page refresh
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

        await Swal.fire({
          title: "Deleted!",
          text: "Recruitment form has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        window.location.reload();
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

  if (loading && recruitmentForms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Migration Modal */}
      {migrationModal.candidate && (
        <MigrationModal
          candidate={migrationModal.candidate}
          isOpen={migrationModal.isOpen}
          onClose={closeMigrationModal}
          onSuccess={handleMigrationSuccess}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Recruitment Data
          </h1>
          <p className="text-gray-300">
            Manage candidate applications and track recruitment progress
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            disabled={exporting || allRecruitmentForms.length === 0}
            className="px-4 py-2 bg-green-600/80 hover:bg-green-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm border border-green-500/30"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            )}
            Export Excel
          </button>

          <button
            onClick={exportToPDF}
            disabled={exporting || allRecruitmentForms.length === 0}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm border border-red-500/30"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            )}
            Export PDF
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Filters - Higher z-index to ensure dropdowns appear above table */}
      <div className="relative z-20">
        <RecruitmentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Table - Lower z-index */}
      <div className="relative z-10">
        <RecruitmentTable
          recruitmentForms={recruitmentForms}
          loading={loading}
          onStatusUpdate={handleStatusUpdate}
          onMigrate={openMigrationModal}
          onDelete={handleDelete}
          onDeleteMigrated={handleDeleteMigratedCandidate}
        />
      </div>

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={(page) => handleFilterChange("page", page)}
      />
    </div>
  );
}

export default withAuthGuard(RecruitmentDataPage);