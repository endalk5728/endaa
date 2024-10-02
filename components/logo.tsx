import React from 'react';
import Image from 'next/image';
import { Branding } from '@/types/post';

interface LogoProps {
  branding: Branding | null;
}

const Logo: React.FC<LogoProps> = ({ branding }) => {
  if (!branding) {
    return <span className="font-bold text-xl">Logo</span>;
  }

  if (branding.logo_type === 'image' && branding.logo_image) {
    return (
      <div className="flex items-center">
        <Image
          src={branding.logo_image}
          alt="Logo"
          width={32}
          height={32}
          className="h-8 w-auto"
          priority
        />
      </div>
    );
  }

  if (branding.logo_type === 'text' && branding.logo_text) {
    return <h1 className="font-bold text-xl">{branding.logo_text}</h1>;
  }

  return null;
};

export default Logo;
