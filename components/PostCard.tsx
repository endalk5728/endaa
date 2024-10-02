'use client'
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Post } from '@/types/post';
import Breadcrumb from '@/components/Breadcrumb';
import RightSidebar from '@/components/Sidebar';
import { CalendarIcon, ClockIcon, ArrowLeftIcon, ExternalLinkIcon } from '@radix-ui/react-icons';

interface PostCardProps {
  post: Post;
  relatedPosts?: Post[];
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: post.category?.name || 'Blog', href: `/${post.category?.slug || 'blog'}` },
          { label: post.title, href: '#' },
        ]} 
      />
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <main className="lg:col-span-8">
          <Card className="overflow-hidden">
            {post.featured_image && (
              <div className="relative w-full h-[400px] mb-6">
                <Image 
                  src={post.featured_image} 
                  alt={`Featured image for ${post.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-cover"
                />
              </div>
            )}

            <CardHeader className="space-y-4">
              {post.category && (
                <Badge variant="secondary" className="w-fit">
                  {post.category.name}
                </Badge>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        5 min read
                      </span>
                      </div>
            </CardHeader>

            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                {post.description}
              </p>

              <Separator className="my-6" />

              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-4 mt-6">
              {post.url && (
                <Button asChild variant="default" size="lg" className="w-full sm:w-auto">
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <span>{post.url_label || 'Learn More'}</span>
                    <ExternalLinkIcon className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}

              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/" className="flex items-center justify-center">
                  <ArrowLeftIcon className="mr-2 h-4 w-4" />
                  <span>Back to Home</span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </main>

        <aside className="lg:col-span-4">
          <RightSidebar/>
        </aside>
      </div>
    </div>
  );
}
