import React from "react";
import { OverviewTab } from "@/components/migration-candidate-id/OverviewTab";
import { EmploymentTab } from "@/components/migration-candidate-id/EmploymentTab";
import { ContactTab } from "@/components/migration-candidate-id/ContactTab";
import { HierarchyTab } from "@/components/migration-candidate-id/HierarchyTab";
import { HiredEmployeeService } from "@/services/hired.service";
import {
  HiredEmployee,
  EmploymentStatus,
  Department,
  Position,
  ContractType,
  ShiftPattern,
  SupervisorOption,
  UpdateEmployeeData,
  TerminateEmployeeData,
} from "@/types/types";

interface SubordinateEmployee {
  id: string;
  fullName: string;
  employeeId: string;
  hiredPosition: Position;
}

interface EmployeeContentProps {
  employee: HiredEmployee;
  activeTab: string;
  subordinates: SubordinateEmployee[];
  onNavigateToEmployee: (id: string) => void;
}

export const EmployeeContent: React.FC<EmployeeContentProps> = ({
  employee,
  activeTab,
  subordinates,
  onNavigateToEmployee,
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab employee={employee} />;
      case "employment":
        return <EmploymentTab employee={employee} />;
      case "contact":
        return <ContactTab employee={employee} />;
      case "hierarchy":
        return (
          <HierarchyTab
            employee={employee}
            subordinates={subordinates}
            onNavigateToEmployee={onNavigateToEmployee}
          />
        );
      default:
        return <OverviewTab employee={employee} />;
    }
  };

  return <div className="space-y-6">{renderTabContent()}</div>;
};