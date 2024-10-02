import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Banner } from '@/types/post';

interface DynamicBannerProps {
  banner: Banner;
}

export function DynamicBanner({ banner }: DynamicBannerProps) {
  return (
    <Card className="w-full overflow-hidden bg-gradient-to-r from-blue-400 to-indigo-600 dark:from-blue-700 dark:to-indigo-900">
      <CardContent className="p-8 sm:p-12 md:p-16 lg:p-20">
        <div className="flex flex-col justify-center items-start space-y-6">
          <CardHeader className="p-0">
            <CardTitle className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              {banner.title}
            </CardTitle>
            {banner.subtitle && (
              <CardDescription className="text-lg sm:text-xl md:text-2xl text-blue-100 mt-4">
                {banner.subtitle}
              </CardDescription>
            )}
          </CardHeader>
          {banner.link && banner.buttonText && (
            <Link href={banner.link}>
              <Button 
                size="lg" 
                variant="secondary" 
                className="text-lg bg-blue-100 hover:bg-blue-200 text-blue-800 hover:text-blue-900 transition-colors duration-300"
              >
                {banner.buttonText}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
