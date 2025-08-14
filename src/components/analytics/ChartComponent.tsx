// components/ChartComponents.tsx
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area } from 'recharts';
import { Calendar, Briefcase, RotateCcw } from 'lucide-react';

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16'];

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
  onFiltersChange 
}) => {
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });

  const availablePositions = positions?.map(p => p.position) || [];

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = {
      position: selectedPosition,
      startDate: dateRange.start,
      endDate: dateRange.end,
      ...newFilters
    };

    if (newFilters.position !== undefined) setSelectedPosition(newFilters.position);
    if (newFilters.startDate !== undefined || newFilters.endDate !== undefined) {
      setDateRange(prev => ({
        start: newFilters.startDate !== undefined ? newFilters.startDate : prev.start,
        end: newFilters.endDate !== undefined ? newFilters.endDate : prev.end
      }));
    }

    onFiltersChange?.(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = { position: 'all', startDate: '', endDate: '' };
    setSelectedPosition('all');
    setDateRange({ start: '', end: '' });
    onFiltersChange?.(resetFilters);
  };

  const hasActiveFilters = selectedPosition !== 'all' || dateRange.start || dateRange.end;

  return (
    <div id="status-chart">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Application Status Distribution
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Current status breakdown with filtering options
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <select
              value={selectedPosition}
              onChange={(e) => handleFilterChange({ position: e.target.value })}
              className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300 cursor-pointer min-w-[120px]"
            >
              <option value="all">All Positions</option>
              {availablePositions.map((position) => (
                <option key={position} value={position}>
                  {position.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => handleFilterChange({ startDate: e.target.value })}
              className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300"
            />
            <span className="text-gray-400 text-xs">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => handleFilterChange({ endDate: e.target.value })}
              className="bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-300"
            />
          </div>

          <button
            onClick={handleReset}
            disabled={!hasActiveFilters}
            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
              hasActiveFilters
                ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="text-blue-600 dark:text-blue-400 font-medium">Active filters:</span>
            {selectedPosition !== 'all' && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                Position: {selectedPosition.replace(/_/g, ' ')}
              </span>
            )}
            {dateRange.start && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                From: {dateRange.start}
              </span>
            )}
            {dateRange.end && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded text-xs">
                To: {dateRange.end}
              </span>
            )}
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
            label={({ status, count, percent }) => 
              `${status}: ${count} (${percent ? (percent * 100).toFixed(0) : 0}%)`
            }
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151', 
              borderRadius: '8px',
              color: '#f9fafb',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((item, index) => (
            <div key={item.status} className="flex items-center gap-3 p-2">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              <div className="min-w-0">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {item.status.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
          ))}
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
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Most Applied Positions</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">Top job positions by application volume</p>
    
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Current Data:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
              {item.position?.replace(/_/g, ' ') || 'Unknown'}
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400 px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>

    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ left: 20, right: 20, top: 20, bottom: 80 }}>
        <defs>
          <linearGradient id="positionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
        <XAxis 
          dataKey="position"
          axisLine={{ stroke: '#d1d5db' }}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#6B7280' }}
          angle={-45}
          textAnchor="end"
          height={80}
          tickFormatter={(value) => value?.replace(/_/g, ' ')?.substring(0, 15) + (value?.length > 15 ? '...' : '')}
        />
        <YAxis 
          axisLine={{ stroke: '#d1d5db' }}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B7280' }}
          domain={[0, 'dataMax + 1']}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151', 
            borderRadius: '8px',
            color: '#f9fafb',
            fontSize: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          formatter={(value, name) => [value + ' applications', 'Count']}
          labelFormatter={(label) => typeof label === 'string' ? label.replace(/_/g, ' ') : String(label)}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#3B82F6"
          fillOpacity={1}
          fill="url(#positionGradient)"
        />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#3B82F6" 
          strokeWidth={3}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, fill: '#3B82F6', stroke: '#ffffff', strokeWidth: 2 }}
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
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Geographic Distribution</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">Top provinces by application count</p>
    
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ left: 20, right: 20, top: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
        <XAxis 
          dataKey="province" 
          angle={-45} 
          textAnchor="end" 
          height={100} 
          fontSize={11}
          tick={{ fill: '#6b7280' }}
          axisLine={{ stroke: '#d1d5db' }}
          tickFormatter={(value) => value?.replace(/_/g, ' ')}
        />
        <YAxis 
          tick={{ fill: '#6b7280', fontSize: 12 }}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151', 
            borderRadius: '8px',
            color: '#f9fafb',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
          formatter={(value) => [value + ' applications', 'Count']}
          labelFormatter={(label) => typeof label === 'string' ? label.replace(/_/g, ' ') : String(label)}
        />
        <Bar 
          dataKey="count" 
          radius={[4, 4, 0, 0]}
        >
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

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => (
  <div id="trend-chart">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Application Trends</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">Daily application volume over time</p>
    
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
        <XAxis 
          dataKey="date" 
          fontSize={11}
          tick={{ fill: '#6b7280' }}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <YAxis 
          tick={{ fill: '#6b7280', fontSize: 12 }}
          axisLine={{ stroke: '#d1d5db' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: '1px solid #374151', 
            borderRadius: '8px',
            color: '#f9fafb'
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
          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#8B5CF6', stroke: '#ffffff', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

interface DemographicsChartProps {
  ageData: Array<{ ageRange: string; count: number }>;
  educationData: Array<{ education: string; count: number }>;
}

export const DemographicsChart: React.FC<DemographicsChartProps> = ({ ageData, educationData }) => (
  <div id="demographics-chart" className="grid md:grid-cols-2 gap-8">
    <div>
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Age Distribution</h4>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Applicants by age groups</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={ageData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
          <XAxis 
            dataKey="ageRange" 
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151', 
              borderRadius: '8px',
              color: '#f9fafb'
            }} 
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
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Education Levels</h4>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Educational background distribution</p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={educationData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            label={({ education, percent }) => `${education} (${percent ? (percent * 100).toFixed(0) : 0}%)`}
          >
            {educationData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151', 
              borderRadius: '8px',
              color: '#f9fafb'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);