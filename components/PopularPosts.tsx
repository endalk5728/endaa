'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types/post';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PopularPostsProps {
  posts: Post[];
}

const PopularPosts: React.FC<PopularPostsProps> = ({ posts }) => {
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);

  useEffect(() => {
    console.log('Posts received in PopularPosts:', posts); // Add this line
    // Sort posts by some popularity criteria (e.g., views, likes)
    // For this example, we'll just take the first 5 posts
    const sortedPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
    setPopularPosts(sortedPosts);
  }, [posts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Posts</CardTitle>
      </CardHeader>
      <CardContent>
        {popularPosts.length > 0 ? (
          <ul className="space-y-4">
            {popularPosts.map((post) => (
              <li key={post.id} className="flex items-center space-x-3">
                {post.image && (
                  <Image src={post.image} alt={post.title} width={40} height={40} objectFit="cover" className="rounded" />
                )}
                <div>
                  <Link href={`/post/${post.id}/${post.slug}`} className="font-medium hover:underline">
                    {post.title}
                  </Link>
                  <p className="text-xs text-gray-500">{post.views} views</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No popular posts available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PopularPosts;
