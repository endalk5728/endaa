import { getPosts } from '@/lib/posts'
import PostList from './postlists'
import { Post } from '@/types/post' // Import the Post type

export default async function BlogListWrapper() {
  const posts: Post[] = await getPosts()

  return <PostList initialPosts={posts} />
}
