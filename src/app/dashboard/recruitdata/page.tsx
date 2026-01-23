"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  RecruitmentFormService,
  RecruitmentFormFilters,
} from "@/services/recruitment.service";
import { RecruitmentForm, RecruitmentStatus } from "@/types/types";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { exportRecruitmentToPDF } from "@/utils/export-pdf-recruitdata";
import { useAuth } from "@/context/useAuth";
import { withAuthGuard } from "@/components/withGuard";
import { MigrationModal } from "@/components/recruitdata/MigrationModal";
import { ExportModal } from "@/components/recruitdata/ExportModal";
import { RecruitmentFilters } from "@/components/recruitdata/RecruitmentFilter";
import { StatsCards } from "@/components/recruitdata/StatsCard";
import { RecruitmentTable } from "@/components/recruitdata/RecruitmentTable";
import { Pagination } from "@/components/recruitdata/Pagination";

function RecruitmentDataPage() {
  const { user } = useAuth();

  const [recruitmentForms, setRecruitmentForms] = useState<RecruitmentForm[]>(
    []
  );
  const [allRecruitmentForms, setAllRecruitmentForms] = useState<
    RecruitmentForm[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [migrationModal, setMigrationModal] = useState<{
    isOpen: boolean;
    candidate: RecruitmentForm | null;
  }>({ isOpen: false, candidate: null });
  const [exportModal, setExportModal] = useState(false);
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [deletingRejected, setDeletingRejected] = useState(false);
  const [lastTotalCount, setLastTotalCount] = useState<number>(0);
  const [isPolling, setIsPolling] = useState(false);
  const filtersRef = useRef(filters);
  
  // Keep filters ref updated
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Fetch recruitment forms
  const fetchRecruitmentForms = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      const response = await RecruitmentFormService.getRecruitmentForms(
        filters
      );
      
      // Check for new data
      if (silent && lastTotalCount > 0 && response.pagination.total > lastTotalCount) {
        const newCount = response.pagination.total - lastTotalCount;
        showNewDataNotification(newCount);
      }
      
      setRecruitmentForms(response.recruitmentForms);
      setPagination(response.pagination);
      setLastTotalCount(response.pagination.total);
      
      // Clear selection when data changes
      setSelectedIds([]);
    } catch (error) {
      console.error("Error fetching recruitment forms:", error);
      if (!silent) {
        Swal.fire({
          title: "Error",
          text: "Gagal memuat data rekrutmen",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  // Show notification for new data
  const showNewDataNotification = useCallback((newCount: number) => {
    // Request browser notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Show browser notification if permitted
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Data Rekrutmen Baru", {
        body: `Ada ${newCount} data rekrutmen baru yang masuk`,
        icon: "/favicon.ico",
        tag: "new-recruitment-data",
      });
    }

    // Show toast notification
    Swal.fire({
      title: "Data Baru!",
      html: `Ada <strong>${newCount}</strong> data rekrutmen baru yang masuk`,
      icon: "info",
      toast: true,
      position: "top-end",
      showConfirmButton: true,
      confirmButtonText: "Lihat",
      confirmButtonColor: "#10b981",
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Refresh data
        fetchRecruitmentForms();
      }
    });
  }, []);

  // Poll for new data - use filtersRef to avoid dependency issues
  useEffect(() => {
    if (!isPolling) return;

    const pollInterval = setInterval(() => {
      // Only poll if page is visible and not loading
      if (document.visibilityState === "visible" && !loading) {
        // Use current filters from ref
        RecruitmentFormService.getRecruitmentForms(filtersRef.current)
          .then((response) => {
            // Check for new data
            setLastTotalCount((prevCount) => {
              if (prevCount > 0 && response.pagination.total > prevCount) {
                const newCount = response.pagination.total - prevCount;
                showNewDataNotification(newCount);
                return response.pagination.total;
              } else if (prevCount === 0) {
                // First poll, just update the count
                return response.pagination.total;
              }
              return prevCount;
            });
          })
          .catch((error) => {
            console.error("Error polling for new data:", error);
          });
      }
    }, 30000); // Poll every 30 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(pollInterval);
    };
  }, [isPolling, loading, showNewDataNotification]);

  // Fetch all recruitment forms for export - FIXED VERSION
  const fetchAllRecruitmentForms = async () => {
    try {
      let allForms: RecruitmentForm[] = [];
      let currentPage = 1;
      let hasMore = true;
      const maxLimit = 50; // Adjust this to your API's actual maximum limit

      while (hasMore) {

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

        allForms = [...allForms, ...response.recruitmentForms];

        // Check if there are more pages
        hasMore =
          response.pagination.hasNextPage &&
          response.recruitmentForms.length === maxLimit;
        currentPage++;

        // Safety check to prevent infinite loop
        if (currentPage > 100) {
          console.warn("Reached maximum page limit (100), stopping fetch");
          break;
        }
      }

      setAllRecruitmentForms(allForms);
    } catch (error) {
      console.error("Error fetching all recruitment forms:", error);
      Swal.fire({
        title: "Error",
        text: "Gagal memuat semua data untuk ekspor",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // Fetch all with current filters applied
  const fetchAllRecruitmentFormsWithFilters = async (
    filtersToUse: RecruitmentFormFilters
  ): Promise<RecruitmentForm[]> => {
    try {
      let allForms: RecruitmentForm[] = [];
      let currentPage = 1;
      let hasMore = true;
      const maxLimit = 50;

      while (hasMore) {

        const response = await RecruitmentFormService.getRecruitmentForms({
          ...filtersToUse,
          page: currentPage,
          limit: maxLimit,
        });

        allForms = [...allForms, ...response.recruitmentForms];

        hasMore =
          response.pagination.hasNextPage &&
          response.recruitmentForms.length > 0;
        currentPage++;

        // Safety check
        if (currentPage > 100) {
          console.warn("Reached maximum page limit, stopping fetch");
          break;
        }
      }

      return allForms;
    } catch (error) {
      console.error("Error fetching recruitment forms with filters:", error);
      throw error;
    }
  };

  // Alternative method: Fetch all without any filters
  const fetchAllRecruitmentFormsNoFilters = async (): Promise<
    RecruitmentForm[]
  > => {
    try {
      let allForms: RecruitmentForm[] = [];
      let currentPage = 1;
      let hasMore = true;
      const maxLimit = 50;

      while (hasMore) {

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

        allForms = [...allForms, ...response.recruitmentForms];

        hasMore =
          response.pagination.hasNextPage &&
          response.recruitmentForms.length > 0;
        currentPage++;

        // Safety check
        if (currentPage > 100) {
          console.warn("Reached maximum page limit, stopping fetch");
          break;
        }
      }

      setAllRecruitmentForms(allForms);
      return allForms;
    } catch (error) {
      console.error("Error fetching all recruitment forms:", error);
      throw error;
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
    // Don't fetch all data on mount - only fetch when needed for export
  }, []);

  // Start polling for new data when component mounts
  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Start polling after initial load
    const timeoutId = setTimeout(() => {
      setIsPolling(true);
    }, 5000); // Start polling 5 seconds after mount

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      setIsPolling(false);
    };
  }, []);

  // Handle visibility change - pause/resume polling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isPolling) {
        setIsPolling(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isPolling]);

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
    // Clear cached export data - will be fetched fresh when export is needed
    setAllRecruitmentForms([]);
    fetchStats();
  };

  // Handle delete already migrated candidate
  const handleDeleteMigratedCandidate = async (form: RecruitmentForm) => {
    const result = await Swal.fire({
      title: "Hapus Kandidat yang Sudah Dimigrasikan?",
      html: `
        <p><strong>${form.fullName}</strong> sudah dimigrasikan ke catatan karyawan.</p>
        <p class="text-sm text-gray-600 mt-2">Ini hanya akan menghapus form rekrutmen. Catatan karyawan akan tetap utuh.</p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus form rekrutmen",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await RecruitmentFormService.deleteRecruitmentForm(form.id);

        await Swal.fire({
        title: "Dihapus!",
        text: "Form rekrutmen telah dihapus. Catatan karyawan tetap utuh.",
        icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Refresh filtered data
        fetchRecruitmentForms();
        // Clear cached export data - will be fetched fresh when export is needed
        setAllRecruitmentForms([]);
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

  // Unified export function
  const handleExport = async (
    exportFilters: RecruitmentFormFilters,
    format: "excel" | "pdf"
  ) => {
    setExporting(true);
    setExportModal(false); // Close modal when export starts

    try {
      // Determine if we should use filters or fetch all
      const useFilters =
        exportFilters.search ||
        exportFilters.status ||
        (exportFilters.certificate && exportFilters.certificate.length > 0) ||
        exportFilters.province ||
        exportFilters.education ||
        exportFilters.appliedPosition ||
        exportFilters.pernahKerjaDiTambang ||
        exportFilters.startDate ||
        exportFilters.endDate;

      let formsToExport: RecruitmentForm[] = [];

      if (useFilters) {
        // Fetch with provided filters
        formsToExport = await fetchAllRecruitmentFormsWithFilters(
          exportFilters
        );
      } else {
        // Fetch all data without filters
        formsToExport = await fetchAllRecruitmentFormsNoFilters();
      }

      if (formsToExport.length === 0) {
        Swal.fire({
        title: "Tidak Ada Data",
        text: "Tidak ada data rekrutmen yang tersedia untuk diekspor",
        icon: "warning",
          confirmButtonColor: "#f59e0b",
        });
        return;
      }

      if (format === "excel") {
        const exportData = formsToExport.map((form) => ({
          "Full Name": form.fullName,
          "WhatsApp Number": form.whatsappNumber,
          Address: form.address,
          Age: form.birthDate
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

        worksheet["!cols"] = Object.values(colWidths).map((width) => ({
          width,
        }));

        // Freeze first 3 columns
        worksheet["!freeze"] = { xSplit: 3, ySplit: 1 };

        const dateStr = new Date().toISOString().split("T")[0];
        const fileName = `recruitment_data_${dateStr}${
          useFilters ? "_filtered" : ""
        }.xlsx`;
        XLSX.writeFile(workbook, fileName);

        Swal.fire({
        title: "Berhasil",
        text: `Berhasil mengekspor ${exportData.length} catatan ke Excel`,
        icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        // PDF export
        exportRecruitmentToPDF(formsToExport, {
          title: `Recruitment Data Report${useFilters ? " (Filtered)" : ""}`,
          includeCharts: true,
          includeDetailedTable: true,
          includeSummaryStats: true,
        });

        Swal.fire({
        title: "Berhasil",
        text: `Berhasil mengekspor ${formsToExport.length} catatan ke PDF`,
        icon: "success",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(`Error exporting to ${format}:`, error);
      Swal.fire({
        title: "Error",
        text: `Gagal mengekspor data ke ${format.toUpperCase()}`,
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
      title: "Konfirmasi Perubahan Status",
      text: `Ubah status menjadi "${newStatus.replace(
        /_/g,
        " "
      )}" untuk ${candidateName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, perbarui!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await RecruitmentFormService.updateRecruitmentStatus(id, newStatus);

        await Swal.fire({
        title: "Berhasil",
        text: "Status berhasil diperbarui",
        icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // Refresh filtered data
        fetchRecruitmentForms();
        // Clear cached export data - will be fetched fresh when export is needed
        setAllRecruitmentForms([]);
        fetchStats();
      } catch (error) {
        Swal.fire({
        title: "Error",
        text: "Gagal memperbarui status",
        icon: "error",
          confirmButtonColor: "#dc2626",
        });
      }
    }
  };

  // Handle delete with confirmation and page refresh
  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: `Hapus form rekrutmen untuk ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await RecruitmentFormService.deleteRecruitmentForm(id);

        await Swal.fire({
        title: "Dihapus!",
        text: "Form rekrutmen telah dihapus.",
        icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // Refresh filtered data
        fetchRecruitmentForms();
        // Clear cached export data - will be fetched fresh when export is needed
        setAllRecruitmentForms([]);
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

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      Swal.fire({
        title: "Tidak Ada Pilihan",
        text: "Silakan pilih minimal satu form rekrutmen untuk dihapus",
        icon: "warning",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      html: `Hapus <strong>${selectedIds.length}</strong> form rekrutmen?<br/><br/>Tindakan ini tidak dapat dibatalkan!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Ya, hapus ${selectedIds.length} form!`,
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        setBulkDeleting(true);
        const response = await RecruitmentFormService.bulkDeleteRecruitmentForms(selectedIds);

        await Swal.fire({
        title: "Dihapus!",
        html: `Berhasil menghapus <strong>${response.deletedCount || selectedIds.length}</strong> form rekrutmen.`,
        icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Clear selection
        setSelectedIds([]);
        // Refresh filtered data
        fetchRecruitmentForms();
        // Clear cached export data
        setAllRecruitmentForms([]);
        fetchStats();
      } catch (error: any) {
        Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Gagal menghapus form rekrutmen",
        icon: "error",
          confirmButtonColor: "#dc2626",
        });
      } finally {
        setBulkDeleting(false);
      }
    }
  };

  // Handle select change
  const handleSelectChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(recruitmentForms.map((form) => form.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Handle delete all rejected candidates
  const handleDeleteAllRejected = async () => {
    try {
      setDeletingRejected(true);
      
      // Fetch all rejected candidates
      let allRejected: RecruitmentForm[] = [];
      let currentPage = 1;
      let hasMore = true;
      const maxLimit = 50;

      while (hasMore) {
        const response = await RecruitmentFormService.getRecruitmentForms({
          status: RecruitmentStatus.REJECTED,
          page: currentPage,
          limit: maxLimit,
        });

        allRejected = [...allRejected, ...response.recruitmentForms];
        hasMore = response.pagination.hasNextPage && response.recruitmentForms.length > 0;
        currentPage++;

        // Safety check
        if (currentPage > 100) {
          console.warn("Reached maximum page limit, stopping fetch");
          break;
        }
      }

      if (allRejected.length === 0) {
        await Swal.fire({
          title: "No Rejected Data",
          text: "Tidak ada data dengan status REJECTED untuk dihapus",
          icon: "info",
          confirmButtonColor: "#3b82f6",
        });
        return;
      }

      // Show confirmation with count
      const result = await Swal.fire({
        title: "Hapus Semua Data Rejected?",
        html: `
          <p>Anda akan menghapus <strong>${allRejected.length}</strong> data dengan status REJECTED.</p>
          <p class="text-sm text-gray-600 mt-2">Tindakan ini tidak dapat dibatalkan!</p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: `Ya, hapus ${allRejected.length} data!`,
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        const rejectedIds = allRejected.map((form) => form.id);
        const batchSize = 50; // Reduced batch size to avoid timeout (deleting files from Cloudinary takes time)
        const batches: string[][] = [];
        
        // Split into batches
        for (let i = 0; i < rejectedIds.length; i += batchSize) {
          batches.push(rejectedIds.slice(i, i + batchSize));
        }

        let totalDeleted = 0;
        let totalFailed = 0;
        const failedBatches: number[] = [];

        // Show progress dialog
        Swal.fire({
          title: "Menghapus Data...",
          html: `Memproses batch 1 dari ${batches.length}...<br/><small>Harap tunggu, proses ini mungkin memakan waktu beberapa menit</small>`,
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Delete each batch with retry logic
        for (let i = 0; i < batches.length; i++) {
          let retryCount = 0;
          const maxRetries = 2;
          let batchSuccess = false;

          while (retryCount <= maxRetries && !batchSuccess) {
            try {
              // Update progress
              const retryText = retryCount > 0 ? ` (Retry ${retryCount}/${maxRetries})` : '';
              Swal.update({
                html: `Memproses batch ${i + 1} dari ${batches.length}${retryText}...<br/>Berhasil: ${totalDeleted}, Gagal: ${totalFailed}<br/><small>Harap tunggu, proses ini mungkin memakan waktu beberapa menit</small>`,
              });

              const response = await RecruitmentFormService.bulkDeleteRecruitmentForms(batches[i]);
              totalDeleted += response.deletedCount || batches[i].length;
              batchSuccess = true;
              
              // Small delay between batches to reduce server load
              if (i < batches.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            } catch (error: any) {
              console.error(`Error deleting batch ${i + 1} (attempt ${retryCount + 1}):`, error);
              
              // Check if it's a timeout error
              const isTimeout = error.code === 'ECONNABORTED' || 
                               error.message?.includes('timeout') ||
                               error.message?.includes('ECONNABORTED');
              
              if (isTimeout && retryCount < maxRetries) {
                // Retry on timeout
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
              } else {
                // Max retries reached or non-timeout error
                totalFailed += batches[i].length;
                failedBatches.push(i + 1);
                batchSuccess = true; // Stop retrying this batch
                
                // Continue with next batch even if one fails
                if (error.response?.data?.message?.includes("Maximum 100")) {
                  console.warn(`Batch ${i + 1} exceeded limit, skipping`);
                }
              }
            }
          }
        }

        // Show final result
        if (totalFailed === 0) {
          await Swal.fire({
            title: "Berhasil!",
            html: `Berhasil menghapus <strong>${totalDeleted}</strong> data dengan status REJECTED.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          const failedBatchesText = failedBatches.length > 0 
            ? `<br/><small>Batch yang gagal: ${failedBatches.join(', ')}</small>`
            : '';
          await Swal.fire({
            title: "Selesai dengan Peringatan",
            html: `
              <p>Berhasil menghapus: <strong>${totalDeleted}</strong> data</p>
              <p>Gagal menghapus: <strong>${totalFailed}</strong> data</p>
              ${failedBatchesText}
              <p class="text-sm text-gray-600 mt-2">Silakan coba hapus ulang data yang gagal atau hubungi administrator.</p>
            `,
            icon: "warning",
            confirmButtonColor: "#f59e0b",
          });
        }

        // Refresh data
        fetchRecruitmentForms();
        setAllRecruitmentForms([]);
        fetchStats();
      }
    } catch (error: any) {
      console.error("Error deleting rejected candidates:", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Gagal menghapus data rejected",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setDeletingRejected(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 relative min-h-[400px]">
      {/* Improved Loading Overlay - Only show when loading data, not during export */}
      {loading && !exporting && (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-gray-900/95 to-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-slate-800/90 to-gray-800/90 rounded-2xl border border-slate-600/30 shadow-2xl">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"></div>
              <div className="absolute inset-0 animate-ping rounded-full border-4 border-blue-500/20"></div>
            </div>
            <div className="text-center">
              <p className="text-white text-lg sm:text-xl font-semibold mb-2">
                Memuat Data Rekrutmen...
              </p>
              <p className="text-gray-400 text-sm">
                Mengambil aplikasi kandidat dan statistik
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Migration Modal */}
      {migrationModal.candidate && (
        <MigrationModal
          candidate={migrationModal.candidate}
          isOpen={migrationModal.isOpen}
          onClose={closeMigrationModal}
          onSuccess={handleMigrationSuccess}
        />
      )}

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModal}
        onClose={() => setExportModal(false)}
        onExport={handleExport}
        currentFilters={filters}
        exporting={exporting}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-400"
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
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Data Rekrutmen
            </span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Kelola aplikasi kandidat dan lacak kemajuan rekrutmen
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Export Button */}
          <button
            onClick={() => setExportModal(true)}
            disabled={exporting}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all backdrop-blur-sm border border-blue-500/30 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
          <svg
            className="w-5 h-5"
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
            Ekspor Data
          </button>
          
          {/* Delete All Rejected Button - Only for HR and ADMIN */}
          {(user?.role === "HR" || user?.role === "ADMIN") && (
            <button
              onClick={handleDeleteAllRejected}
              disabled={deletingRejected}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all backdrop-blur-sm border border-orange-500/30 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              {deletingRejected ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Menghapus...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Hapus Semua Ditolak
                </>
              )}
            </button>
          )}

          {selectedIds.length > 0 && (user?.role === "HR" || user?.role === "ADMIN") && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all backdrop-blur-sm border border-red-500/30 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
            {bulkDeleting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Menghapus...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Hapus Terpilih ({selectedIds.length})
              </>
            )}
            </button>
          )}
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
          onStatusUpdate={handleStatusUpdate}
          onMigrate={openMigrationModal}
          onDelete={handleDelete}
          onDeleteMigrated={handleDeleteMigratedCandidate}
          userRole={user?.role}
          selectedIds={selectedIds}
          onSelectChange={handleSelectChange}
          onSelectAll={handleSelectAll}
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
