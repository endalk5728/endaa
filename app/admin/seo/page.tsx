import { Metadata } from 'next'
import SeoManager from '@/components/admin/SeoManager'

export const metadata: Metadata = {
  title: 'SEO Management',
  description: 'Manage your website\'s SEO settings',
}

export default function SeoPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">SEO Management</h1>
      <SeoManager />
    </div>
  )
}
