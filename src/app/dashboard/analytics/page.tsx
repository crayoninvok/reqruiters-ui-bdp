"use client";

import { useState, useEffect } from "react";
import { AnalyticsService, DashboardData } from "@/services/analytics.service";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Download,
} from "lucide-react";

// Import jsPDF and autoTable
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export default function AnalyticsPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await AnalyticsService.getDashboardData();
      setDashboardData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#f97316",
  ];

  // Professional PDF generation function
  const generateProfessionalPDF = async () => {
    if (!dashboardData) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Colors
      const primaryBlue = [59, 130, 246] as [number, number, number];
      const darkGray = [31, 41, 55] as [number, number, number];
      const lightGray = [156, 163, 175] as [number, number, number];
      const green = [16, 185, 129] as [number, number, number];
      const yellow = [245, 158, 11] as [number, number, number];
      
      let yPosition = 20;
      
      // Header with company branding
      doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('ANALYTICS DASHBOARD REPORT', pageWidth / 2, 25, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Generated on ${currentDate}`, pageWidth / 2, 35, { align: 'center' });
      
      yPosition = 55;
      
      // Executive Summary Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(15, yPosition, pageWidth - 30, 45, 'FD');
      
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EXECUTIVE SUMMARY', 20, yPosition + 10);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const { stats } = dashboardData;
      const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
      const progressRate = stats.total > 0 ? Math.round(((stats.inProgress + stats.completed) / stats.total) * 100) : 0;
      
      doc.text([
        `Total Applications: ${stats.total} | Completion Rate: ${completionRate}% | Progress Rate: ${progressRate}%`,
        `Current Status Distribution: ${stats.pending} Pending, ${stats.inProgress} In Progress, ${stats.completed} Completed`,
        `This report provides comprehensive insights into recruitment analytics and performance metrics.`
      ], 20, yPosition + 20);
      
      yPosition += 60;
      
      // Statistics Table
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('KEY PERFORMANCE INDICATORS', 20, yPosition);
      yPosition += 10;
      
      doc.autoTable({
        startY: yPosition,
        head: [['Metric', 'Value', 'Percentage', 'Status']],
        body: [
          ['Total Applications', stats.total.toString(), '100%', '📊 Baseline'],
          ['Pending Applications', stats.pending.toString(), `${stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%`, '⏳ Awaiting Review'],
          ['In Progress', stats.inProgress.toString(), `${stats.total > 0 ? Math.round((stats.inProgress / stats.inProgress) * 100) : 0}%`, '🔄 Processing'],
          ['Completed', stats.completed.toString(), `${completionRate}%`, '✅ Finished'],
          ['Completion Rate', `${completionRate}%`, `${completionRate}%`, completionRate >= 70 ? '🟢 Excellent' : completionRate >= 50 ? '🟡 Good' : '🔴 Needs Improvement'],
          ['Overall Progress', `${progressRate}%`, `${progressRate}%`, progressRate >= 80 ? '🟢 On Track' : progressRate >= 60 ? '🟡 Moderate' : '🔴 Behind Schedule']
        ],
        theme: 'grid',
        headStyles: { 
          fillColor: primaryBlue, 
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold'
        },
        bodyStyles: { 
          fontSize: 10,
          textColor: darkGray
        },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        margin: { left: 20, right: 20 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 20;
      
      // Top Positions Analysis
      if (yPosition > pageHeight - 100) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('TOP APPLIED POSITIONS', 20, yPosition);
      yPosition += 10;
      
      doc.autoTable({
        startY: yPosition,
        head: [['Rank', 'Position', 'Applications', 'Percentage of Total', 'Trend']],
        body: dashboardData.topPositions.map((pos, index) => [
          `#${index + 1}`,
          AnalyticsService.formatPositionName(pos.position),
          pos.count.toString(),
          `${stats.total > 0 ? Math.round((pos.count / stats.total) * 100) : 0}%`,
          index === 0 ? '🔥 Most Popular' : index === 1 ? '📈 High Demand' : '📊 Regular'
        ]),
        theme: 'striped',
        headStyles: { 
          fillColor: [16, 185, 129], 
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold'
        },
        bodyStyles: { 
          fontSize: 10,
          textColor: darkGray
        },
        margin: { left: 20, right: 20 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 20;
      
      // Geographic Distribution
      if (yPosition > pageHeight - 100) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('GEOGRAPHIC DISTRIBUTION', 20, yPosition);
      yPosition += 10;
      
      doc.autoTable({
        startY: yPosition,
        head: [['Rank', 'Province', 'Applications', 'Market Share', 'Growth Indicator']],
        body: dashboardData.topProvinces.map((prov, index) => [
          `#${index + 1}`,
          prov.province,
          prov.count.toString(),
          `${stats.total > 0 ? Math.round((prov.count / stats.total) * 100) : 0}%`,
          index < 3 ? '🎯 Key Market' : '📍 Growth Area'
        ]),
        theme: 'grid',
        headStyles: { 
          fillColor: [245, 158, 11], 
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold'
        },
        bodyStyles: { 
          fontSize: 10,
          textColor: darkGray
        },
        alternateRowStyles: { fillColor: [254, 243, 199] },
        margin: { left: 20, right: 20 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 20;
      
      // Monthly Trends Analysis
      if (yPosition > pageHeight - 150) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('MONTHLY APPLICATION TRENDS', 20, yPosition);
      yPosition += 10;
      
      // Calculate trend indicators
      const trendsWithAnalysis = dashboardData.monthlyTrends.map((trend, index, arr) => {
        let trendIndicator = '📊 Stable';
        if (index > 0) {
          const previousCount = arr[index - 1].count;
          const growth = ((trend.count - previousCount) / previousCount) * 100;
          if (growth > 10) trendIndicator = '📈 Growing';
          else if (growth < -10) trendIndicator = '📉 Declining';
        }
        
        return [
          trend.monthName,
          trend.count.toString(),
          index > 0 ? `${Math.round(((trend.count - arr[index - 1].count) / arr[index - 1].count) * 100)}%` : 'N/A',
          trendIndicator
        ];
      });
      
      doc.autoTable({
        startY: yPosition,
        head: [['Month', 'Applications', 'Growth Rate', 'Trend Analysis']],
        body: trendsWithAnalysis,
        theme: 'striped',
        headStyles: { 
          fillColor: primaryBlue, 
          textColor: [255, 255, 255],
          fontSize: 11,
          fontStyle: 'bold'
        },
        bodyStyles: { 
          fontSize: 10,
          textColor: darkGray
        },
        margin: { left: 20, right: 20 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 20;
      
      // Recent Applications
      if (yPosition > pageHeight - 150) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('RECENT APPLICATIONS OVERVIEW', 20, yPosition);
      yPosition += 10;
      
      doc.autoTable({
        startY: yPosition,
        head: [['Applicant Name', 'Position Applied', 'Current Status', 'Application Date', 'Days Elapsed']],
        body: dashboardData.recentApplications.slice(0, 10).map(app => {
          const applicationDate = new Date(app.createdAt);
          const daysElapsed = Math.floor((new Date().getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24));
          
          return [
            app.fullName,
            AnalyticsService.formatPositionName(app.appliedPosition),
            app.status.replace('_', ' '),
            applicationDate.toLocaleDateString(),
            `${daysElapsed} days`
          ];
        }),
        theme: 'grid',
        headStyles: { 
          fillColor: [139, 92, 246], 
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: { 
          fontSize: 9,
          textColor: darkGray
        },
        alternateRowStyles: { fillColor: [245, 243, 255] },
        margin: { left: 20, right: 20 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 45 },
          2: { cellWidth: 30 },
          3: { cellWidth: 35 },
          4: { cellWidth: 25 }
        }
      });
      
      // Add new page for recommendations
      doc.addPage();
      yPosition = 20;
      
      // Recommendations Section
      doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      doc.rect(0, 0, pageWidth, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('STRATEGIC RECOMMENDATIONS', pageWidth / 2, 20, { align: 'center' });
      
      yPosition = 45;
      
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('📋 ACTION ITEMS & INSIGHTS', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      const recommendations = [
        '🎯 Focus recruitment efforts on high-performing provinces to maximize ROI',
        '⚡ Accelerate processing of pending applications to improve completion rates',
        '📈 Leverage popular position trends to align recruitment strategy',
        '🔄 Implement automated follow-ups for applications over 30 days old',
        '📊 Set target of 80% completion rate for next reporting period',
        '🌐 Consider expanding to underrepresented provinces for growth opportunities'
      ];
      
      recommendations.forEach(rec => {
        doc.text(`• ${rec}`, 25, yPosition);
        yPosition += 8;
      });
      
      yPosition += 10;
      
      // Performance Summary Box
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(green[0], green[1], green[2]);
      doc.rect(20, yPosition, pageWidth - 40, 40, 'FD');
      
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('📊 PERFORMANCE SUMMARY', 25, yPosition + 10);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text([
        `Overall recruitment activity shows ${stats.total} total applications with ${completionRate}% completion rate.`,
        `System efficiency is ${progressRate >= 70 ? 'performing well' : 'showing room for improvement'} with current progress rate of ${progressRate}%.`,
        `Key focus areas: ${stats.pending > stats.completed ? 'Reduce pending backlog' : 'Maintain current pace'} and optimize processing workflows.`
      ], 25, yPosition + 20);
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.text('This report contains confidential recruitment data. Distribution should be limited to authorized personnel only.', pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      // Save the PDF
      const fileName = `Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Analytics Dashboard
        </h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Analytics Dashboard
        </h1>
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const {
    stats,
    topPositions,
    topProvinces,
    monthlyTrends,
    recentApplications,
  } = dashboardData;

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const progressRate =
    stats.total > 0
      ? Math.round(((stats.inProgress + stats.completed) / stats.total) * 100)
      : 0;

  const statusData = [
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "In Progress", value: stats.inProgress, color: "#3b82f6" },
    { name: "Completed", value: stats.completed, color: "#10b981" },
  ];

  // Custom label function that properly handles the PieLabelProps type
  const renderCustomLabel = (props: any) => {
    const { name, percent } = props;
    if (typeof percent === 'number') {
      return `${name} ${(percent * 100).toFixed(0)}%`;
    }
    return `${name}`;
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-400">Overview of recruitment data and trends</p>
          </div>
          <button
            onClick={generateProfessionalPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            <Download className={`h-4 w-4 ${isGeneratingPDF ? 'animate-bounce' : ''}`} />
            {isGeneratingPDF ? 'Generating PDF...' : 'Download Professional Report'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">
                {stats.pending}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-blue-500">
                {stats.inProgress}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-500">
                {stats.completed}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Completion Rate
          </h3>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>0%</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
            <div className="ml-4 text-2xl font-bold text-green-500">
              {completionRate}%
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Progress Rate
          </h3>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>0%</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressRate}%` }}
                ></div>
              </div>
            </div>
            <div className="ml-4 text-2xl font-bold text-blue-500">
              {progressRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Application Status Distribution */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Application Status Distribution
          </h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Monthly Application Trends
          </h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="monthName"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#F9FAFB" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Positions and Provinces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Top Applied Positions
          </h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <BarChart data={topPositions} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="position"
                  tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Top Provinces
          </h3>
          <div style={{ width: "100%", height: "300px" }}>
            <ResponsiveContainer>
              <BarChart data={topProvinces}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="province"
                  tick={{ fill: "#9CA3AF", fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent Applications
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-gray-400 font-medium">Name</th>
                <th className="py-3 px-4 text-gray-400 font-medium">
                  Position
                </th>
                <th className="py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="py-3 px-4 text-gray-400 font-medium">Applied</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                >
                  <td className="py-3 px-4 text-white">{app.fullName}</td>
                  <td className="py-3 px-4 text-gray-300">
                    {AnalyticsService.formatPositionName(app.appliedPosition)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        app.status === "PENDING"
                          ? "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
                          : app.status === "ON_PROGRESS"
                          ? "bg-blue-900/50 text-blue-300 border border-blue-700"
                          : "bg-green-900/50 text-green-300 border border-green-700"
                      }`}
                    >
                      {app.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}