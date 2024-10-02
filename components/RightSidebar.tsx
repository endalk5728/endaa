import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Ads from '@/components/Ads';
const RightSidebar: React.FC = () => {
    return (
        <aside className="w-full lg:w-1/4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Promotions</CardTitle>
          </CardHeader>
          <CardContent>
            <Ads />
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
              <CardTitle>Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <input type="email" placeholder="Your email" className="w-full p-2 border rounded" />
                <Button type="submit" className="w-full">Subscribe</Button>
              </form>
            </CardContent>
          </Card>
      </aside>
    );
  };
  
  export default RightSidebar;
  