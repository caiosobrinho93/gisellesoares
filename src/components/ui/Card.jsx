import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, padding = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -12, scale: 1.01 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`
        ${className.includes('bg-') ? '' : 'bg-white'} rounded-[20px] shadow-premium
        ${padding ? 'p-10' : ''}
        ${hover ? 'hover:shadow-luxe-hover' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;
