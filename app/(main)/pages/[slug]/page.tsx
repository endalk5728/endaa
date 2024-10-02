import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageContent from '@/components/pageontent'
import { fetchPageBySlug } from '@/lib/page'
import { Pages } from '@/types/post'

type Props = {
  params: { slug: string }
}

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

// Helper function to convert null to undefined and provide a fallback
const nullToUndefined = <T,>(value: T | null, fallback?: T): T | undefined => {
  if (value === null) {
    return fallback;
  }
  return value;
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const slug = params.slug
  const page: Pages | null = await fetchPageBySlug(slug)

  if (!page) {
    return {}
  }

  const title = nullToUndefined(page.meta_title, page.title) || 'Default Title'
  const description = nullToUndefined(page.meta_description, page.description) || 'Default Description'

  return {
    title,
    description,
    keywords: nullToUndefined(page.meta_keywords),
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${slug}`,
      siteName: 'Your Site Name',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function Page({ params }: Props) {
  const page: Pages | null = await fetchPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description || undefined,
    url: `${baseUrl}/${params.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageContent initialPage={page} />
    </>
  )
}
