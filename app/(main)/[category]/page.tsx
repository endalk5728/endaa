import React from 'react';
import { Metadata } from 'next';
import { RowDataPacket } from 'mysql2';
import { notFound } from 'next/navigation';

import Script from 'next/script';
import pool from '@/lib/db';
import Link from 'next/link';
import { Post,  PostStatus } from '@/types/post';
import PostList from '@/components/PostList';
import Backlinks from '@/components/backlinks';

interface CategoryPageProps {
  params: { category: string };
  searchParams: { page?: string };
}

interface Category extends RowDataPacket {
  id: number;
  name: string;
  slug: string;
  meta_title: string;
  meta_description: string;
}

interface PostWithTags extends Post, RowDataPacket {
  tag_ids: string;
  tag_names: string;
  tag_slugs: string;
}

// Enable ISR for frequently updated content
export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.category);
  
  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
    };
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'https://yoursite.com';
  const siteName = 'ethiojobs';
  
  const title = category.meta_title || `${category.name} | ${siteName}`;
  const description = category.meta_description || `Explore ${category.name} on ${siteName}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'website',
      url: `${baseUrl}/${category.slug}`,
      siteName: siteName,
      images: [
        {
          url: `${baseUrl}/images/${category.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: `${category.name} category image`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [`${baseUrl}/images/${category.slug}.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/${category.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

async function getCategory(slug: string): Promise<Category | null> {
  const [rows] = await pool.query<Category[]>('SELECT * FROM categories WHERE slug = ?', [slug]);
  return rows[0] || null;
}

async function getCategoryPosts(categoryId: number, page: number, postsPerPage: number): Promise<{ posts: Post[], totalPosts: number }> {
  const offset = (page - 1) * postsPerPage;

  const [posts] = await pool.query<PostWithTags[]>(
    'SELECT p.*, GROUP_CONCAT(t.id) as tag_ids, GROUP_CONCAT(t.name) as tag_names, GROUP_CONCAT(t.slug) as tag_slugs ' +
    'FROM posts p ' +
    'LEFT JOIN post_tags pt ON p.id = pt.post_id ' +
    'LEFT JOIN tags t ON pt.tag_id = t.id ' +
    'WHERE p.category_id = ? AND p.status = ? ' +
    'GROUP BY p.id ' +
    'ORDER BY p.published_at DESC, p.id DESC LIMIT ? OFFSET ?',
    [categoryId, PostStatus.PUBLISHED, postsPerPage, offset]
  );

  const [totalPostsResult] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM posts WHERE category_id = ? AND status = ?',
    [categoryId, PostStatus.PUBLISHED]
  );

  const totalPosts = totalPostsResult[0].count;

  return {
    posts: posts.map(post => ({
      ...post,
      tags: post.tag_ids ? post.tag_ids.split(',').map((id, index) => ({
        id: parseInt(id),
        name: post.tag_names.split(',')[index],
        slug: post.tag_slugs.split(',')[index],
        created_at: new Date(),
        updated_at: new Date()
      })) : [],
      published_at: post.published_at ? new Date(post.published_at) : null,
      created_at: new Date(post.created_at),
      updated_at: new Date(post.updated_at)
    })),
    totalPosts
  };
}

// Generate static paths for popular categories
export async function generateStaticParams() {
  const [popularCategories] = await pool.query<Category[]>(
    'SELECT slug FROM categories ORDER BY created_at DESC LIMIT 10'
  );
  
  return popularCategories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategory(params.category);

  if (!category) {
    notFound();
  }

  const page = parseInt(searchParams.page || '1');
  const postsPerPage = 10; // Adjust as needed

  const { posts, totalPosts } = await getCategoryPosts(category.id, page, postsPerPage);
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.meta_description,
    "url": `${process.env.NEXTAUTH_URL}/${category.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${process.env.NEXTAUTH_URL}/${category.slug}/${post.slug}`
      }))
    }
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
        <PostList 
          posts={posts} 
          categoryName={category.name} 
          currentPage={page}
          totalPages={totalPages}
          basePath={`/${category.slug}`}
        />
        
        <nav className="category-navigation" aria-label="Category navigation">
         <Backlinks/>
          <ul>
            <li><Link href="/some-other-category">Some Other Category</Link></li>
            {/* Add more category links here */}
          </ul>
        </nav>
        </>

  );
}