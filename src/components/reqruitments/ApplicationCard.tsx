import React from "react";
import {
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  Phone,
} from "lucide-react";
import { RecruitmentForm } from "@/types/types";
import { formatters } from "@/utils/formatter";
import { InfoItem } from "./InfoItem";
import { ApplicationAvatar } from "./AppicationAvatar";
import { StatusBadge } from "./StatusBadge";
import { StatusSelector } from "./StatusSelector";
import { DocumentTags } from "./DocumentTags";
import { ApplicationDetails } from "./ApplicationDetail";
import { CardActions } from "./CardAction";

interface ApplicationCardProps {
  application: RecruitmentForm;
  onDelete: (id: string, name: string) => void;
  onStatusUpdate: (id: string, status: string) => void;
  onView: (id: string) => void;
  onEdit?: (id: string) => void;
  showEdit?: boolean;
}

/**
 * ApplicationCard - A professional card component for displaying recruitment application data
 * 
 * Features:
 * - Clean, organized layout with proper information hierarchy
 * - Responsive design with proper spacing
 * - Reusable sub-components for better maintainability
 * - Proper accessibility attributes
 * - TypeScript interfaces for type safety
 */
export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onDelete,
  onStatusUpdate,
  onView,
  onEdit,
  showEdit = false,
}) => {
  // Event handlers
  const handleDelete = () => {
    onDelete(application.id, application.fullName);
  };

  const handleStatusUpdate = (status: string) => {
    onStatusUpdate(application.id, status);
  };

  const handleView = () => {
    onView(application.id);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(application.id);
    }
  };

  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
      {/* Header Section */}
      <header className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <ApplicationAvatar
            photoUrl={application.documentPhotoUrl}
            fullName={application.fullName}
            size="md"
          />
          
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {application.fullName}
            </h3>
            <StatusBadge status={application.status} />
          </div>
        </div>

        {/* Quick Status Update */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          <StatusSelector
            currentStatus={application.status}
            onStatusChange={handleStatusUpdate}
            size="sm"
          />
        </div>
      </header>

      {/* Primary Information */}
      <section className="space-y-2 mb-4">
        <InfoItem
          icon={Calendar}
          label="Age"
          value={formatters.calculateAge(application.birthDate)}
        />
        <InfoItem
          icon={MapPin}
          label="Province"
          value={formatters.formatProvince(application.province)}
        />
        <InfoItem
          icon={Building2}
          label="Education"
          value={application.education || "N/A"}
        />
        <InfoItem
          icon={Briefcase}
          label="Applied Position"
          value={formatters.formatPosition(application.appliedPosition)}
        />
        <InfoItem
          icon={Phone}
          label="WhatsApp"
          value={application.whatsappNumber || "N/A"}
        />
      </section>

      {/* Detailed Information */}
      <section className="mb-4">
        <ApplicationDetails application={application} />
      </section>

      {/* Documents Section */}
      <section className="mb-4">
        <DocumentTags application={application} />
      </section>

      {/* Footer with Actions */}
      <footer className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <CardActions
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showEdit={showEdit}
        />

        <time 
          className="text-xs text-gray-500 dark:text-gray-400"
          dateTime={application.createdAt}
        >
          Applied: {formatters.formatDate(application.createdAt)}
        </time>
      </footer>
    </article>
  );
};