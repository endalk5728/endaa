'use client'

import { useState } from 'react'
import { Pages } from '@/types/post'

type PageContentProps = {
  initialPage: Pages
}

export default function PageContent({ initialPage }: PageContentProps) {
  const [page] = useState<Pages>(initialPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <h2 className="text-xl mb-6">{page.description}</h2>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  )
}
