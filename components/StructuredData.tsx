import Head from 'next/head';

interface Props {
  type: 'Article' | 'BreadcrumbList';
  data: any;
}

export default function StructuredData({ type, data }: Props) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}
