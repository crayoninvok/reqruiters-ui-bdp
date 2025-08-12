/**
 * Utility functions for formatting data in the recruitment application
 */

export const formatters = {
  /**
   * Get initials from a full name
   */
  getInitials: (name: string): string => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  },

  /**
   * Calculate age from birth date
   */
  calculateAge: (birthDate: string | null | undefined): string => {
    if (!birthDate) return "N/A";
    
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return `${age} years`;
  },

  /**
   * Format province enum to readable string
   */
  formatProvince: (province: string | null | undefined): string => {
    if (!province) return "N/A";
    return province
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  },

  /**
   * Format position enum to readable string
   */
  formatPosition: (position: string | null | undefined): string => {
    if (!position) return "No Position";
    return position
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  },

  /**
   * Format status enum to readable string
   */
  formatStatus: (status: string | null | undefined): string => {
    if (!status) return "Unknown";
    return status
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/_/g, " ");
  },

  /**
   * Format marital status enum to readable string
   */
  formatMaritalStatus: (status: string | null | undefined): string => {
    if (!status) return "N/A";
    return status
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/_/g, " ");
  },

  /**
   * Format experience level enum to readable string
   */
  formatExperienceLevel: (level: string | null | undefined): string => {
    if (!level) return "N/A";
    return level
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/_/g, " ");
  },

  /**
   * Format date string to localized format
   */
  formatDate: (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  /**
   * Get status color variant
   */
  getStatusColor: (status: string | null | undefined): 'yellow' | 'green' | 'blue' | 'gray' => {
    if (!status) return "gray";
    switch (status.toUpperCase()) {
      case "PENDING":
        return "yellow";
      case "ON_PROGRESS":
        return "blue";
      case "COMPLETED":
        return "green";
      default:
        return "gray";
    }
  }
};

export const statusColorClasses = {
  yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  green: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  gray: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
};