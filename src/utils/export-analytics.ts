// utils/export-analytics.ts
import * as XLSX from 'xlsx';

export interface ExportData {
  dashboardStats?: any;
  statusData?: any[];
  positionData?: any[];
  provinceData?: any[];
  trendData?: any[];
  ageData?: any[];
  educationData?: any[];
}

// Helper function to add logo to worksheet
const addLogoToWorksheet = async (ws: XLSX.WorkSheet) => {
  try {
    const response = await fetch('/logohrlogin.png');
    if (response.ok) {
      const blob = await response.blob();
      const reader = new FileReader();
      
      return new Promise((resolve) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          // Add image to worksheet (Excel will handle positioning)
          if (!ws['!images']) ws['!images'] = [];
          ws['!images'].push({
            name: 'company_logo',
            data: base64,
            type: 'image',
            position: { from: { col: 0, row: 0 }, to: { col: 2, row: 3 } }
          });
          resolve(ws);
        };
        reader.readAsDataURL(blob);
      });
    }
  } catch (error) {
    console.warn('Could not load company logo:', error);
  }
  return ws;
};

export const exportToExcel = async (data: ExportData) => {
  const wb = XLSX.utils.book_new();
  
  // Dashboard Stats Sheet with Logo
  if (data.dashboardStats) {
    // Add header rows to make space for logo
    const statsData = [
      ['', '', ''], // Empty row for logo space
      ['', '', ''], // Empty row for logo space
      ['', '', ''], // Empty row for logo space
      ['', 'ANALYTICS DASHBOARD REPORT', ''],
      ['', `Generated: ${new Date().toLocaleDateString()}`, ''],
      ['', '', ''],
      ['Metric', 'Value', ''],
      ['Total Applications', data.dashboardStats.totalApplications || 0, ''],
      ['Pending Applications', data.dashboardStats.pendingApplications || 0, ''],
      ['In Progress', data.dashboardStats.onProgressApplications || 0, ''],
      ['Hired', data.dashboardStats.hiredApplications || 0, ''],
      ['Total Recruiters', data.dashboardStats.totalRecruiters || 0, ''],
      ['Recent Applications', data.dashboardStats.recentApplications || 0, '']
    ];
    
    const statsWS = XLSX.utils.aoa_to_sheet(statsData);
    
    // Style the header
    if (!statsWS['!merges']) statsWS['!merges'] = [];
    statsWS['!merges'].push({ s: { c: 1, r: 3 }, e: { c: 2, r: 3 } }); // Merge title
    
    // Add logo to first sheet
    await addLogoToWorksheet(statsWS);
    
    XLSX.utils.book_append_sheet(wb, statsWS, 'Dashboard Stats');
  }
  
  // Status Data Sheet
  if (data.statusData && data.statusData.length > 0) {
    const statusWS = XLSX.utils.json_to_sheet(data.statusData);
    XLSX.utils.book_append_sheet(wb, statusWS, 'Status Breakdown');
  }
  
  // Position Data Sheet
  if (data.positionData && data.positionData.length > 0) {
    const formattedPositions = data.positionData.map(item => ({
      Position: item.position?.replace(/_/g, ' ') || 'Unknown',
      Applications: item.count || 0
    }));
    const positionWS = XLSX.utils.json_to_sheet(formattedPositions);
    XLSX.utils.book_append_sheet(wb, positionWS, 'Positions');
  }
  
  // Province Data Sheet
  if (data.provinceData && data.provinceData.length > 0) {
    const provinceWS = XLSX.utils.json_to_sheet(data.provinceData);
    XLSX.utils.book_append_sheet(wb, provinceWS, 'Geographic Data');
  }
  
  // Trend Data Sheet
  if (data.trendData && data.trendData.length > 0) {
    const trendWS = XLSX.utils.json_to_sheet(data.trendData);
    XLSX.utils.book_append_sheet(wb, trendWS, 'Trends');
  }
  
  // Age Distribution Sheet
  if (data.ageData && data.ageData.length > 0) {
    const ageWS = XLSX.utils.json_to_sheet(data.ageData);
    XLSX.utils.book_append_sheet(wb, ageWS, 'Age Distribution');
  }
  
  // Education Data Sheet
  if (data.educationData && data.educationData.length > 0) {
    const educationWS = XLSX.utils.json_to_sheet(data.educationData);
    XLSX.utils.book_append_sheet(wb, educationWS, 'Education Levels');
  }
  
  XLSX.writeFile(wb, 'analytics-data.xlsx');
};