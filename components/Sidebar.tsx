import { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaTelegram } from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SocialMediaItem {
  id: number;
  platform: string;
  url: string;
  updated_at: string;
}

export default function Sidebar() {
  const [socialMedia, setSocialMedia] = useState<SocialMediaItem[]>([]);

  useEffect(() => {
    fetchSocialMedia();
  }, []);

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
    const iconSize = 24;
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <FaFacebook size={iconSize} className="text-[#1877F2] hover:text-[#1877F2]/80" />;
      case 'twitter':
        return <FaTwitter size={iconSize} className="text-[#1DA1F2] hover:text-[#1DA1F2]/80" />;
      case 'instagram':
        return <FaInstagram size={iconSize} className="text-[#E4405F] hover:text-[#E4405F]/80" />;
      case 'linkedin':
        return <FaLinkedin size={iconSize} className="text-[#0A66C2] hover:text-[#0A66C2]/80" />;
      case 'telegram':
        return <FaTelegram size={iconSize} className="text-[#0088cc] hover:text-[#0088cc]/80" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Connect With Us</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          {socialMedia.map((item) => (
            <a 
              key={item.id}
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-transform hover:scale-110"
            >
              {getSocialIcon(item.platform)}
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
