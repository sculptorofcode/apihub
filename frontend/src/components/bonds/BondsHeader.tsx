
import React from "react";
import { Heart } from "lucide-react";

const BondsHeader: React.FC = () => (
  <div className="mb-4 sm:mb-8">
    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-4">
      <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-[var(--primary-500)]" />
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-900)] dark:text-[var(--text-50)]">
        Bonds
      </h1>
    </div>
    <p className="text-sm sm:text-base text-[var(--text-700)] dark:text-[var(--text-300)]">
      Manage your friendships and connect with new people
    </p>
  </div>
);

export default BondsHeader;
