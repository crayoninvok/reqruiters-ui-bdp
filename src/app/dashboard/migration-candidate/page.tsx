"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Download,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  User,
  FileText,
  UserPlus,
  X,
} from "lucide-react";
import { RecruitmentFormService } from "@/services/recruitment.service";
import {
  RecruitmentForm,
  RecruitmentStatus,
  Position,
  Department,
  ContractType,
  ShiftPattern,
  MigrateToHiredRequest,
} from "@/types/types";
import { withAuthGuard } from "@/components/withGuard";
import Link from "next/link";
import Swal from "sweetalert2";
import { useAuth } from "@/context/useAuth";

const MigrationCandidatePage: React.FC = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<RecruitmentForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    page: number;
    limit: number;
    status: RecruitmentStatus;
    search?: string;
  }>({
    page: 1,
    limit: 20,
    status: RecruitmentStatus.COMPLETED,
    search: undefined,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<RecruitmentForm | null>(null);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hiringLoading, setHiringLoading] = useState(false);
  const [hireFormData, setHireFormData] = useState<MigrateToHiredRequest>({
    recruitmentFormId: "",
    hiredPosition: Position.PRODUCTION_GROUP_LEADER,
    department: Department.PRODUCTION_ENGINEERING,
    startDate: new Date().toISOString().split("T")[0],
    contractType: ContractType.PERMANENT,
    shiftPattern: ShiftPattern.DAY_SHIFT,
  });

  // Load candidates with COMPLETED status
  const loadCandidates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await RecruitmentFormService.getRecruitmentForms({
        ...filters,
        status: RecruitmentStatus.COMPLETED,
      });
      setCandidates(response.recruitmentForms);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load candidates");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1,
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Handle candidate selection
  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates((prev) =>
      prev.includes(candidateId)
        ? prev.filter((id) => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === candidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(candidates.map((c) => c.id));
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format position
  const formatPosition = (position: string) => {
    return position.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Format enum value
  const formatEnumValue = (value: string) => {
    return value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Format date time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle open hire modal
  const handleOpenHireModal = (candidate: RecruitmentForm) => {
    setSelectedCandidate(candidate);
    setHireFormData({
      recruitmentFormId: candidate.id,
      hiredPosition: candidate.appliedPosition || Position.PRODUCTION_GROUP_LEADER,
      department: Department.PRODUCTION_ENGINEERING,
      startDate: new Date().toISOString().split("T")[0],
      contractType: ContractType.PERMANENT,
      shiftPattern: ShiftPattern.DAY_SHIFT,
    });
    setShowHireModal(true);
  };

  // Handle close hire modal
  const handleCloseHireModal = () => {
    setShowHireModal(false);
    setSelectedCandidate(null);
    setHireFormData({
      recruitmentFormId: "",
      hiredPosition: Position.PRODUCTION_GROUP_LEADER,
      department: Department.PRODUCTION_ENGINEERING,
      startDate: new Date().toISOString().split("T")[0],
      contractType: ContractType.PERMANENT,
      shiftPattern: ShiftPattern.DAY_SHIFT,
    });
  };

  // Handle hire candidate (update status to HIRED and migrate)
  const handleHireCandidate = async () => {
    if (!selectedCandidate) return;

    // Validate required fields
    if (!hireFormData.employeeId || !hireFormData.hiredPosition || !hireFormData.department || !hireFormData.startDate) {
      Swal.fire({
        title: "Validasi Error",
        text: "Employee ID, Posisi, Departemen, dan Tanggal Mulai harus diisi",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    setHiringLoading(true);
    try {
      // Step 1: Update status to HIRED
      await RecruitmentFormService.updateRecruitmentStatus(
        selectedCandidate.id,
        RecruitmentStatus.HIRED
      );

      // Step 2: Migrate to HiredEmployee
      const response = await RecruitmentFormService.migrateToHiredEmployee(hireFormData);

      await Swal.fire({
        title: "Berhasil!",
        text: `${selectedCandidate.fullName} berhasil diubah status menjadi HIRED dan dimigrasikan ke data karyawan dengan ID: ${response.hiredEmployee.employeeId}`,
        icon: "success",
        timer: 3000,
        showConfirmButton: false,
      });

      // Reload candidates
      loadCandidates();
      handleCloseHireModal();
    } catch (error: any) {
      Swal.fire({
        title: "Gagal",
        text: error.response?.data?.message || "Gagal mengubah status kandidat menjadi HIRED",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setHiringLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8 relative min-h-[400px]">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-gray-300">Memuat data kandidat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 relative min-h-[400px]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-lg border border-amber-500/30">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />
              </div>
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                Kandidat Selesai (Completed)
              </span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Daftar kandidat yang telah menyelesaikan proses rekrutmen
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white rounded-lg transition-all shadow-lg border border-gray-600/50 hover:border-gray-500"
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-300 backdrop-blur-sm">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-200"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, atau nomor telepon..."
            className="w-full pl-12 pr-4 py-3.5 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 bg-gray-800/90 text-white placeholder-gray-500 backdrop-blur-sm shadow-lg transition-all"
            value={filters.search || ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all hover:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Total Kandidat</p>
              <div className="text-3xl font-bold text-white">
                {pagination.total}
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all hover:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Ditampilkan</p>
              <div className="text-3xl font-bold text-amber-400">
                {candidates.length}
              </div>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <Eye className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm p-5 rounded-xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all hover:border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-1">Dipilih</p>
              <div className="text-3xl font-bold text-green-400">
                {selectedCandidates.length}
              </div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden shadow-xl">
        {candidates.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex p-4 bg-gray-700/50 rounded-full mb-4">
              <Users className="w-12 h-12 text-gray-500" />
            </div>
            <p className="text-lg font-semibold text-gray-300 mb-2">Tidak ada kandidat ditemukan</p>
            <p className="text-sm text-gray-500">Coba ubah pencarian atau filter Anda</p>
          </div>
        ) : (
          <>
            {/* Table Header with Column Labels */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm border-b border-gray-700/50">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={
                      selectedCandidates.length === candidates.length &&
                      candidates.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-amber-600 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
                    title="Pilih Semua"
                  />
                </div>
                <div className="col-span-3">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Informasi Kandidat
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Posisi & Pendidikan
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Kontak & Lokasi
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Status & Tanggal
                  </span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Aksi
                  </span>
                </div>
              </div>
              {selectedCandidates.length > 0 && (
                <div className="mt-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <span className="text-sm font-medium text-amber-400">
                    {selectedCandidates.length} kandidat dipilih
                  </span>
                </div>
              )}
            </div>

            {/* Table Content */}
            <div className="divide-y divide-gray-700/50">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="px-6 py-5 hover:bg-gray-700/20 transition-all duration-200"
                >
                  <div className="grid grid-cols-12 gap-4 items-start">
                    {/* Checkbox */}
                    <div className="col-span-1 pt-1">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleSelectCandidate(candidate.id)}
                        className="w-4 h-4 text-amber-600 bg-gray-700 border-gray-600 rounded focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
                      />
                    </div>

                    {/* Informasi Kandidat */}
                    <div className="col-span-3">
                      <div className="flex items-start gap-3">
                        {candidate.documentPhotoUrl ? (
                          <img
                            src={candidate.documentPhotoUrl}
                            alt={candidate.fullName}
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-600/50 shadow-md"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-gray-600/50 flex items-center justify-center shadow-md">
                            <User className="w-7 h-7 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate text-base mb-1">
                            {candidate.fullName}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            {candidate.gender && (
                              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                {formatEnumValue(candidate.gender)}
                              </span>
                            )}
                            {candidate.birthDate && (
                              <span className="text-xs text-gray-400">
                                {new Date(candidate.birthDate).toLocaleDateString("id-ID", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                          {candidate.ktp && (
                            <p className="text-xs text-gray-500 mt-1.5">
                              KTP: <span className="font-mono">{candidate.ktp}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Posisi & Pendidikan */}
                    <div className="col-span-2">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Briefcase className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {candidate.appliedPosition
                                ? formatPosition(candidate.appliedPosition)
                                : "Tidak ditentukan"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <GraduationCap className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-300">
                              {candidate.education ? formatEnumValue(candidate.education) : "-"}
                            </p>
                            {candidate.schoolName && (
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {candidate.schoolName}
                              </p>
                            )}
                            {candidate.jurusan && (
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {candidate.jurusan}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Kontak & Lokasi */}
                    <div className="col-span-2">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-gray-200 truncate">
                            {candidate.whatsappNumber}
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-300">
                              {candidate.province ? formatEnumValue(candidate.province) : "-"}
                            </p>
                            {candidate.address && (
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {candidate.address.substring(0, 40)}
                                {candidate.address.length > 40 ? "..." : ""}
                              </p>
                            )}
                            {candidate.religion && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                Agama: {formatEnumValue(candidate.religion)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Tanggal */}
                    <div className="col-span-2">
                      <div className="space-y-2.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-green-900/40 to-emerald-900/40 text-green-300 border border-green-500/30 shadow-sm">
                          <CheckCircle className="w-3.5 h-3.5" />
                          COMPLETED
                        </span>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-400">Diterima</p>
                              <p className="text-xs font-medium text-gray-300">
                                {formatDate(candidate.createdAt)}
                              </p>
                            </div>
                          </div>
                          {candidate.statusUpdatedAt && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-gray-500" />
                              <div>
                                <p className="text-xs text-gray-500">Diupdate</p>
                                <p className="text-xs font-medium text-gray-400">
                                  {formatDate(candidate.statusUpdatedAt)}
                                </p>
                              </div>
                            </div>
                          )}
                          {candidate.statusUpdatedBy && (
                            <p className="text-xs text-gray-500 mt-1">
                              Oleh: <span className="font-medium text-gray-400">{candidate.statusUpdatedBy.name}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Aksi */}
                    <div className="col-span-2 flex items-center justify-end gap-2 flex-wrap">
                      {(user?.role === "HR" || user?.role === "ADMIN") && (
                        <button
                          onClick={() => handleOpenHireModal(candidate)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 rounded-lg transition-all border border-amber-500/50 shadow-lg hover:shadow-xl hover:scale-105"
                          title="Tetapkan sebagai Hired"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span className="hidden sm:inline">Hired</span>
                        </button>
                      )}
                      <Link
                        href={`/dashboard/recruitdata/${candidate.id}`}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all border border-gray-600/50 hover:border-gray-500 shadow-md hover:shadow-lg"
                        title="Lihat Detail Lengkap"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Detail</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl border border-gray-700/50 shadow-lg">
          <div className="text-sm text-gray-300">
            Menampilkan <span className="font-semibold text-white">{(pagination.page - 1) * pagination.limit + 1}</span> sampai{" "}
            <span className="font-semibold text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> dari{" "}
            <span className="font-semibold text-white">{pagination.total}</span> kandidat
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all shadow-md ${
                        pagination.page === pageNum
                          ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white border border-amber-500/50 shadow-lg"
                          : "text-gray-300 bg-gray-700/50 border border-gray-600/50 hover:bg-gray-600/50 hover:shadow-lg"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 border border-gray-600/50 rounded-lg hover:bg-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hire Modal */}
      {showHireModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-yellow-600 text-white p-6 rounded-t-xl border-b-2 border-amber-400">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Tetapkan sebagai Hired</h2>
                    <p className="text-amber-100 text-sm">{selectedCandidate.fullName}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseHireModal}
                  disabled={hiringLoading}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Candidate Info */}
              <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  Informasi Kandidat
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Nama:</span>
                    <span className="ml-2 font-medium text-white">
                      {selectedCandidate.fullName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Posisi Dilamar:</span>
                    <span className="ml-2 font-medium text-white">
                      {selectedCandidate.appliedPosition
                        ? formatPosition(selectedCandidate.appliedPosition)
                        : "Tidak ditentukan"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Pendidikan:</span>
                    <span className="ml-2 font-medium text-white">
                      {selectedCandidate.education
                        ? formatEnumValue(selectedCandidate.education)
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Provinsi:</span>
                    <span className="ml-2 font-medium text-white">
                      {selectedCandidate.province
                        ? formatEnumValue(selectedCandidate.province)
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hire Form */}
              <form onSubmit={(e) => { e.preventDefault(); handleHireCandidate(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Employee ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      value={hireFormData.employeeId || ""}
                      onChange={(e) =>
                        setHireFormData((prev) => ({
                          ...prev,
                          employeeId: e.target.value || undefined,
                        }))
                      }
                      placeholder="Masukkan Employee ID"
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  {/* Hired Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Posisi yang Diterima *
                    </label>
                    <select
                      value={hireFormData.hiredPosition}
                      onChange={(e) =>
                        setHireFormData((prev) => ({
                          ...prev,
                          hiredPosition: e.target.value as Position,
                        }))
                      }
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      {Object.values(Position).map((position) => (
                        <option key={position} value={position}>
                          {formatPosition(position)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Departemen *
                    </label>
                    <select
                      value={hireFormData.department}
                      onChange={(e) =>
                        setHireFormData((prev) => ({
                          ...prev,
                          department: e.target.value as Department,
                        }))
                      }
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      {Object.values(Department).map((dept) => (
                        <option key={dept} value={dept}>
                          {RecruitmentFormService.getDepartmentDisplayName(dept)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tanggal Mulai Kerja *
                    </label>
                    <input
                      type="date"
                      value={hireFormData.startDate}
                      onChange={(e) =>
                        setHireFormData((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  {/* Probation End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tanggal Akhir Probation
                    </label>
                    <input
                      type="date"
                      value={hireFormData.probationEndDate || ""}
                      onChange={(e) =>
                        setHireFormData((prev) => ({
                          ...prev,
                          probationEndDate: e.target.value || undefined,
                        }))
                      }
                      min={hireFormData.startDate}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  {/* Contract Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipe Kontrak
                    </label>
                    <select
                      value={hireFormData.contractType}
                      onChange={(e) =>
                        setHireFormData((prev) => ({
                          ...prev,
                          contractType: e.target.value as ContractType,
                        }))
                      }
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      {Object.values(ContractType).map((type) => (
                        <option key={type} value={type}>
                          {formatEnumValue(type)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Basic Salary */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gaji Pokok (IDR)
                    </label>
                    <input
                      type="number"
                      value={hireFormData.basicSalary || ""}
                      onChange={(e) =>
                        setHireFormData((prev) => ({
                          ...prev,
                          basicSalary: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }))
                      }
                      placeholder="Contoh: 5000000"
                      min="0"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  {/* Work Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Lokasi Kerja
                    </label>
                    <input
                      type="text"
                      value={hireFormData.workLocation || ""}
                      onChange={(e) =>
                        setHireFormData((prev) => ({
                          ...prev,
                          workLocation: e.target.value || undefined,
                        }))
                      }
                      placeholder="Contoh: Head Office, Site A"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  {/* Shift Pattern */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pola Shift
                    </label>
                    <select
                      value={hireFormData.shiftPattern}
                      onChange={(e) =>
                        setHireFormData((prev) => ({
                          ...prev,
                          shiftPattern: e.target.value as ShiftPattern,
                        }))
                      }
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      {Object.values(ShiftPattern).map((pattern) => (
                        <option key={pattern} value={pattern}>
                          {formatEnumValue(pattern)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nama Kontak Darurat
                    </label>
                    <input
                      type="text"
                      value={hireFormData.emergencyContactName || ""}
                      onChange={(e) =>
                        setHireFormData((prev) => ({
                          ...prev,
                          emergencyContactName: e.target.value || undefined,
                        }))
                      }
                      placeholder="Nama kontak darurat"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nomor Telepon Kontak Darurat
                    </label>
                    <input
                      type="text"
                      value={hireFormData.emergencyContactPhone || ""}
                      onChange={(e) =>
                        setHireFormData((prev) => ({
                          ...prev,
                          emergencyContactPhone: e.target.value || undefined,
                        }))
                      }
                      placeholder="Contoh: +628123456789"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={handleCloseHireModal}
                    disabled={hiringLoading}
                    className="px-6 py-3 text-gray-300 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={hiringLoading}
                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg flex items-center gap-2 transition-colors shadow-lg"
                  >
                    {hiringLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Tetapkan sebagai Hired
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuthGuard(MigrationCandidatePage);
