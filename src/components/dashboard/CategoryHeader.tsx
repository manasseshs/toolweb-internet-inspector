
import React from 'react';

interface CategoryHeaderProps {
  title: string;
  description: string;
  toolsCount: number;
  userPlan: string;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  title,
  description,
  toolsCount,
  userPlan
}) => {
  return (
    <div className="border-b border-[#dee2e6] pb-4">
      <h1 className="text-2xl font-bold text-[#212529] mb-2">{title}</h1>
      <p className="text-[#6c757d]">{description}</p>
      <div className="flex items-center gap-4 mt-4 text-sm text-[#6c757d]">
        <span>{toolsCount} tools available</span>
        <span>•</span>
        <span>Plan: <span className="font-medium text-[#0d6efd]">{userPlan.toUpperCase()}</span></span>
      </div>
    </div>
  );
};

export default CategoryHeader;
