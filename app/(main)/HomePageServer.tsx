import { getPosts, getCategories } from '@/lib/posts';
import HomePage from './HomePage';

export default async function HomePageServer() {
  const posts = await getPosts();
  const categories = await getCategories();

  return <HomePage initialPosts={posts} initialCategories={categories} />;
}
