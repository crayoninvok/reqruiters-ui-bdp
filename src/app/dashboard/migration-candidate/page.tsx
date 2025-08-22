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
  UserX,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { HiredEmployeeService } from "@/services/hired.service";
import {
  TransformedHiredEmployee,
  HiredEmployeeFilters,
  Department,
  EmploymentStatus,
  Position,
  ContractType,
} from "@/types/types";
import { withAuthGuard } from "@/components/withGuard";

const HiredEmployeesListPage: React.FC = () => {
  const [employees, setEmployees] = useState<TransformedHiredEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HiredEmployeeFilters>({
    page: 1,
    limit: 10,
    isActive: true,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);

  // Load employees with service
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await HiredEmployeeService.getHiredEmployees(filters);
      setEmployees(response.employees);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load employees");
      console.error("Error loading employees:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm || undefined,
      page: 1,
    }));
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof HiredEmployeeFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  // Handle export
  const handleExport = async (format: "csv" | "excel" = "excel") => {
    setExporting(true);
    try {
      const blob = await HiredEmployeeService.exportHiredEmployees(
        filters,
        format
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hired-employees.${format === "excel" ? "xlsx" : "csv"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  // Handle employee selection
  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map((emp) => emp.id));
    }
  };

  // Get status badge styles
  const getStatusBadge = (status: EmploymentStatus) => {
    const statusDisplay =
      HiredEmployeeService.getEmploymentStatusDisplay(status);
    const colorClasses = {
      green:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
      orange:
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
      blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
      red: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
      gray: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700",
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${
          colorClasses[statusDisplay.color as keyof typeof colorClasses]
        }`}
      >
        {status === "PERMANENT" && <CheckCircle className="w-3 h-3" />}
        {status === "PROBATION" && <Clock className="w-3 h-3" />}
        {status === "CONTRACT" && <User className="w-3 h-3" />}
        {(status === "TERMINATED" || status === "RESIGNED") && (
          <XCircle className="w-3 h-3" />
        )}
        {statusDisplay.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              Hired Employees
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Manage and view all hired employees
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExport("excel")}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors shadow-lg backdrop-blur-sm"
            >
              <Download className="w-4 h-4" />
              {exporting ? "Exporting..." : "Export"}
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg backdrop-blur-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50/90 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300 backdrop-blur-sm">
          <AlertCircle className="w-5 h-5" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            value={filters.search || ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department
              </label>
              <select
                value={filters.department || ""}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value || undefined)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white"
              >
                <option value="">All Departments</option>
                {Object.values(Department).map((dept) => (
                  <option key={dept} value={dept}>
                    {HiredEmployeeService.getDepartmentDisplayName(dept)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employment Status
              </label>
              <select
                value={filters.employmentStatus || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "employmentStatus",
                    e.target.value || undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                {Object.values(EmploymentStatus).map((status) => (
                  <option key={status} value={status}>
                    {
                      HiredEmployeeService.getEmploymentStatusDisplay(status)
                        .label
                    }
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Active Status
              </label>
              <select
                value={
                  filters.isActive === undefined
                    ? ""
                    : filters.isActive.toString()
                }
                onChange={(e) =>
                  handleFilterChange(
                    "isActive",
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white"
              >
                <option value="">All Employees</option>
                <option value="true">Active Only</option>
                <option value="false">Inactive Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contract Type
              </label>
              <select
                value={filters.contractType || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "contractType",
                    e.target.value || undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white/90 dark:bg-gray-700/90 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                {Object.values(ContractType).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setFilters({ page: 1, limit: 10, isActive: true })
                }
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {pagination.total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total Employees
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {employees.filter((emp) => emp.isActive).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {
              employees.filter((emp) => emp.employmentStatus === "PROBATION")
                .length
            }
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            On Probation
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {employees.filter((emp) => !emp.isActive).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Inactive
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-lg">
        {employees.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-medium">No employees found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="px-6 py-3 bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-600/50">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={
                    selectedEmployees.length === employees.length &&
                    employees.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedEmployees.length > 0 &&
                    `${selectedEmployees.length} selected`}
                </span>
              </div>
            </div>

            {/* Table Content */}
            <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleSelectEmployee(employee.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                      {/* Employee Info */}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {employee.fullName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {employee.employeeId}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {HiredEmployeeService.getPositionDisplayName(
                            employee.hiredPosition
                          )}
                        </p>
                      </div>

                      {/* Department & Location */}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {HiredEmployeeService.getDepartmentDisplayName(
                            employee.department
                          )}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {employee.workLocation || "Not specified"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Started:{" "}
                          {new Date(employee.startDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                      </div>

                      {/* Status & Contract */}
                      <div>
                        {getStatusBadge(employee.employmentStatus)}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {employee.contractType}
                        </p>
                        {employee.supervisor && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Supervisor: {employee.supervisor.fullName}
                          </p>
                        )}
                      </div>

                      {/* Salary & Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          {employee.basicSalary && (
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                              }).format(employee.basicSalary)}
                            </p>
                          )}
                          {employee.subordinatesCount > 0 && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {employee.subordinatesCount} subordinate
                              {employee.subordinatesCount > 1 ? "s" : ""}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              window.location.href = `/dashboard/migration-candidate/${employee.id}`;
                            }}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {employee.isActive && (
                            <button
                              className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Terminate Employee"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
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
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} employees
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
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
                      className={`px-3 py-2 text-sm font-medium rounded-lg shadow-lg backdrop-blur-sm ${
                        pagination.page === pageNum
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
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
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuthGuard(HiredEmployeesListPage)
