import React from 'react';

interface PictogramProps {
  className?: string;
  color?: string;
}

// Helper for the Aicher style: Rounded caps, geometric lines (kept for Tischtennis)
const SvgBase: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

// Helper for PNG Pictograms
const PngIcon: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className }) => (
    <img 
      src={src} 
      alt={alt} 
      className={`object-contain ${className}`} 
    />
);

export const PicFussball: React.FC<PictogramProps> = ({ className }) => (
  <PngIcon 
    src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/main/Fu%C3%9Fball_Pictogramm.png"
    alt="Fußball Pictogramm"
    className={className}
  />
);

export const PicKinderFussball: React.FC<PictogramProps> = ({ className }) => (
  <PngIcon 
    src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/main/Kinderfu%C3%9Fball_Pictogramm.png"
    alt="Kinderfußball Pictogramm"
    className={className}
  />
);

export const PicTennis: React.FC<PictogramProps> = ({ className }) => (
  <PngIcon 
    src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/main/Tennis_Pictogramm.png"
    alt="Tennis Pictogramm"
    className={className}
  />
);

export const PicKarate: React.FC<PictogramProps> = ({ className }) => (
  <PngIcon 
    src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/main/Karate_Pictogramm.png"
    alt="Karate Pictogramm"
    className={className}
  />
);

export const PicSchwertkampf: React.FC<PictogramProps> = ({ className }) => (
  <PngIcon 
    src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/main/Schwertkampf_Pictogramm.png"
    alt="Schwertkampf Pictogramm"
    className={className}
  />
);

export const PicTurnen: React.FC<PictogramProps> = ({ className }) => (
  <PngIcon 
    src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/main/Turnen_Pictogramm.png"
    alt="Turnen Pictogramm"
    className={className}
  />
);

export const PicKinderTurnen: React.FC<PictogramProps> = ({ className }) => (
  <PngIcon 
    src="https://raw.githubusercontent.com/DeepBlue-92/svneuhausen1947/main/Kinderturnen_Pictogramm.png"
    alt="Kinderturnen Pictogramm"
    className={className}
  />
);

export const PicTischtennis: React.FC<PictogramProps> = ({ className }) => (
  <SvgBase className={className}>
    <circle cx="14" cy="4" r="2.5" />
    <path d="M14 7L12 12L8 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M14 7L16 12L18 17L16 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <line x1="7" y1="10" x2="7" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="7" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </SvgBase>
);