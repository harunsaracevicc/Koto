import React from 'react';

interface KotoLogoProps {
  className?: string;
}

const KotoLogo: React.FC<KotoLogoProps> = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 200 60"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Koto Caffe & Restaurant Logo"
    >
      <text
        x="100"
        y="38"
        fontSize="38"
        fontFamily="'Work Sans', sans-serif"
        fontWeight="500"
        textAnchor="middle"
        letterSpacing="0.15em"
      >
        KOTO
      </text>
      <text
        x="100"
        y="53"
        fontSize="7.5"
        fontFamily="'Work Sans', sans-serif"
        fontWeight="400"
        textAnchor="middle"
        letterSpacing="0.48em"
      >
        CAFFE & RESTAURANT
      </text>
    </svg>
  );
};

export default KotoLogo;