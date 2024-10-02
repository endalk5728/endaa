import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/admin/theme-provider";
import Script from 'next/script';
import { getSEOData } from '@/lib/seo';
import { Branding } from '@/types/post';
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

async function getBrandingData(): Promise<Branding | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/branding`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Failed to fetch branding data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching branding data:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSEOData();
  const brandingData = await getBrandingData();

  const metadata: Metadata = {
    title: seoData?.meta_title || "Default Title",
    description: seoData?.meta_description || "Default Description",
    keywords: seoData?.meta_keywords,
    openGraph: {
      title: seoData?.og_title || seoData?.meta_title || "Default OG Title",
      description: seoData?.og_description || seoData?.meta_description || "Default OG Description",
      images: seoData?.og_image ? [{ url: seoData.og_image }] : undefined,
    },
    other: {
      'google-site-verification': seoData?.google_analytics_id || '',
      'msvalidate.01': seoData?.bing_webmaster_id || '',
      robots: seoData?.robots_txt || '',
    },
    icons: brandingData && brandingData.favicon
    ? {
        icon: `${brandingData.favicon}`,
        shortcut: `${brandingData.favicon}`,
        apple: `${brandingData.favicon}`,
      }
    : {
        // Fallback to default favicons if not set in database
      },
};
  // Only add twitter card if it's a valid type
  if (seoData?.twitter_card) {
    switch (seoData.twitter_card) {
      case 'summary':
        metadata.twitter = { card: 'summary' };
        break;
      case 'summary_large_image':
        metadata.twitter = { card: 'summary_large_image' };
        break;
      case 'app':
        metadata.twitter = {
          card: 'app',
          app: {
            name: 'Your App Name',
            id: {
              iphone: 'iPhone App ID',
              ipad: 'iPad App ID',
              googleplay: 'Google Play App ID',
            },
          },
        };
        break;
    }
  }

  return metadata;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seoData = await getSEOData();

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {seoData?.google_analytics_id && (
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${seoData.google_analytics_id}`}
            strategy="afterInteractive"
          />
        )}
        {seoData?.google_analytics_id && (
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${seoData.google_analytics_id}');
            `}
          </Script>
        )}

        {/* Sitemap URL */}
        {seoData?.sitemap_url && (
          <link rel="sitemap" type="application/xml" href={seoData.sitemap_url} />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
