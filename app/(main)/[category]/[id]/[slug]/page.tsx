import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Post, PostStatus } from '@/types/post';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import PostCard from '@/components/PostCard';

interface PostPageProps {
  params: { slug: string };
}

export const dynamic = 'force-dynamic';

async function getPostBySlug(slug: string): Promise<Post | null> {
    interface PostRow extends Post, RowDataPacket {}
  
    const [rows] = await pool.query<PostRow[]>(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
       GROUP_CONCAT(t.id) as tag_ids, GROUP_CONCAT(t.name) as tag_names, GROUP_CONCAT(t.slug) as tag_slugs
       FROM posts p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN post_tags pt ON p.id = pt.post_id
       LEFT JOIN tags t ON pt.tag_id = t.id
       WHERE p.slug = ? AND p.status = ?
       GROUP BY p.id`,
      [slug, PostStatus.PUBLISHED]
    );
    if (rows.length === 0) return null;
  
    const post = rows[0];
  
    post.tags = post.tag_ids 
      ? post.tag_ids.split(',').map((id, index) => ({
          id: parseInt(id),
          name: post.tag_names?.split(',')[index] || '',
          slug: post.tag_slugs?.split(',')[index] || '',
          created_at: new Date(),
          updated_at: new Date()
        })) 
      : [];
  
    post.category = post.category_id ? {
      id: post.category_id,
      name: post.category_name || '',
      slug: post.category_slug || '',
      meta_title: null,
      meta_description: null,
      created_at: new Date(),
      updated_at: new Date()
    } : undefined;
  
    return post;
  }
  async function getAllPostSlugs(): Promise<string[]> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT slug FROM posts WHERE status = ?',
      [PostStatus.PUBLISHED]
    );
    return rows.map(row => row.slug as string);
  }
  
  export async function generateStaticParams() {
    const slugs = await getAllPostSlugs();
    return slugs.map(slug => ({ slug }));
  }

  export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested post could not be found.',
      };
    }
  
    const baseUrl = process.env.NEXTAUTH_URL || 'https://yoursite.com';
    const siteName = 'Your Site Name';
  
    const postTitle = post.meta_title ?? post.title ?? 'Untitled Post';
    const postDescription = post.meta_description ?? post.description ?? 'No description available';
  
    return {
      title: postTitle,
      description: postDescription,
      openGraph: {
        title: postTitle,
        description: postDescription,
        type: 'article',
        url: `${baseUrl}/post/${post.slug}`,
        images: post.featured_image ? [{ 
          url: post.featured_image,
          width: 1200,
          height: 630,
          alt: `Featured image for ${postTitle}`
        }] : undefined,
        siteName: siteName,
      },
      twitter: {
        card: 'summary_large_image',
        title: postTitle,
        description: postDescription,
        images: post.featured_image ? [{
          url: post.featured_image,
          alt: `Featured image for ${postTitle}`
        }] : undefined,
      },
      alternates: {
        canonical: `${baseUrl}/post/${post.slug}`,
      },
      keywords: post.meta_keywords ?? undefined,
      other: {
        'title': postTitle,
      },
    };
  }
  
  export default async function PostPage({ params }: PostPageProps) {
    const post = await getPostBySlug(params.slug);
  
    if (!post) {
      notFound();
    }
  
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "image": post.featured_image,
      "datePublished": post.published_at?.toISOString(),
      "dateModified": post.updated_at.toISOString(),
      "author": {
        "@type": "Person",
        "name": "Author Name" // Replace with actual author name if available
      },
      "publisher": {
        "@type": "Organization",
        "name": "Your Site Name",
        "logo": {
          "@type": "ImageObject",
          "url": "https://yoursite.com/logo.png" // Replace with your actual logo URL
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${process.env.NEXTAUTH_URL}/post/${post.slug}`
      }
    };
  
    return (
      <div>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
         <PostCard post={post} />
         </div>
    );
  }