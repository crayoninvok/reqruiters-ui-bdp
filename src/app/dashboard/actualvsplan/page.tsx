"use client";
import React, { useState, useEffect } from "react";
import {
  ActualVsPlanService,
  ActualVsPlanData,
  DepartmentSummary,
} from "@/services/actualvsplan.service";
import { withGuard } from "@/components/withGuard";
import Swal from "sweetalert2";

function ActualVsPlanPage() {
  const [actualVsPlanData, setActualVsPlanData] = useState<ActualVsPlanData[]>(
    []
  );
  const [departmentSummary, setDepartmentSummary] = useState<
    DepartmentSummary[]
  >([]);
  const [summary, setSummary] = useState({
    totalPlanned: 0,
    totalActual: 0,
    totalVariance: 0,
    totalVariancePercentage: 0,
    status: "on-target" as "above" | "below" | "on-target",
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"detailed" | "department">("detailed");

  // Demo version state - set to true for demo, false for production
  const [isDemoVersion, setIsDemoVersion] = useState(true);

  useEffect(() => {
    // Show demo notification on first load
    const showDemoNotification = () => {
      Swal.fire({
        title: "Demo Version",
        html: `
          <div class="text-center mb-4">
            <img src="/bdplogo01.png" alt="BDP Logo" class="mx-auto mb-4" style="height: 60px; width: auto;">
          </div>
          <div class="text-left">
            <p class="mb-3">This page is currently in <strong>demo version</strong>.</p>
            <p class="mb-2">Please note:</p>
            <ul class="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Data shown is for demonstration purposes</li>
              <li>Features may change during development</li>
              <li>Full functionality coming soon</li>
            </ul>
          </div>
        `,
        iconHtml: "",
        confirmButtonText: "Got it",
        confirmButtonColor: "#3b82f6",
        customClass: {
          popup: "rounded-xl",
          title: "text-gray-800",
          htmlContainer: "text-gray-700",
        },
        backdrop: true,
        allowOutsideClick: true,
      });
    };

    // Show notification first, then load data
    showDemoNotification();
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [actualVsPlan, deptSummary] = await Promise.all([
        ActualVsPlanService.getActualVsPlan(),
        ActualVsPlanService.getDepartmentSummary(),
      ]);

      setActualVsPlanData(actualVsPlan.data);
      setSummary(actualVsPlan.summary);
      setDepartmentSummary(deptSummary.data);
    } catch (error) {
      console.error("Error loading data:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load actual vs plan data",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "above":
        return <span className="text-blue-500">↗</span>;
      case "below":
        return <span className="text-red-500">↘</span>;
      default:
        return <span className="text-green-500">→</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "above":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "below":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-green-100 text-green-800`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Actual vs Plan Analysis</h1>
              {isDemoVersion && (
                <span className="px-2 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                  DEMO
                </span>
              )}
            </div>
            <p className="text-blue-100 mt-2">
              Compare planned recruitment targets with actual hiring data
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">Total Planned</div>
          <div className="text-2xl font-bold text-gray-900">
            {summary.totalPlanned}
          </div>
          {isDemoVersion && (
            <div className="text-xs text-amber-600 mt-1">Demo data</div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">Total Actual</div>
          <div className="text-2xl font-bold text-gray-900">
            {summary.totalActual}
          </div>
          {isDemoVersion && (
            <div className="text-xs text-amber-600 mt-1">Demo data</div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">Variance</div>
          <div
            className={`text-2xl font-bold ${
              summary.totalVariance >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            {summary.totalVariance >= 0 ? "+" : ""}
            {summary.totalVariance}
          </div>
          {isDemoVersion && (
            <div className="text-xs text-amber-600 mt-1">Demo data</div>
          )}
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">Variance %</div>
          <div
            className={`text-2xl font-bold ${
              summary.totalVariancePercentage >= 0
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            {summary.totalVariancePercentage >= 0 ? "+" : ""}
            {summary.totalVariancePercentage}%
          </div>
          {isDemoVersion && (
            <div className="text-xs text-amber-600 mt-1">Demo data</div>
          )}
        </div>
      </div>

      {/* View Toggle */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("detailed")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              view === "detailed"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Detailed View
          </button>
          <button
            onClick={() => setView("department")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              view === "department"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Department Summary
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {view === "detailed" ? "Department / Position" : "Department"}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Planned
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {view === "detailed"
                ? actualVsPlanData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.department}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.position}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.planned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.actual}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div
                          className={
                            item.variance >= 0
                              ? "text-blue-600"
                              : "text-red-600"
                          }
                        >
                          {getStatusIcon(item.status)}{" "}
                          {item.variance >= 0 ? "+" : ""}
                          {item.variance} (
                          {item.variancePercentage >= 0 ? "+" : ""}
                          {item.variancePercentage}%)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(item.status)}>
                          {item.status === "above"
                            ? "Above Target"
                            : item.status === "below"
                            ? "Below Target"
                            : "On Target"}
                        </span>
                      </td>
                    </tr>
                  ))
                : departmentSummary.map((dept, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {dept.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.planned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dept.actual}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div
                          className={
                            dept.variance >= 0
                              ? "text-blue-600"
                              : "text-red-600"
                          }
                        >
                          {getStatusIcon(dept.status)}{" "}
                          {dept.variance >= 0 ? "+" : ""}
                          {dept.variance} (
                          {dept.variancePercentage >= 0 ? "+" : ""}
                          {dept.variancePercentage}%)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(dept.status)}>
                          {dept.status === "above"
                            ? "Above Target"
                            : dept.status === "below"
                            ? "Below Target"
                            : "On Target"}
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Demo Table Footer */}
        {isDemoVersion && (
          <div className="bg-amber-50 border-t border-amber-200 px-6 py-3">
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="w-4 h-4 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs text-amber-700 font-medium">
                Demo data - Not actual recruitment metrics
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Demo Controls (only visible in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Demo Mode:</span>
              <button
                onClick={() => setIsDemoVersion(!isDemoVersion)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  isDemoVersion
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                {isDemoVersion ? "ON" : "OFF"}
              </button>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={loadData}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isDemoVersion}
          >
            Refresh Data
          </button>
          <button
            onClick={() => {
              if (isDemoVersion) {
                Swal.fire({
                  title: "Demo Version",
                  text: "Export functionality is not available in demo mode",
                  icon: "info",
                  confirmButtonText: "OK",
                });
              } else {
                // Export functionality could be implemented here
                Swal.fire("Info", "Export functionality coming soon!", "info");
              }
            }}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isDemoVersion
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            disabled={isDemoVersion}
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Demo Information Card */}
      {isDemoVersion && (
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-amber-400">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Demo Features
              </h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• Sample recruitment data for demonstration</li>
                <li>• Real-time data integration coming soon</li>
                <li>
                  • Advanced filtering and reporting features in development
                </li>
                <li>• Export functionality will be available in production</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default withGuard(ActualVsPlanPage, {
  allowedRoles: ["HR", "ADMIN"],
  unauthorizedRedirect: "/custom-401",
});
