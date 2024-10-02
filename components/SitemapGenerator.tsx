'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'

export default function SitemapGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [sitemapUrl, setSitemapUrl] = useState('')

  const generateSitemap = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/admin/generate-sitemap', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        setSitemapUrl(data.sitemapUrl)
        toast({
          title: 'Success',
          description: 'Sitemap generated successfully',
        })
      } else {
        throw new Error('Failed to generate sitemap')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate sitemap',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Sitemap Generator</h2>
      <Button onClick={generateSitemap} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Sitemap'}
      </Button>
      {sitemapUrl && (
        <div>
          <p>Sitemap URL:</p>
          <Input value={sitemapUrl} readOnly />
        </div>
      )}
    </div>
  )
}
