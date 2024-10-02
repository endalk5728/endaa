'use client'

import React, { useState, useCallback } from 'react'
import useSWR from 'swr'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pencil, Trash, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

interface Post {
  id: number
  title: string
  category_name: string
  created_at: string
  updated_at: string
}

interface Category {
  id: number
  name: string
}

const ITEMS_PER_PAGE = 10

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function BlogList() {
  const { data: posts, mutate } = useSWR<Post[]>('/api/admin/posts', fetcher)
  const { data: categories } = useSWR<Category[]>('/api/categories', fetcher)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const filteredPosts = posts
    ?.filter((post) => !selectedCategory || post.category_name === selectedCategory)
    .filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase())) || []

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
  const currentPosts = filteredPosts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleDelete = useCallback(async (postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' })
        if (response.ok) {
          mutate()
          toast({ title: 'Post deleted successfully', variant: 'default' })
        } else if (response.status === 404) {
          toast({ title: 'Post not found', variant: 'destructive' })
        } else {
          throw new Error('Failed to delete post')
        }
      } catch (error) {
        console.error('Error deleting post:', error)
        toast({ title: 'Failed to delete post', variant: 'destructive' })
      }
    }
  }, [mutate])
  
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <Button onClick={() => router.push('/admin/posts/create')}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.id}</TableCell>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.category_name}</TableCell>
              <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(post.updated_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/admin/posts/${post.id}/edit`)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(post.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
            </PaginationItem>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setCurrentPage(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
