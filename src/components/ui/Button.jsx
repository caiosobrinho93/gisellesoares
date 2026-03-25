import React from 'react';
import { motion } from 'framer-motion';

const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  as: Component = 'button',
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95";
  
  const variants = {
    primary: "bg-[#0F1113] text-white hover:bg-[#AF944F] shadow-lg hover:shadow-xl",
    secondary: "bg-[#AF944F] text-white hover:bg-[#0F1113] shadow-lg",
    outline: "bg-transparent border-2 border-[#0F1113] text-[#0F1113] hover:bg-[#0F1113] hover:text-white",
    gold: "bg-[#AF944F]/10 text-[#AF944F] border border-[#AF944F]/30 hover:bg-[#AF944F] hover:text-white",
    ghost: "bg-transparent hover:bg-black/5 text-black"
  };

  const sizes = {
    sm: "px-6 py-2.5 text-[9px] rounded-lg",
    md: "px-8 py-3.5 text-[10px] rounded-[20px]",
    lg: "px-10 py-4.5 text-[11px] rounded-[20px]",
    xl: "px-12 py-5.5 text-[12px] rounded-[20px]"
  };

  return (
    <Component
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
