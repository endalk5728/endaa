
import React from 'react'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pages } from '@/types/post';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaTelegram } from 'react-icons/fa';
import { useAdvertisements } from '@/hooks/useAdvertisements';

import { NewsletterForm } from './NewsletterForm';
interface AboutUs {
  content: string;
}

interface SocialMediaItem {
    id: number;
    platform: string;
    url: string;
    updated_at: string;
  }

interface Copyright {
  copyright_text: string;
  year: string;
}

export default function Footer() {
    const { advertisements } = useAdvertisements();
    const footerAds = advertisements.filter(ad => ad.placement === 'footer' && ad.is_active);
  const [footerPages, setFooterPages] = useState<Pages[]>([]);
  const [email, setEmail] = useState('');
  const [aboutUs, setAboutUs] = useState<AboutUs | null>(null);
  const [socialMedia, setSocialMedia] = useState<SocialMediaItem[]>([]);

  const [copyright, setCopyright] = useState<Copyright | null>(null);

  useEffect(() => {
    fetchFooterPages();
    fetchAboutUs();
    fetchSocialMedia();
    fetchCopyright();
  }, []);

  const fetchFooterPages = async () => {
    try {
      const response = await fetch('/api/pages?footer=true');
      if (response.ok) {
        const data = await response.json();
        setFooterPages(data);
      }
    } catch (error) {
      console.error('Error fetching footer pages:', error);
    }
  };

  const fetchAboutUs = async () => {
    try {
      const response = await fetch('/api/pages/aboutus');
      if (response.ok) {
        const data = await response.json();
        setAboutUs(data);
      }
    } catch (error) {
      console.error('Error fetching about us:', error);
    }
  };

  const fetchSocialMedia = async () => {
    try {
      const response = await fetch('/api/pages/socialmedia');
      if (response.ok) {
        const data = await response.json();
        console.log('Social media data:', data);
        setSocialMedia(data);
      } else {
        console.error('Error fetching social media:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching social media:', error);
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <FaFacebook size={24} />;
      case 'twitter': return <FaTwitter size={24} />;
      case 'instagram': return <FaInstagram size={24} />;
      case 'linkedin': return <FaLinkedin size={24} />;
      case 'telegram': return <FaTelegram size={24} />;
      default: return null;
    }
  };
  

  const fetchCopyright = async () => {
    try {
      const response = await fetch('/api/pages/copyright');
      if (response.ok) {
        const data = await response.json();
        setCopyright(data);
      }
    } catch (error) {
      console.error('Error fetching copyright:', error);
    }
  };


 return (
    <>
     {footerAds.map(ad => (
        <div key={ad.id} dangerouslySetInnerHTML={{ __html: ad.ad_code || '' }} />
      ))}

    <footer className="bg-black text-white">
        
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">About Us</h3>
            <p className="text-sm">{aboutUs?.content || 'Loading...'}</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {footerPages.map((page) => (
                <li key={page.id}>
                  <Link href={`/pages/${page.slug}`} className="text-sm hover:text-gray-300 transition-colors">
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
        <h3 className="text-xl font-semibold">Connect With Us</h3>
        <div className="flex space-x-4">
          {socialMedia.map((item) => (
            <a 
              key={item.id}
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-gray-300 transition-colors"
            >
              {getSocialIcon(item.platform)}
            </a>
          ))}
        </div>
    
      </div>
          <NewsletterForm/>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm">
            {copyright ? `© ${copyright.year} ${copyright.copyright_text}` : `© ${new Date().getFullYear()} Your Company. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
