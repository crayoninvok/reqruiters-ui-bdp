// components/ChartComponents.tsx
import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
} from "recharts";
import { Calendar, Briefcase, RotateCcw } from "lucide-react";

const CHART_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
];

interface FilterOptions {
  position?: string;
  startDate?: string;
  endDate?: string;
}

interface StatusChartProps {
  data: Array<{ status: string; count: number }>;
  positions?: Array<{ position: string; count: number }>;
  onFiltersChange?: (filters: FilterOptions) => void;
}

export const StatusChart: React.FC<StatusChartProps> = ({
  data,
  positions,
  onFiltersChange,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const availablePositions = positions?.map((p) => p.position) || [];

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = {
      position: selectedPosition,
      startDate: dateRange.start,
      endDate: dateRange.end,
      ...newFilters,
    };

    if (newFilters.position !== undefined)
      setSelectedPosition(newFilters.position);
    if (
      newFilters.startDate !== undefined ||
      newFilters.endDate !== undefined
    ) {
      setDateRange((prev) => ({
        start:
          newFilters.startDate !== undefined
            ? newFilters.startDate
            : prev.start,
        end: newFilters.endDate !== undefined ? newFilters.endDate : prev.end,
      }));
    }

    onFiltersChange?.(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = { position: "all", startDate: "", endDate: "" };
    setSelectedPosition("all");
    setDateRange({ start: "", end: "" });
    onFiltersChange?.(resetFilters);
  };

  const hasActiveFilters =
    selectedPosition !== "all" || dateRange.start || dateRange.end;

  return (
    <div id="status-chart">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Distribusi Status Aplikasi
          </h3>
          <p className="text-gray-300">
            Ringkasan status saat ini dengan opsi filter
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-lg p-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <select
              value={selectedPosition}
              onChange={(e) => handleFilterChange({ position: e.target.value })}
              className="bg-transparent border-none outline-none text-sm text-gray-200 cursor-pointer min-w-[120px]"
            >
              <option value="all" className="bg-gray-700 text-gray-200">
                Semua Posisi
              </option>
              {availablePositions.map((position) => (
                <option
                  key={position}
                  value={position}
                  className="bg-gray-700 text-gray-200"
                >
                  {position.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 rounded-lg p-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                handleFilterChange({ startDate: e.target.value })
              }
              className="bg-transparent border-none outline-none text-sm text-gray-200"
            />
            <span className="text-gray-400 text-xs">sampai</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => handleFilterChange({ endDate: e.target.value })}
              className="bg-transparent border-none outline-none text-sm text-gray-200"
            />
          </div>

          <button
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors border ${
              hasActiveFilters
                ? "text-gray-300 border-gray-600/30 hover:text-white hover:bg-gray-600/50 hover:border-gray-500/30"
                : "text-gray-600 border-gray-700/30 cursor-not-allowed"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Atur Ulang
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-900/30 backdrop-blur-sm rounded-lg border border-blue-700/50">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-blue-300 font-medium">Filter aktif:</span>
            {selectedPosition !== "all" && (
              <span className="px-2 py-1 bg-blue-800/50 text-blue-200 rounded text-xs border border-blue-600/30">
                Posisi: {selectedPosition.replace(/_/g, " ")}
              </span>
            )}
            {dateRange.start && (
              <span className="px-2 py-1 bg-blue-800/50 text-blue-200 rounded text-xs border border-blue-600/30">
                Dari: {dateRange.start}
              </span>
            )}
            {dateRange.end && (
              <span className="px-2 py-1 bg-blue-800/50 text-blue-200 rounded text-xs border border-blue-600/30">
                Sampai: {dateRange.end}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="w-full">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="count"
                label={({ percent }) =>
                  percent && percent > 0.05
                    ? `${(percent * 100).toFixed(0)}%`
                    : ""
                }
                labelLine={false}
                stroke="#1f2937"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f9fafb",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  padding: "12px",
                }}
                itemStyle={{
                  color: "#f9fafb",
                }}
                labelStyle={{
                  color: "#f9fafb",
                  fontWeight: "600",
                }}
                formatter={(value: number, name: string, props: any) => {
                  const total = data.reduce((sum, item) => sum + item.count, 0);
                  const percent =
                    total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                  const statusLabel =
                    props.payload?.status?.replace(/_/g, " ") || name;
                  return [`${value} aplikasi (${percent}%)`, "Total"];
                }}
                labelFormatter={(label) => ""}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {(() => {
              const total = data.reduce((sum, item) => sum + item.count, 0);
              const maxStatus = data.reduce(
                (max, item) => (item.count > max.count ? item : max),
                data[0] || { status: "N/A", count: 0 }
              );
              const minStatus = data.reduce(
                (min, item) => (item.count < min.count ? item : min),
                data[0] || { status: "N/A", count: 0 }
              );

              return (
                <>
                  <div className="p-4 bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm rounded-lg border border-blue-600/30">
                    <div className="text-xs text-blue-300 mb-1 font-medium uppercase tracking-wide">
                      Total Aplikasi
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {total.toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-200 mt-1">
                      Semua status
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-900/40 to-green-800/20 backdrop-blur-sm rounded-lg border border-green-600/30">
                    <div className="text-xs text-green-300 mb-1 font-medium uppercase tracking-wide">
                      Status Terbanyak
                    </div>
                    <div className="text-lg font-bold text-white truncate">
                      {maxStatus.status?.replace(/_/g, " ") || "N/A"}
                    </div>
                    <div className="text-xs text-green-200 mt-1">
                      {maxStatus.count} aplikasi
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        <div className="w-full">
          <div className="p-4 bg-gray-700/30 backdrop-blur-sm rounded-lg border border-gray-600/30 h-full">
            <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
              Rincian Status
            </h4>
            <div className="space-y-3">
              {data.map((item, index) => {
                const total = data.reduce((sum, i) => sum + i.count, 0);
                const percent =
                  total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";
                return (
                  <div
                    key={item.status}
                    className="flex items-center justify-between p-3 bg-gray-600/30 backdrop-blur-sm rounded-lg border border-gray-500/20 hover:border-gray-400/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white truncate">
                          {item.status.replace(/_/g, " ")}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {percent}% dari total
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="text-lg font-bold text-white">
                        {item.count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PositionChartProps {
  data: Array<{ position: string; count: number }>;
}

export const PositionChart: React.FC<PositionChartProps> = ({ data }) => (
  <div id="position-chart">
    <h3 className="text-xl font-semibold text-white mb-2">
      Posisi Paling Banyak Dilamar
    </h3>
    <p className="text-gray-300 mb-6">
      Posisi pekerjaan teratas berdasarkan volume aplikasi
    </p>

    <div className="mb-6 bg-gray-700/30 backdrop-blur-sm rounded-lg border border-gray-600/30 p-4">
      <h4 className="font-medium text-white mb-3">Data Saat Ini:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-3 bg-gray-600/30 backdrop-blur-sm rounded-lg border border-gray-500/20"
          >
            <span className="text-sm text-gray-200 font-medium">
              {item.position?.replace(/_/g, " ") || "Unknown"}
            </span>
            <span className="font-semibold text-blue-400 px-2 py-1 bg-blue-900/40 border border-blue-600/30 rounded">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>

    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ left: 20, right: 20, top: 20, bottom: 80 }}
      >
        <defs>
          <linearGradient id="positionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" opacity={0.5} />
        <XAxis
          dataKey="position"
          axisLine={{ stroke: "#6B7280" }}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#D1D5DB" }}
          angle={-45}
          textAnchor="end"
          height={80}
          tickFormatter={(value) =>
            value?.replace(/_/g, " ")?.substring(0, 15) +
            (value?.length > 15 ? "..." : "")
          }
        />
        <YAxis
          axisLine={{ stroke: "#6B7280" }}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#D1D5DB" }}
          domain={[0, "dataMax + 1"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#f9fafb",
            fontSize: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
          itemStyle={{
            color: "#f9fafb",
          }}
          labelStyle={{
            color: "#f9fafb",
            fontWeight: "600",
          }}
          formatter={(value, name) => [value + " aplikasi", "Total"]}
          labelFormatter={(label) =>
            typeof label === "string" ? label.replace(/_/g, " ") : String(label)
          }
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#3B82F6"
          fillOpacity={1}
          fill="url(#positionGradient)"
          hide={true}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#3B82F6"
          strokeWidth={3}
          dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
          activeDot={{
            r: 8,
            fill: "#3B82F6",
            stroke: "#ffffff",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

interface ProvinceChartProps {
  data: Array<{ province: string; count: number }>;
}

export const ProvinceChart: React.FC<ProvinceChartProps> = ({ data }) => (
  <div id="province-chart">
    <h3 className="text-xl font-semibold text-white mb-2">
      Distribusi Geografis
    </h3>
    <p className="text-gray-300 mb-6">Provinsi teratas berdasarkan jumlah aplikasi</p>

    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ left: 20, right: 20, top: 20, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" opacity={0.5} />
        <XAxis
          dataKey="province"
          angle={-45}
          textAnchor="end"
          height={100}
          fontSize={11}
          tick={{ fill: "#D1D5DB" }}
          axisLine={{ stroke: "#6B7280" }}
          tickFormatter={(value) => value?.replace(/_/g, " ")}
        />
        <YAxis
          tick={{ fill: "#D1D5DB", fontSize: 12 }}
          axisLine={{ stroke: "#6B7280" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#f9fafb",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
          itemStyle={{
            color: "#f9fafb",
          }}
          labelStyle={{
            color: "#f9fafb",
            fontWeight: "600",
          }}
          formatter={(value) => [value + " aplikasi", "Total"]}
          labelFormatter={(label) =>
            typeof label === "string" ? label.replace(/_/g, " ") : String(label)
          }
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[2 + (index % 4)]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

interface TrendChartProps {
  data: Array<{ date: string; count: number }>;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  // Format dan validasi data
  const formattedData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const processed = data
      .map((item: any) => {
        // Handle various date formats
        let dateValue =
          item.date || item.Date || item.created_at || item.date_created || "";

        // Handle various count formats
        let countValue =
          typeof item.count === "number"
            ? item.count
            : typeof item.Count === "number"
            ? item.Count
            : typeof item.total === "number"
            ? item.total
            : typeof item.Total === "number"
            ? item.Total
            : typeof item.application_count === "number"
            ? item.application_count
            : 0;

        return {
          date: dateValue,
          count: countValue,
        };
      })
      .filter((item) => {
        // Filter out invalid entries
        const hasValidDate = item.date && item.date !== "";
        const hasValidCount = typeof item.count === "number" && item.count >= 0;
        return hasValidDate && hasValidCount;
      })
      .sort((a, b) => {
        // Sort by date
        try {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (isNaN(dateA) || isNaN(dateB)) {
            return 0;
          }
          return dateA - dateB;
        } catch {
          return 0;
        }
      })
      .map((item) => {
        // Format date untuk display
        try {
          const date = new Date(item.date);
          if (isNaN(date.getTime())) {
            // If date is invalid, return as is
            return {
              ...item,
              originalDate: item.date,
            };
          }
          const formattedDate = date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          });
          return {
            ...item,
            date: formattedDate,
            originalDate: item.date,
          };
        } catch (error) {
          console.warn("TrendChart - Error formatting date:", item.date, error);
          return {
            ...item,
            originalDate: item.date,
          };
        }
      });

    return processed;
  }, [data]);

  // Jika tidak ada data, tampilkan pesan
  if (!data || data.length === 0 || formattedData.length === 0) {
    return (
      <div id="trend-chart">
        <h3 className="text-xl font-semibold text-white mb-2">
          Tren Aplikasi
        </h3>
        <p className="text-gray-300 mb-6">Volume aplikasi harian seiring waktu</p>
        <div className="flex flex-col items-center justify-center h-[350px] bg-gray-700/30 backdrop-blur-sm rounded-lg border border-gray-600/30">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-600/50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Tidak Ada Data Trend
            </h4>
            <p className="text-sm text-gray-400 max-w-md">
              Data trend aplikasi belum tersedia. Data akan muncul setelah ada
              aplikasi yang tercatat dalam sistem.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="trend-chart">
      <h3 className="text-xl font-semibold text-white mb-2">
        Tren Aplikasi
      </h3>
      <p className="text-gray-300 mb-6">Volume aplikasi harian seiring waktu</p>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={formattedData}
          margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" opacity={0.5} />
          <XAxis
            dataKey="date"
            fontSize={11}
            tick={{ fill: "#D1D5DB" }}
            axisLine={{ stroke: "#6B7280" }}
            angle={formattedData.length > 10 ? -45 : 0}
            textAnchor={formattedData.length > 10 ? "end" : "middle"}
            height={formattedData.length > 10 ? 60 : 30}
          />
          <YAxis
            tick={{ fill: "#D1D5DB", fontSize: 12 }}
            axisLine={{ stroke: "#6B7280" }}
            domain={[0, "dataMax + 1"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f9fafb",
            }}
            itemStyle={{
              color: "#f9fafb",
            }}
            labelStyle={{
              color: "#f9fafb",
              fontWeight: "600",
            }}
            formatter={(value: number) => [`${value} aplikasi`, "Total"]}
            labelFormatter={(label) => {
              // Cari original date untuk tooltip
              const item = formattedData.find((d) => d.date === label);
              if (item?.originalDate) {
                try {
                  const date = new Date(item.originalDate);
                  return date.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                } catch {
                  return label;
                }
              }
              return label;
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8B5CF6"
            fillOpacity={1}
            fill="url(#trendGradient)"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
            activeDot={{
              r: 6,
              fill: "#8B5CF6",
              stroke: "#ffffff",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      {formattedData.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-lg border border-purple-600/30">
            <div className="text-xs text-purple-300 mb-1 font-medium uppercase tracking-wide">
              Total Periode
            </div>
            <div className="text-2xl font-bold text-white">
              {formattedData.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-xs text-purple-200 mt-1">
              {formattedData.length} hari
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm rounded-lg border border-blue-600/30">
            <div className="text-xs text-blue-300 mb-1 font-medium uppercase tracking-wide">
              Rata-rata Harian
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.round(
                formattedData.reduce((sum, item) => sum + item.count, 0) /
                  formattedData.length
              )}
            </div>
            <div className="text-xs text-blue-200 mt-1">aplikasi/hari</div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-900/40 to-green-800/20 backdrop-blur-sm rounded-lg border border-green-600/30">
            <div className="text-xs text-green-300 mb-1 font-medium uppercase tracking-wide">
              Hari Tertinggi
            </div>
            <div className="text-lg font-bold text-white">
              {Math.max(...formattedData.map((item) => item.count))}
            </div>
            <div className="text-xs text-green-200 mt-1">
              {formattedData.find(
                (item) =>
                  item.count === Math.max(...formattedData.map((d) => d.count))
              )?.date || "N/A"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DemographicsChartProps {
  ageData: Array<{ ageRange: string; count: number }>;
  educationData: Array<{ education: string; count: number }>;
}

export const DemographicsChart: React.FC<DemographicsChartProps> = ({
  ageData,
  educationData,
}) => (
  <div id="demographics-chart" className="grid md:grid-cols-2 gap-8">
    <div>
      <h4 className="text-lg font-semibold text-white mb-2">
        Distribusi Usia
      </h4>
      <p className="text-gray-300 mb-4">Pelamar berdasarkan kelompok usia</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={ageData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" opacity={0.5} />
          <XAxis
            dataKey="ageRange"
            fontSize={12}
            tick={{ fill: "#D1D5DB" }}
            axisLine={{ stroke: "#6B7280" }}
          />
          <YAxis tick={{ fill: "#D1D5DB" }} axisLine={{ stroke: "#6B7280" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#f9fafb",
            }}
            itemStyle={{
              color: "#f9fafb",
            }}
            labelStyle={{
              color: "#f9fafb",
              fontWeight: "600",
            }}
            formatter={(value: number) => [value, "Total"]}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {ageData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[3]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div>
      <h4 className="text-lg font-semibold text-white mb-2">
        Tingkat Pendidikan
      </h4>
      <p className="text-gray-300 mb-4">Distribusi latar belakang pendidikan</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={educationData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={30}
              fill="#8884d8"
              dataKey="count"
              label={false}
              labelLine={false}
              stroke="#1f2937"
              strokeWidth={2}
            >
              {educationData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f9fafb",
                padding: "12px",
              }}
              itemStyle={{
                color: "#f9fafb",
              }}
              labelStyle={{
                color: "#f9fafb",
                fontWeight: "600",
              }}
              formatter={(value: number, name: string, props: any) => {
                const total = educationData.reduce(
                  (sum, item) => sum + item.count,
                  0
                );
                const percent =
                  total > 0 ? ((value / total) * 100).toFixed(1) : "0";
                const educationLabel = props.payload?.education || name;
                return [`${value} (${percent}%)`, "Total"];
              }}
              labelFormatter={(label) => ""}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col justify-center space-y-2">
          {educationData.map((item, index) => {
            const total = educationData.reduce((sum, i) => sum + i.count, 0);
            const percent =
              total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";
            return (
              <div
                key={item.education}
                className="flex items-center justify-between p-2 bg-gray-600/30 backdrop-blur-sm rounded-lg border border-gray-500/20"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        CHART_COLORS[index % CHART_COLORS.length],
                    }}
                  />
                  <span className="text-sm text-gray-200 truncate">
                    {item.education}
                  </span>
                </div>
                <div className="ml-2 flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">{percent}%</span>
                  <span className="text-sm font-semibold text-white">
                    {item.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
