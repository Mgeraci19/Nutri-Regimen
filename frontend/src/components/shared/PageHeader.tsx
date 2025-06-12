import React from 'react';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
  return (
    <div className="flex flex-row justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children && (
        <div className="flex gap-2">
          {children}
        </div>
      )}
    </div>
  );
};
