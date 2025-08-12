import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RecruitmentForm } from "@/types/types";

export interface PDFExportOptions {
  title?: string;
  includeCharts?: boolean;
  includeDetailedTable?: boolean;
  includeSummaryStats?: boolean;
}

export class RecruitmentPDFExporter {
  private doc: jsPDF;
  private data: RecruitmentForm[];
  private options: Required<PDFExportOptions>;

  constructor(data: RecruitmentForm[], options: PDFExportOptions = {}) {
    this.doc = new jsPDF();
    this.data = data;
    this.options = {
      title: options.title || "Recruitment Data Report",
      includeCharts: options.includeCharts ?? true,
      includeDetailedTable: options.includeDetailedTable ?? true,
      includeSummaryStats: options.includeSummaryStats ?? true,
    };
  }

  export(): void {
    let yPosition = 15;

    // Add title and basic info
    yPosition = this.addHeader(yPosition);

    if (this.options.includeCharts) {
      yPosition = this.addPositionChart(yPosition);
      yPosition = this.addEducationChart(yPosition);
      yPosition = this.addDateTrendChart(yPosition);
    }

    if (this.options.includeSummaryStats) {
      yPosition = this.addSummaryStats(yPosition);
    }

    if (this.options.includeDetailedTable) {
      this.addDetailedTable();
    }

    // Generate filename and save
    const fileName = `recruitment_report_${new Date().toISOString().split('T')[0]}.pdf`;
    this.doc.save(fileName);
  }

  private addHeader(yPosition: number): number {
    // Add title
    this.doc.setFontSize(16);
    this.doc.text(this.options.title, 14, yPosition);
    yPosition += 10;
    
    // Add generation date and total count
    this.doc.setFontSize(10);
    this.doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, yPosition);
    this.doc.text(`Total Recruiters: ${this.data.length}`, 120, yPosition);
    yPosition += 15;

    return yPosition;
  }

  private addPositionChart(yPosition: number): number {
    const positionStats = this.calculatePositionStats();
    
    this.doc.setFontSize(12);
    this.doc.text("Applications by Position", 14, yPosition);
    yPosition += 10;

    const positionEntries = Object.entries(positionStats).sort((a, b) => b[1] - a[1]);
    const maxPositionCount = Math.max(...positionEntries.map(([, count]) => count));
    
    positionEntries.forEach(([position, count], index) => {
      const barWidth = (count / maxPositionCount) * 120;
      const barY = yPosition + (index * 8);
      
      // Draw bar
      this.doc.setFillColor(59, 130, 246);
      this.doc.rect(14, barY, barWidth, 6, 'F');
      
      // Add label and count
      this.doc.setFontSize(8);
      this.doc.text(`${position}: ${count}`, 140, barY + 4);
    });
    
    return yPosition + (positionEntries.length * 8) + 15;
  }

  private addEducationChart(yPosition: number): number {
    const educationStats = this.calculateEducationStats();

    this.doc.setFontSize(12);
    this.doc.text("Applications by Education Level", 14, yPosition);
    yPosition += 10;

    const educationEntries = Object.entries(educationStats).sort((a, b) => b[1] - a[1]);
    const maxEducationCount = Math.max(...educationEntries.map(([, count]) => count));
    
    educationEntries.forEach(([education, count], index) => {
      const barWidth = (count / maxEducationCount) * 120;
      const barY = yPosition + (index * 8);
      
      // Draw bar
      this.doc.setFillColor(34, 197, 94);
      this.doc.rect(14, barY, barWidth, 6, 'F');
      
      // Add label and count
      this.doc.setFontSize(8);
      this.doc.text(`${education}: ${count}`, 140, barY + 4);
    });
    
    return yPosition + (educationEntries.length * 8) + 20;
  }

  private addDateTrendChart(yPosition: number): number {
    this.doc.setFontSize(12);
    this.doc.text("Applications Over Time (Last 30 Days)", 14, yPosition);
    yPosition += 10;

    const dateStats = this.calculateDateStats();
    const dateEntries = Object.entries(dateStats)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-30); // Last 30 days

    if (dateEntries.length > 0) {
      const maxDateCount = Math.max(...dateEntries.map(([, count]) => count));
      const chartWidth = 160;
      const chartHeight = 40;
      const barWidth = chartWidth / dateEntries.length;

      // Draw chart background
      this.doc.setDrawColor(200, 200, 200);
      this.doc.rect(14, yPosition, chartWidth, chartHeight);

      dateEntries.forEach(([date, count], index) => {
        const barHeight = (count / maxDateCount) * chartHeight;
        const x = 14 + (index * barWidth);
        const y = yPosition + chartHeight - barHeight;

        // Draw bar
        this.doc.setFillColor(168, 85, 247);
        this.doc.rect(x, y, barWidth - 1, barHeight, 'F');
      });

      // Add date labels (show only every 5th date to avoid crowding)
      this.doc.setFontSize(6);
      dateEntries.forEach(([date, count], index) => {
        if (index % 5 === 0 || index === dateEntries.length - 1) {
          const x = 14 + (index * barWidth);
          this.doc.text(
            new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
            x, 
            yPosition + chartHeight + 8
          );
        }
      });

      yPosition += chartHeight + 15;
    }

    return yPosition;
  }

  private addSummaryStats(yPosition: number): number {
    // Check if we need a new page
    if (yPosition > 200) {
      this.doc.addPage();
      yPosition = 15;
    }

    const positionStats = this.calculatePositionStats();
    const educationStats = this.calculateEducationStats();
    const positionEntries = Object.entries(positionStats).sort((a, b) => b[1] - a[1]);
    const educationEntries = Object.entries(educationStats).sort((a, b) => b[1] - a[1]);

    this.doc.setFontSize(12);
    this.doc.text("Summary Statistics", 14, yPosition);
    yPosition += 5;

    const summaryData = [
      ["Total Applications", this.data.length.toString()],
      ["Most Applied Position", positionEntries[0]?.[0] || "N/A"],
      ["Most Common Education", educationEntries[0]?.[0] || "N/A"],
      ["Unique Positions", Object.keys(positionStats).length.toString()],
      ["Education Levels", Object.keys(educationStats).length.toString()],
    ];

    autoTable(this.doc, {
      startY: yPosition + 5,
      head: [["Metric", "Value"]],
      body: summaryData,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [75, 85, 99],
        textColor: 255,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 40 },
      },
      margin: { left: 14 },
    });

    return yPosition + 60; // Approximate table height
  }

  private addDetailedTable(): void {
    // Add new page for detailed table
    this.doc.addPage();
    
    // Detailed table
    this.doc.setFontSize(14);
    this.doc.text("Detailed Recruitment Data", 14, 15);
    
    const tableData = this.data.map((form) => [
      form.fullName,
      form.whatsappNumber,
      form.appliedPosition?.replace(/_/g, " ") || "Not specified",
      form.education,
      form.province.replace(/_/g, " "),
      form.status,
    ]);

    autoTable(this.doc, {
      startY: 25,
      head: [["Name", "Phone", "Position", "Education", "Province", "Status"]],
      body: tableData,
      styles: {
        fontSize: 7,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 22 },
        2: { cellWidth: 28 },
        3: { cellWidth: 20 },
        4: { cellWidth: 22 },
        5: { cellWidth: 18 },
      },
      margin: { top: 25 },
    });
  }

  private calculatePositionStats(): Record<string, number> {
    return this.data.reduce((acc, form) => {
      const position = form.appliedPosition?.replace(/_/g, " ") || "Not specified";
      acc[position] = (acc[position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateEducationStats(): Record<string, number> {
    return this.data.reduce((acc, form) => {
      acc[form.education] = (acc[form.education] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateDateStats(): Record<string, number> {
    return this.data.reduce((acc, form) => {
      if (form.createdAt) {
        const date = new Date(form.createdAt).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }
}

// Convenience function for simple export
export const exportRecruitmentToPDF = (
  data: RecruitmentForm[], 
  options?: PDFExportOptions
): void => {
  const exporter = new RecruitmentPDFExporter(data, options);
  exporter.export();
};