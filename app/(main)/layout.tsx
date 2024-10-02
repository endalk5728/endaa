'use client'

import { useEffect, useState } from 'react';
import Navigation from '../../components/navigation';

import Footer from '@/components/footer';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { DynamicBanner } from '@/components/banner';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [banner, setBanner] = useState(null);
  const { advertisements } = useAdvertisements();

  useEffect(() => {
    const fetchBanner = async () => {
      const response = await fetch('/api/banner', { cache: 'no-store' });
      const bannerData = await response.json();
      setBanner(bannerData);
    };

    fetchBanner();
  }, []);

  const headerAds = advertisements.filter(ad => ad.placement === 'header' && ad.is_active);
  const footerAds = advertisements.filter(ad => ad.placement === 'footer' && ad.is_active);

  return (
    <html lang="en">
      <body>
        <Navigation />
        {banner && <DynamicBanner banner={banner} />}
        {/* Header Ads */}
        {headerAds.map(ad => (
          <div key={ad.id} dangerouslySetInnerHTML={{ __html: ad.ad_code || '' }} />
        ))}
        
        <main>{children}</main>
        
        {/* Footer Ads */}
        {footerAds.map(ad => (
          <div key={ad.id} dangerouslySetInnerHTML={{ __html: ad.ad_code || '' }} />
        ))}
        
        <Footer/>
      </body>
    </html>
  );
}
