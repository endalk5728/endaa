import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/types/post';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import { truncateText } from '@/lib/stringchar';

interface PostListProps {
  posts?: Post[];
  categoryName?: string;
  currentPage: number;
  totalPages: number;
  basePath: string;
  tags?: { id: string; name: string; slug: string }[];
}

const PostList: React.FC<PostListProps> = ({ 
  posts = [], 
  categoryName = "All Categories", 
  currentPage, 
  totalPages, 
  basePath, 
  tags = [] 
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add your categories list here */}
              <ul className="space-y-2">
                <li><Link href="/category/technology">Technology</Link></li>
                <li><Link href="/category/science">Science</Link></li>
                <li><Link href="/category/lifestyle">Lifestyle</Link></li>
                {/* Add more categories as needed */}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Popular Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add your popular posts list here */}
              <ul className="space-y-2">
                <li><Link href="/post/1">Popular Post 1</Link></li>
                <li><Link href="/post/2">Popular Post 2</Link></li>
                <li><Link href="/post/3">Popular Post 3</Link></li>
                {/* Add more popular posts as needed */}
              </ul>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-2/4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Latest Posts</h2>
            <Badge variant="secondary" className="text-lg bg-green-800">{categoryName}</Badge>
          </div>

          <div className="space-y-8">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-2/5 lg:w-1/3 relative h-64 sm:h-auto">
                      {post.featured_image && (
                        <Image
                          src={post.featured_image}
                          alt={`Featured image for ${post.title}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                          loading={index < 3 ? "eager" : "lazy"}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 33vw"
                        />
                      )}
                      <Badge className="absolute top-2 right-2 bg-opacity-75">
                        {categoryName}
                      </Badge>
                    </div>
                    <div className="sm:w-3/5 lg:w-2/3 p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        <CardTitle className="text-2xl sm:text-3xl font-bold mb-3">
                          <Link href={`/post/${post.id}/${post.slug}`} className="hover:underline">
                            {post.title}
                          </Link>
                        </CardTitle>
                        <p className="text-base text-gray-600 mb-4">{truncateText(post.description, 100)}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <time dateTime={post.published_at?.toISOString()} className="text-sm text-gray-500 mb-2 sm:mb-0">
                          Published on {post.published_at?.toLocaleDateString()}
                        </time>
                        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                          <Link href={`/post/${post.id}/${post.slug}`}>Read more</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p>No posts found.</p>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious href={`${basePath}?page=${currentPage - 1}`} />
                  </PaginationItem>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href={`${basePath}?page=${page}`}
                      isActive={page === currentPage}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={`${basePath}?page=${currentPage + 1}`} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Promotions</CardTitle>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
          {tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Link key={tag.id} href={`/tag/${tag.slug}`} className="no-underline">
                      <Badge variant="secondary" className="hover:bg-secondary/80">
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <input type="email" placeholder="Your email" className="w-full p-2 border rounded" />
                <Button type="submit" className="w-full">Subscribe</Button>
              </form>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default PostList;
