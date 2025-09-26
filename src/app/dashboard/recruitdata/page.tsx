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
    pernahKerjaDiTambang: "",
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

  // Fetch all recruitment forms for export - FIXED VERSION
  const fetchAllRecruitmentForms = async () => {
    try {
      let allForms: RecruitmentForm[] = [];
      let currentPage = 1;
      let hasMore = true;
      const maxLimit = 50; // Adjust this to your API's actual maximum limit

      console.log("Starting to fetch all recruitment forms for export...");

      while (hasMore) {
        console.log(`Fetching page ${currentPage}...`);
        
        const response = await RecruitmentFormService.getRecruitmentForms({
          ...filters,
          search: "", // Reset search for export to get all data
          status: "", // Reset status filter for export
          certificate: [], // Reset certificate filter for export
          province: "", // Reset province filter for export
          education: "", // Reset education filter for export
          appliedPosition: "", // Reset applied position filter for export
          pernahKerjaDiTambang: "", // Reset mining experience filter for export
          startDate: "", // Reset date filters for export
          endDate: "",
          limit: maxLimit,
          page: currentPage,
        });

        console.log(`Page ${currentPage} fetched: ${response.recruitmentForms.length} records`);
        
        allForms = [...allForms, ...response.recruitmentForms];
        
        // Check if there are more pages
        hasMore = response.pagination.hasNextPage && response.recruitmentForms.length === maxLimit;
        currentPage++;

        // Safety check to prevent infinite loop
        if (currentPage > 100) {
          console.warn("Reached maximum page limit (100), stopping fetch");
          break;
        }
      }

      console.log(`Total forms fetched for export: ${allForms.length}`);
      setAllRecruitmentForms(allForms);
    } catch (error) {
      console.error("Error fetching all recruitment forms:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch all data for export",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // Alternative method: Fetch all without any filters
  const fetchAllRecruitmentFormsNoFilters = async () => {
    try {
      let allForms: RecruitmentForm[] = [];
      let currentPage = 1;
      let hasMore = true;
      const maxLimit = 50;

      console.log("Fetching ALL recruitment forms without any filters...");

      while (hasMore) {
        console.log(`Fetching page ${currentPage}...`);
        
        const response = await RecruitmentFormService.getRecruitmentForms({
          page: currentPage,
          limit: maxLimit,
          search: "",
          status: "",
          certificate: [],
          province: "",
          pernahKerjaDiTambang: "",
          education: "",
          appliedPosition: "",
          startDate: "",
          endDate: "",
        });

        console.log(`Page ${currentPage} fetched: ${response.recruitmentForms.length} records`);
        
        allForms = [...allForms, ...response.recruitmentForms];
        
        hasMore = response.pagination.hasNextPage && response.recruitmentForms.length > 0;
        currentPage++;

        // Safety check
        if (currentPage > 100) {
          console.warn("Reached maximum page limit, stopping fetch");
          break;
        }
      }

      console.log(`Total forms fetched: ${allForms.length}`);
      setAllRecruitmentForms(allForms);
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
  }, [filters]);

  useEffect(() => {
    fetchStats();
    // Fetch all data when component mounts, not when filters change
    fetchAllRecruitmentFormsNoFilters();
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
    fetchAllRecruitmentFormsNoFilters(); // Refresh all data
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

        // Refresh both filtered and all data
        fetchRecruitmentForms();
        fetchAllRecruitmentFormsNoFilters();
        fetchStats();
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

  // Export to Excel - IMPROVED VERSION
  const exportToExcel = async () => {
    setExporting(true);
    try {
      // Fetch fresh data for export to ensure we have the latest
      await fetchAllRecruitmentFormsNoFilters();
      
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log(`Exporting ${allRecruitmentForms.length} records to Excel`);

      if (allRecruitmentForms.length === 0) {
        Swal.fire({
          title: "No Data",
          text: "No recruitment data available for export",
          icon: "warning",
          confirmButtonColor: "#f59e0b",
        });
        return;
      }

      const exportData = allRecruitmentForms.map((form) => ({
        "Full Name": form.fullName,
        "WhatsApp Number": form.whatsappNumber,
        "Address": form.address,
        "Age": form.birthDate
          ? Math.floor(
              (new Date().getTime() - new Date(form.birthDate).getTime()) /
                (1000 * 60 * 60 * 24 * 365)
            )
          : "N/A",
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
        "Last Updated": form.updatedAt,
        "Processed By": form.statusUpdatedBy?.name || "Still Pending",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Recruitment Data");

      // Set column widths
      const colWidths = exportData.reduce((acc, row) => {
        Object.keys(row).forEach((key, index) => {
          const value = String(row[key as keyof typeof row]);
          acc[index] = Math.max(acc[index] || 0, value.length + 2);
        });
        return acc;
      }, {} as Record<number, number>);

      worksheet["!cols"] = Object.values(colWidths).map((width) => ({ width }));

      // Freeze first 3 columns (A, B, C) - this will freeze Full Name, WhatsApp Number, and Address
      worksheet["!freeze"] = { xSplit: 3, ySplit: 1 };

      const fileName = `recruitment_data_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(workbook, fileName);

      Swal.fire({
        title: "Success",
        text: `Successfully exported ${exportData.length} records to Excel`,
        icon: "success",
        timer: 3000,
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

  // Export to PDF using utility - IMPROVED VERSION
  const exportToPDF = async () => {
    setExporting(true);
    try {
      // Fetch fresh data for export
      await fetchAllRecruitmentFormsNoFilters();
      
      // Wait a bit for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log(`Exporting ${allRecruitmentForms.length} records to PDF`);

      if (allRecruitmentForms.length === 0) {
        Swal.fire({
          title: "No Data",
          text: "No recruitment data available for export",
          icon: "warning",
          confirmButtonColor: "#f59e0b",
        });
        return;
      }

      exportRecruitmentToPDF(allRecruitmentForms, {
        title: "Recruitment Data Report",
        includeCharts: true,
        includeDetailedTable: true,
        includeSummaryStats: true,
      });

      Swal.fire({
        title: "Success",
        text: `Successfully exported ${allRecruitmentForms.length} records to PDF`,
        icon: "success",
        timer: 3000,
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

        // Refresh both filtered and all data
        fetchRecruitmentForms();
        fetchAllRecruitmentFormsNoFilters();
        fetchStats();
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

        // Refresh both filtered and all data
        fetchRecruitmentForms();
        fetchAllRecruitmentFormsNoFilters();
        fetchStats();
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

  // Manual refresh function for export data
  const refreshExportData = async () => {
    setExporting(true);
    try {
      await fetchAllRecruitmentFormsNoFilters();
      Swal.fire({
        title: "Data Refreshed",
        text: `Found ${allRecruitmentForms.length} total records`,
        icon: "info",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error refreshing export data:", error);
    } finally {
      setExporting(false);
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
          <p className="text-sm text-gray-400">
            Export data: {allRecruitmentForms.length} total records available
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          {/* Refresh Export Data Button */}
          <button
            onClick={refreshExportData}
            disabled={exporting}
            className="px-3 py-2 bg-blue-600/80 hover:bg-blue-600 disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm border border-blue-500/30"
            title="Refresh export data to get latest records"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
            Refresh
          </button>

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
            Export Excel ({allRecruitmentForms.length})
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
            Export PDF ({allRecruitmentForms.length})
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