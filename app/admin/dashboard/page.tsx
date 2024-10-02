'use client'

import React, { useState, useCallback } from 'react'
import useSWR from 'swr'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pencil, Trash, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Define the Post type
interface Post {
  id: string
  title: string
  category: string
  excerpt: string
  content: string
  publishDate: string
}

interface BlogListProps {
  initialPosts: Post[]
}

const ITEMS_PER_PAGE = 10

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const BlogList: React.FC<BlogListProps> = ({ initialPosts }) => {
  const { data: posts, mutate } = useSWR<Post[]>('/api/posts', fetcher, { fallbackData: initialPosts })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const filteredPosts = posts
    ?.filter((post: Post) => !selectedCategory || post.category === selectedCategory)
    .filter((post: Post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleCategoryChange = useCallback((category: string | null) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }, [])

  const handleSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }, [])

  const handleDelete = useCallback(async (postId: string) => {
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
    mutate()
  }, [mutate])

  const handleEdit = useCallback((postId: string) => {
    router.push(`/admin/posts/${postId}/edit`)
  }, [router])

  const handleNewPost = useCallback(() => {
    router.push('/admin/posts/create')
  }, [router])

  return (
    <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Select
        value={selectedCategory || "all"}
        onValueChange={(value) => handleCategoryChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="blogs">Blogs</SelectItem>
          <SelectItem value="jobs">Jobs</SelectItem>
          <SelectItem value="news">News</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={handleSearch}
        className="max-w-sm"
      />

      <Button onClick={handleNewPost}>
        <Plus className="h-4 w-4 mr-2" />
        New Post
      </Button>
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Excerpt</TableHead>
          <TableHead>Publish Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentPosts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post.category}</TableCell>
            <TableCell>{post.excerpt}</TableCell>
            <TableCell>{new Date(post.publishDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(post.id)}>
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
            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => handlePageChange(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  </div>
  )
}

export default BlogList
