import React from 'react';

export default function Section({ 
  children, 
  className = '', 
  containerClassName = '', 
  id, 
  background = 'bg-white' 
}) {
  return (
    <section id={id} className={`section-luxe ${background} ${className}`}>
      <div className={`container-luxe ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}

export function Container({ children, className = '' }) {
  return (
    <div className={`container-luxe ${className}`}>
      {children}
    </div>
  );
}
