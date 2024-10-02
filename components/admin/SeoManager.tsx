'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Add this line
import { CheckCircledIcon } from "@radix-ui/react-icons"

const seoFormSchema = z.object({
  meta_title: z.string().max(60, 'Meta title should be 60 characters or less'),
  meta_description: z.string().max(160, 'Meta description should be 160 characters or less'),
  meta_keywords: z.string().max(255, 'Meta keywords should be 255 characters or less'),
  og_title: z.string().max(60, 'OG title should be 60 characters or less'),
  og_description: z.string().max(160, 'OG description should be 160 characters or less'),
  og_image: z.string().url('Must be a valid URL').max(255),
  twitter_card: z.enum(['summary', 'summary_large_image', 'app', 'player']),
  google_analytics_id: z.string().max(20),
  bing_webmaster_id: z.string().max(32),
  robots_txt: z.string(),
  sitemap_url: z.string().url('Must be a valid URL').max(255),
})

type SeoFormValues = z.infer<typeof seoFormSchema>

export default function SeoManager() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingSitemap, setIsGeneratingSitemap] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false) // Add this line
  const { toast } = useToast()


  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
      twitter_card: 'summary',
      google_analytics_id: '',
      bing_webmaster_id: '',
      robots_txt: '',
      sitemap_url: '',
    },
  })

  useEffect(() => {
    const fetchSeoSettings = async () => {
      const response = await fetch('/api/admin/seo')
      if (response.ok) {
        const data = await response.json()
        form.reset(data)
        toast({
          title: "SEO Settings Loaded",
          description: "Existing SEO settings have been loaded successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to load SEO settings.",
          variant: "destructive",
        })
      }
    }
    fetchSeoSettings()
  }, [form, toast])

  async function onSubmit(data: SeoFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        setShowSuccessAlert(true) // Show success alert
        setTimeout(() => setShowSuccessAlert(false), 5000) // Hide after 5 seconds
        // Generate robots.txt file
        await generateRobotsTxt(data.robots_txt)
      } else {
        throw new Error('Failed to update SEO settings')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update SEO settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateRobotsTxt = async (content: string) => {
    try {
      const response = await fetch('/api/admin/robot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (response.ok) {
        toast({
          title: "Success",
          description: "robots.txt file generated successfully.",
        })
      } else {
        throw new Error('Failed to generate robots.txt file')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate robots.txt file.",
        variant: "destructive",
      })
    }
  }

  const generateSitemap = async () => {
    setIsGeneratingSitemap(true)
    try {
      const response = await fetch('/api/admin/sitemap', { method: 'POST' })
      if (response.ok) {
        const data = await response.json()
        form.setValue('sitemap_url', data.sitemapUrl)
        toast({
          title: "Success",
          description: "Sitemap generated successfully.",
        })
      } else {
        throw new Error('Failed to generate sitemap')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate sitemap.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingSitemap(false)
    }
  }

  return (
    <>
    {showSuccessAlert && (
      <Alert className="mb-4 bg-green-100 border-green-500">
        <CheckCircledIcon className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Success</AlertTitle>
        <AlertDescription className="text-green-700">
          SEO settings updated successfully.
        </AlertDescription>
      </Alert>
    )}
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="meta_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>The title that appears in search engine results (max 60 characters).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="meta_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>A brief description of your page for search results (max 160 characters).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="meta_keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Keywords</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Comma-separated keywords relevant to your page content.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="og_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OG Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>The title that appears when shared on social media (max 60 characters).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="og_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OG Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>The description that appears when shared on social media (max 160 characters).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="og_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OG Image URL</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>The image URL that appears when shared on social media.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitter_card"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter Card</FormLabel>
              <FormControl>
                <select {...field} className="w-full p-2 border rounded">
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </FormControl>
              <FormDescription>The type of Twitter card to use when shared on Twitter.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="google_analytics_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Analytics ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Your Google Analytics tracking ID (e.g., UA-XXXXXXXXX-X or G-XXXXXXXXXX).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bing_webmaster_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bing Webmaster ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Your Bing Webmaster Tools verification ID.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="robots_txt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Robots.txt Content</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} />
              </FormControl>
              <FormDescription>The content of your robots.txt file to control search engine crawling.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sitemap_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sitemap URL</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input {...field} />
                  <Button
                    type="button"
                    onClick={generateSitemap}
                    disabled={isGeneratingSitemap}
                  >
                    {isGeneratingSitemap ? 'Generating...' : 'Generate Sitemap'}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>The URL of your XML sitemap for search engines.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update SEO Settings'}
        </Button>
       
      </form>
    </Form>
    </>
  )
}
