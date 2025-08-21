import React, { useState } from "react";
import {
  User,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { HiredEmployee, EmploymentStatus } from "@/types/types";
import { HiredEmployeeService } from "@/services/hired.service";

interface OverviewTabProps {
  employee: HiredEmployee;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ employee }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const formatted = HiredEmployeeService.formatEmployeeData(employee);
  const isInProbation = HiredEmployeeService.isProbationPeriod(
    employee.startDate,
    employee.probationEndDate
  );
  const employmentDuration = HiredEmployeeService.calculateEmploymentDuration(
    employee.startDate,
    employee.terminationDate
  );

  const getStatusIcon = (status: EmploymentStatus) => {
    switch (status) {
      case "PERMANENT":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "PROBATION":
        return <Clock className="w-5 h-5 text-orange-600" />;
      case "CONTRACT":
        return <User className="w-5 h-5 text-blue-600" />;
      case "TERMINATED":
      case "RESIGNED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const PhotoDisplay = () => {
    const photoUrl = employee.recruitmentForm?.documentPhotoUrl;

    if (!photoUrl || imageError) {
      return (
        <div className="flex flex-col items-center justify-center w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <Camera className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
          <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
            No photo
            <br />
            available
          </span>
        </div>
      );
    }

    return (
      <div className="relative w-32 h-32 group">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
          </div>
        )}
        <Image
          src={photoUrl}
          alt={`${employee.recruitmentForm?.fullName || "Employee"} Photo`}
          fill
          className={`rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600 shadow-sm group-hover:shadow-md transition-all duration-200 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          sizes="128px"
        />
        {!imageLoading && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-200"></div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Employee Card Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200/50 dark:border-gray-600/50 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Photo Section */}
          <div className="flex flex-col items-center md:items-start">
            <PhotoDisplay />
            <div className="mt-3 text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {employee.recruitmentForm?.fullName || "Unknown Name"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                ID: {employee.employeeId}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-1 mt-1">
                {getStatusIcon(employee.employmentStatus)}
                <span
                  className="text-sm font-medium"
                  style={{
                    color:
                      HiredEmployeeService.getEmploymentStatusDisplay(
                        employee.employmentStatus
                      ).color === "green"
                        ? "#059669"
                        : HiredEmployeeService.getEmploymentStatusDisplay(
                            employee.employmentStatus
                          ).color === "orange"
                        ? "#d97706"
                        : HiredEmployeeService.getEmploymentStatusDisplay(
                            employee.employmentStatus
                          ).color === "blue"
                        ? "#2563eb"
                        : HiredEmployeeService.getEmploymentStatusDisplay(
                            employee.employmentStatus
                          ).color === "red"
                        ? "#dc2626"
                        : "#6b7280",
                  }}
                >
                  {
                    HiredEmployeeService.getEmploymentStatusDisplay(
                      employee.employmentStatus
                    ).label
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Position
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {HiredEmployeeService.getPositionDisplayName(
                  employee.hiredPosition
                )}
              </p>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Department
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {HiredEmployeeService.getDepartmentDisplayName(
                  employee.department
                )}
              </p>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Duration
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {employmentDuration}
              </p>
            </div>
          </div>
        </div>

        {/* Probation Alert */}
        {isInProbation && (
          <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-700 dark:text-orange-300">
              Currently in probation period until{" "}
              {formatted.formattedProbationEndDate}
            </span>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Full Name
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {employee.recruitmentForm?.fullName || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              NRP
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {employee.employeeId || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Birth Date & Place
            </label>
            <p className="text-gray-900 dark:text-white">
              {employee.recruitmentForm?.birthPlace &&
              employee.recruitmentForm?.birthDate
                ? `${employee.recruitmentForm.birthPlace}, ${new Date(
                    employee.recruitmentForm.birthDate
                  ).toLocaleDateString("id-ID")}`
                : "-"}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Province
            </label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <p className="text-gray-900 dark:text-white">
                {employee.recruitmentForm?.province.replace(/_/g, " ") || "-"}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              WhatsApp Number
            </label>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <p className="text-gray-900 dark:text-white font-mono">
                {employee.recruitmentForm?.whatsappNumber || "-"}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Education Level
            </label>
            <p className="text-gray-900 dark:text-white">
              {employee.recruitmentForm?.education || "-"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Marital Status
            </label>
            <p className="text-gray-900 dark:text-white">
              {employee.recruitmentForm?.maritalStatus
                ?.replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase()) || "-"}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Height / Weight
            </label>
            <p className="text-gray-900 dark:text-white">
              {employee.recruitmentForm?.heightCm &&
              employee.recruitmentForm?.weightKg
                ? `${employee.recruitmentForm.heightCm} cm / ${employee.recruitmentForm.weightKg} kg`
                : "-"}
            </p>
          </div>

          {employee.recruitmentForm?.address && (
            <div className="md:col-span-2 lg:col-span-3 space-y-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Address
              </label>
              <p className="text-gray-900 dark:text-white">
                {employee.recruitmentForm.address}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Employment Details */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          Employment Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Applied Position
            </label>
            <p className="text-gray-900 dark:text-white">
              {employee.recruitmentForm?.appliedPosition
                ? HiredEmployeeService.getPositionDisplayName(
                    employee.recruitmentForm.appliedPosition
                  )
                : "-"}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Hired Position
            </label>
            <p className="text-gray-900 dark:text-white font-semibold">
              {HiredEmployeeService.getPositionDisplayName(
                employee.hiredPosition
              )}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Contract Type
            </label>
            <p className="text-gray-900 dark:text-white">
              {employee.contractType?.charAt(0) +
                employee.contractType?.slice(1).toLowerCase()}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Start Date
            </label>
            <p className="text-gray-900 dark:text-white font-medium">
              {formatted.formattedStartDate}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Shift Pattern
            </label>
            <p className="text-gray-900 dark:text-white">
              {HiredEmployeeService.getShiftPatternDisplay(
                employee.shiftPattern
              )}
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Work Location
            </label>
            <p className="text-gray-900 dark:text-white">
              {employee.workLocation || "-"}
            </p>
          </div>

          {employee.basicSalary && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Basic Salary
              </label>
              <p className="text-gray-900 dark:text-white font-semibold">
                {formatted.formattedSalary}
              </p>
            </div>
          )}

          {employee.probationEndDate && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Probation End Date
              </label>
              <p className="text-gray-900 dark:text-white">
                {formatted.formattedProbationEndDate}
              </p>
            </div>
          )}

          {employee.supervisor && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Supervisor
              </label>
              <p className="text-gray-900 dark:text-white">
                {employee.supervisor.recruitmentForm.fullName} (
                {employee.supervisor.employeeId})
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      {(employee.emergencyContactName || employee.emergencyContactPhone) && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-600" />
            Emergency Contact
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {employee.emergencyContactName && (
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Contact Name
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {employee.emergencyContactName}
                </p>
              </div>
            )}

            {employee.emergencyContactPhone && (
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Phone Number
                </label>
                <p className="text-gray-900 dark:text-white font-mono">
                  {employee.emergencyContactPhone}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
