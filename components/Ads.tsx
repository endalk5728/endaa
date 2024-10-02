import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const Ads: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">Special Offer!</h3>
          <p className="text-sm">Get 20% off on our premium subscription. Limited time offer!</p>
          <a href="#" className="text-blue-600 hover:underline text-sm">Learn More</a>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">Featured Product</h3>
          <p className="text-sm">Discover our latest product and boost your productivity.</p>
          <a href="#" className="text-blue-600 hover:underline text-sm">Shop Now</a>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ads;
