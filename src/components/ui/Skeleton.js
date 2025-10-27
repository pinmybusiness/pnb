'use client';
import React from 'react';

const Skeleton = ({ className = '', width = '100%', height = '1rem', rounded = '0.25rem' }) => {
  return (
    <div 
      className={`bg-gray-200 animate-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius: rounded,
      }}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
