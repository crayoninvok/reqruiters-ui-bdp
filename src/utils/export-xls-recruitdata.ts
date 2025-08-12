// import * as XLSX from "xlsx";
// import { RecruitmentForm } from "@/types/types";

// export interface ExcelExportOptions {
//   filename?: string;
//   sheetName?: string;
//   includeTimestamp?: boolean;
//   customColumns?: Record<string, (form: RecruitmentForm) => string | number>;
//   autoSizeColumns?: boolean;
// }

// export class RecruitmentExcelExporter {
//   private data: RecruitmentForm[];
//   private options: Required<ExcelExportOptions>;

//   constructor(data: RecruitmentForm[], options: ExcelExportOptions = {}) {
//     this.data = data;
//     this.options = {
//       filename: options.filename || this.generateDefaultFilename(),
//       sheetName: options.sheetName || "Recruitment Data",
//       includeTimestamp: options.includeTimestamp ?? true,
//       customColumns: options.customColumns || {},
//       autoSizeColumns: options.autoSizeColumns ?? true,
//     };
//   }

//   export(): void {
//     const exportData = this.prepareData();
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();

//     // Auto-size columns if enabled
//     if (this.options.autoSizeColumns) {
//       this.autoSizeColumns(worksheet, exportData);
//     }

//     // Add worksheet to workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, this.options.sheetName);

//     // Write and save file
//     XLSX.writeFile(workbook, this.options.filename);
//   }

//   private prepareData(): Record<string, string | number>[] {
//     return this.data.map((form) => {
//       const baseData = {
//         "Full Name": form.fullName,
//         "WhatsApp Number": form.whatsappNumber,
//         "Applied Position": form.appliedPosition?.replace(/_/g, " ") || "Not specified",
//         "Education": form.education,
//         "Province": form.province.replace(/_/g, " "),
//         "Status": form.status,
//       };

//       // Add timestamp if enabled
//       if (this.options.includeTimestamp) {
//         baseData["Application Date"] = form.createdAt 
//           ? new Date(form.createdAt).toLocaleDateString() 
//           : "N/A";
//       }

//       // Add custom columns
//       const customData = Object.entries(this.options.customColumns).reduce(
//         (acc, [columnName, transformer]) => {
//           acc[columnName] = transformer(form);
//           return acc;
//         },
//         {} as Record<string, string | number>
//       );

//       return { ...baseData, ...customData };
//     });
//   }

//   private autoSizeColumns(
//     worksheet: XLSX.WorkSheet,
//     data: Record<string, string | number>[]
//   ): void {
//     const colWidths = data.reduce((acc, row) => {
//       Object.keys(row).forEach((key, index) => {
//         const value = String(row[key]);
//         acc[index] = Math.max(acc[index] || 0, value.length + 2);
//       });
//       return acc;
//     }, {} as Record<number, number>);

//     worksheet['!cols'] = Object.values(colWidths).map(width => ({ width }));
//   }

//   private generateDefaultFilename(): string {
//     const date = new Date().toISOString().split('T')[0];
//     return `recruitment_data_${date}.xlsx`;
//   }
// }

// // Convenience functions for different export types
// export const exportRecruitmentToExcel = (
//   data: RecruitmentForm[],
//   options?: ExcelExportOptions
// ): void => {
//   const exporter = new RecruitmentExcelExporter(data, options);
//   exporter.export();
// };

// // Export with additional statistics
// export const exportRecruitmentWithStats = (data: RecruitmentForm[]): void => {
//   const customColumns = {
//     "Days Since Application": (form: RecruitmentForm) => {
//       if (!form.createdAt) return "N/A";
//       const daysDiff = Math.floor(
//         (new Date().getTime() - new Date(form.createdAt).getTime()) / (1000 * 60 * 60 * 24)
//       );
//       return daysDiff;
//     },
//     "Position Category": (form: RecruitmentForm) => {
//       const position = form.appliedPosition?.toLowerCase() || "";
//       if (position.includes("manager") || position.includes("supervisor")) return "Management";
//       if (position.includes("developer") || position.includes("engineer")) return "Technical";
//       if (position.includes("sales") || position.includes("marketing")) return "Sales & Marketing";
//       return "Other";
//     },
//   };

//   exportRecruitmentToExcel(data, {
//     filename: `recruitment_analysis_${new Date().toISOString().split('T')[0]}.xlsx`,
//     sheetName: "Recruitment Analysis",
//     customColumns,
//   });
// };

// // Export filtered data
// export const exportFilteredRecruitment = (
//   data: RecruitmentForm[],
//   filterName: string
// ): void => {
//   exportRecruitmentToExcel(data, {
//     filename: `recruitment_${filterName}_${new Date().toISOString().split('T')[0]}.xlsx`,
//     sheetName: `${filterName} Data`,
//   });
// };

// // Export summary report (aggregated data)
// export const exportRecruitmentSummary = (data: RecruitmentForm[]): void => {
//   // Calculate statistics
//   const positionStats = data.reduce((acc, form) => {
//     const position = form.appliedPosition?.replace(/_/g, " ") || "Not specified";
//     acc[position] = (acc[position] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);

//   const educationStats = data.reduce((acc, form) => {
//     acc[form.education] = (acc[form.education] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);

//   const statusStats = data.reduce((acc, form) => {
//     acc[form.status] = (acc[form.status] || 0) + 1;
//     return acc;
//   }, {} as Record<string, number>);

//   // Prepare summary data
//   const summaryData = [
//     { Metric: "Total Applications", Value: data.length },
//     { Metric: "Unique Positions", Value: Object.keys(positionStats).length },
//     { Metric: "Education Levels", Value: Object.keys(educationStats).length },
//     ...Object.entries(positionStats).map(([position, count]) => ({
//       Metric: `${position} Applications`,
//       Value: count,
//     })),
//     ...Object.entries(educationStats).map(([education, count]) => ({
//       Metric: `${education} Candidates`,
//       Value: count,
//     })),
//     ...Object.entries(statusStats).map(([status, count]) => ({
//       Metric: `${status} Status`,
//       Value: count,
//     })),
//   ];

//   const worksheet = XLSX.utils.json_to_sheet(summaryData);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");

//   // Auto-size columns
//   const colWidths = summaryData.reduce((acc, row) => {
//     Object.keys(row).forEach((key, index) => {
//       const value = String(row[key as keyof typeof row]);
//       acc[index] = Math.max(acc[index] || 0, value.length + 2);
//     });
//     return acc;
//   }, {} as Record<number, number>);

//   worksheet['!cols'] = Object.values(colWidths).map(width => ({ width }));

//   const filename = `recruitment_summary_${new Date().toISOString().split('T')[0]}.xlsx`;
//   XLSX.writeFile(workbook, filename);
// };