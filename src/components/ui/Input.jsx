import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1 mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full 
          bg-white 
          border border-gray-100 
          px-[20px] 
          py-[14px] 
          rounded-[16px] 
          text-[#0F1113] 
          placeholder:text-gray-400
          focus:outline-none 
          focus:border-[#B8787A]/30
          focus:ring-4 
          focus:ring-[#B8787A]/5
          transition-all 
          duration-300
          ${error ? 'border-red-300 bg-red-50/10' : ''} 
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1">{error}</span>}
    </div>
  );
};

export const Select = ({ label, children, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1 mb-1">
          {label}
        </label>
      )}
      <select
        className={`
          w-full 
          bg-white 
          border border-gray-100 
          px-[20px] 
          py-[14px] 
          rounded-[16px] 
          text-gray-900 
          focus:outline-none 
          focus:border-[#B8787A]/30
          focus:ring-4 
          focus:ring-[#B8787A]/5
          transition-all 
          duration-300
          appearance-none
          ${error ? 'border-red-300 bg-red-50/10' : ''} 
          ${className}
        `}
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23B8787A\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1rem' }}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest ml-1">{error}</span>}
    </div>
  );
};

export default Input;
