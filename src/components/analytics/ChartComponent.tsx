// components/ChartComponents.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

interface StatusChartProps {
  data: Array<{ status: string; count: number }>;
}

export const StatusChart: React.FC<StatusChartProps> = ({ data }) => (
  <div id="status-chart">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Application Status Distribution</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">Current status breakdown of all applications</p>
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          dataKey="count"
          label={({ status, count, percent }) => `${status}: ${count} (${percent ? (percent * 100).toFixed(0) : 0}%)`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

interface PositionChartProps {
  data: Array<{ position: string; count: number }>;
}

export const PositionChart: React.FC<PositionChartProps> = ({ data }) => (
  <div id="position-chart">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Most Applied Positions</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">Top job positions by application volume</p>
    
    {/* Data Table */}
    <div className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Current Data:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded">
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {item.position?.replace(/_/g, ' ') || 'Unknown'}
            </span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{item.count}</span>
          </div>
        ))}
      </div>
    </div>

    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ left: 20, right: 20, top: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="position"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#6B7280' }}
          angle={-45}
          textAnchor="end"
          height={80}
          tickFormatter={(value) => value?.replace(/_/g, ' ')?.substring(0, 15) + (value?.length > 15 ? '...' : '')}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: '#6B7280' }}
          domain={[0, 'dataMax + 1']}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#111827', 
            border: '1px solid #374151', 
            borderRadius: '8px',
            color: 'white',
            fontSize: '12px'
          }}
          formatter={(value, name) => [value + ' applications', 'Count']}
          labelFormatter={(label) => typeof label === 'string' ? label.replace(/_/g, ' ') : String(label)}
        />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#3B82F6" 
          strokeWidth={3}
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, fill: '#3B82F6' }}
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
    <p className="text-gray-600 dark:text-gray-400 mb-6">Top 10 provinces by application count</p>
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="province" angle={-45} textAnchor="end" height={120} fontSize={12} />
        <YAxis />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: 'none', 
            borderRadius: '8px',
            color: 'white'
          }} 
        />
        <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
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
    <p className="text-gray-600 dark:text-gray-400 mb-6">Daily application volume over the last 30 days</p>
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            border: 'none', 
            borderRadius: '8px',
            color: 'white'
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="count" 
          stroke="#8B5CF6" 
          strokeWidth={3} 
          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#8B5CF6' }}
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
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="ageRange" fontSize={12} />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: 'none', 
              borderRadius: '8px',
              color: 'white'
            }} 
          />
          <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);