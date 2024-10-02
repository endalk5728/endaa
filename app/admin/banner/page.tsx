import { BannerForm } from '@/components/admin/banner';

export default function AdminBannerPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Banner</h1>
      <BannerForm />
    </div>
  );
}
