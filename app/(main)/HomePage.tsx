'use client'

import { useState, useEffect } from 'react';
import { Post, PostCategory } from '@/types/post';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {  CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import { Pagination } from "@/components/Pagination";

const ClientOnlyDate = dynamic(() => import('../../components/ClientOnlyDate'), { ssr: false });

const POSTS_PER_PAGE = 5;

interface HomePageProps {
  initialPosts: Post[];
  initialCategories: PostCategory[];
}

function HomePage({ initialPosts, initialCategories }: HomePageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState(initialPosts);
  const [categories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');

  const categoryMap = new Map(categories.map((category: PostCategory) => [category.id, category.name]));

  useEffect(() => {
    const filteredPosts = initialPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPosts(filteredPosts);
    setCurrentPage(1);
  }, [searchTerm, initialPosts]);

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE ;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = posts.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen  ">
       
      <LeftSidebar   />
   
      <main className="flex-1 p-4 lg:p-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Welcome to our Blog</h1>

        {posts.length > 0 && (
          <Alert className="mb-4 lg:mb-6">
            <AlertTitle>New Post Alert!</AlertTitle>
            <AlertDescription>
              Check out our latest post: {posts[0].title}
            </AlertDescription>
          </Alert>
        )}

       
          <CardContent className="p-15">
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-4"
            />

              <div className="rounded-md border mb-4">
              <Table className=" w-full mb-4  p-16">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-2/3 lg:w-3/4 ">jobs</TableHead>
                   
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPosts.map((post: Post) => {
                    const categoryName = post.category_id ? categoryMap.get(post.category_id) : 'Uncategorized';
                    return (
                      <TableRow key={post.id}>
                        <TableCell className="py-2 lg:py-4">
                          <div className="flex items-center space-x-3">
                            {post.image && (
                              <Image src={post.image} alt={post.title} width={60} height={40} objectFit="cover" className="rounded hidden lg:block" />
                            )}
                            <div>
                              <div className="font-medium">{post.title}</div>
                              <div className="text-xs text-green-600 dark:text-green-400">
                              <ClientOnlyDate date={post.created_at} />
                              {' • '}
                                {categoryName}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2 lg:py-4">
                          <Button asChild variant="outline" size="sm" className="w-full">
                            <Link href={`/post/${post.id}/${post.slug}`}>Read more</Link>
                          </Button>
                          
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
      

        <div className="mt-4 flex flex-col lg:flex-row justify-between items-center">
          <p className="mb-2 lg:mb-0">Total posts: {posts.length}</p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <RightSidebar />
    </div>
  );
}

export default HomePage;
