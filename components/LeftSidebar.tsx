
import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card";

import { useAdvertisements } from '@/hooks/useAdvertisements';
        

const LeftSidebar: React.FC = () => {
    const { advertisements } = useAdvertisements();
        const sidebarAds = advertisements.filter(ad => ad.placement === 'sidebar' && ad.is_active);
      
  return (
    <aside className="w-full lg:w-1/4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Promotions</CardTitle>
            {sidebarAds.map(ad => (
        <div key={ad.id} dangerouslySetInnerHTML={{ __html: ad.ad_code || '' }} />
      ))}
          </CardHeader>
          <CardContent>

          </CardContent>
        </Card>
        
  </aside>
  );
};

export default LeftSidebar;
