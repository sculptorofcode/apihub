
import React from "react";
import { Edit } from "lucide-react";

const ProfileCompany: React.FC = () => (
  <div className="flex-shrink-0 md:ml-8">
    <div className="flex items-start gap-3 p-4 bg-[var(--background-50)] dark:bg-[var(--background-900)] rounded-lg border border-[var(--border)]">
      <div className="w-12 h-12 bg-[var(--secondary-200)] dark:bg-[var(--secondary-700)] rounded-lg flex items-center justify-center">
        <div className="w-8 h-8 bg-[var(--secondary-400)] dark:bg-[var(--secondary-500)] rounded"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[var(--text-900)] dark:text-[var(--text-50)]">
            Siliguri Government Polytechnic
          </h3>
          <button
            className="p-1 rounded hover:bg-[var(--background-100)] dark:hover:bg-[var(--background-800)] transition-colors"
            aria-label="Edit company"
            title="Edit company"
          >
            <Edit className="h-4 w-4 text-[var(--text-500)]" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileCompany;

