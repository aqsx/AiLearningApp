import React from 'react';

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
          {title}
        </h1>
        {/* FIXED: Added curly braces around the conditional logic */}
        {subtitle && (
          <p className="text-slate-500 text-sm">{subtitle}</p>
        )}
      </div>
      
      {/* FIXED: Wrapped the return in () instead of {} */}
      {children && <div>{children}</div>}
    </div>
  );
};

export default PageHeader;
