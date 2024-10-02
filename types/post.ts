import { RowDataPacket } from 'mysql2';

export interface PostCategory {
  id: number
  name: string
  slug: string
  meta_title: string | null;  // Changed from string | undefined
  meta_description: string | null;  // Changed from string | undefined
  created_at: Date
  updated_at: Date
}

export interface Post extends RowDataPacket  {
  id: number
  category_id: number | null
  category?: PostCategory
  title: string
  slug: string
  description: string | null
  content: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  featured_image: string | null
  url: string | null  // Added
  url_label: string | null  // Added
  author_id: number | null
  status: PostStatus
  published_at: Date | null
  created_at: Date
  updated_at: Date
  category_name?: string;
  category_slug?: string;
  tag_ids?: string;
  tag_names?: string;
  tag_slugs?: string;
  // Computed fields
  tags: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

export interface PostInput {
  title: string
  slug: string
  category_id: number | null
  description: string | null
  content: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string | null
  featured_image: string | null
  url: string | null  // Added
  url_label: string | null  // Added
  author_id: number | null
  status: PostStatus
  tags: string[] // Array of tag IDs
}

export interface PostUpdateInput extends Partial<PostInput> {
  id: number
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface Pages extends RowDataPacket {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  status: PageStatus;
  is_footer_page: boolean;
  footer_order: number | null;
  created_at: Date;
  updated_at: Date;
}

export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface PagesInput {
  id?: number; // Add this line to include an optional id
  title: string;
  slug: string;
  description: string | null;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  status: PageStatus;
  is_footer_page: boolean;
  footer_order: number | null;
}

export interface AboutUs {
  id: number;
  content: string;
  updated_at: Date;
}

export interface SocialMedia {
  id: number;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  telegram: string | null;
  updated_at: Date;
}

export interface Copyright {
  id: number;
  copyright_text: string;
  year: string;
  updated_at: Date;
}
export interface Branding {
  id?: number;
  logo_type: 'image' | 'text';
  logo_image: string | null;
  logo_text: string | null;
  favicon: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BrandingFormData {
  logo_type: 'image' | 'text';
  logo_image: string;
  logo_text: string;
  favicon: string;
}

export interface Advertisement {
  id: number;
  ad_name: string;
  ad_type: 'google_ads' | 'custom';
  ad_code: string | null;
  placement: 'sidebar' | 'footer' | 'header' | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  link?: string;
  imageUrl?: string;
  buttonText?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface Subscriber extends RowDataPacket {
  id: number;
  email: string;
  created_at: Date;
  // Add any other fields that are in your subscribers table
}

export interface SubscriptionRequest {
  email: string;
}

export interface BulkEmailRequest {
  subject: string;
  content: string;
}

export interface ApiResponse {
  message: string;
}

export interface ApiError {
  error: string;
}

export interface Backlink {
  id: number;
  url: string;
  anchor_text: string;
  target_url: string;
  rel_attribute: 'follow' | 'nofollow';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BacklinkFormData {
  url: string;
  anchor_text: string;
  target_url: string;
  rel_attribute: 'follow' | 'nofollow';
  is_active: boolean;
}
