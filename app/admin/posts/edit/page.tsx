'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from '@/components/ImageUpload'
import { slugify } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface Category {
  id: number
  name: string
}


export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [post, setPost] = useState({
    title: '',
    slug: '',
    category_id: '',
    description: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    featured_image: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    url: '',
    url_label: '',
    tags: [] as string[],
  })

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data)
        } else {
          throw new Error('Failed to fetch post')
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        toast({ title: 'Failed to fetch post', variant: 'destructive' })
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        } else {
          throw new Error('Failed to fetch categories')
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast({ title: 'Failed to fetch categories', variant: 'destructive' })
      }
    }

  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      })

      if (response.ok) {
        toast({ title: 'Post updated successfully' })
        router.push('/admin/posts')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      toast({ title: 'Failed to update post', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const generatedSlug = slugify(title)
    setPost({
      ...post,
      title,
      slug: generatedSlug,
      meta_title: title.slice(0, 60),
    })
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Edit Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={post.title}
                onChange={handleTitleChange}
                required
                maxLength={255}
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={post.slug}
                onChange={(e) => setPost({ ...post, slug: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={post.category_id}
              onValueChange={(value) => setPost({ ...post, category_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={post.description}
              onChange={(e) => setPost({ ...post, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              required
              className="h-64"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={post.meta_title}
                onChange={(e) => setPost({ ...post, meta_title: e.target.value })}
                maxLength={60}
              />
            </div>
            <div>
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input
                id="meta_keywords"
                value={post.meta_keywords}
                onChange={(e) => setPost({ ...post, meta_keywords: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              value={post.meta_description}
              onChange={(e) => setPost({ ...post, meta_description: e.target.value })}
              maxLength={160}
            />
          </div>
          <div>
            <Label>Featured Image</Label>
            <ImageUpload
              onUpload={(url) => setPost({ ...post, featured_image: url })}
              initialImage={post.featured_image}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={post.url}
                onChange={(e) => setPost({ ...post, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="url_label">URL Label</Label>
              <Input
                id="url_label"
                value={post.url_label}
                onChange={(e) => setPost({ ...post, url_label: e.target.value })}
                placeholder="Apply Now"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={post.status === 'published'}
              onCheckedChange={(checked) =>
                setPost({ ...post, status: checked ? 'published' : 'draft' })
              }
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Post'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
        <Skeleton className="h-64 w-full" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}
