import { Metadata } from 'next';
import BacklinkForm from '@/components/admin/backlinkform';
import BacklinkList from '@/components/admin/baklinklists';

export const metadata: Metadata = {
  title: 'Backlink Management | Admin',
  description: 'Create and manage backlinks for your website',
};

export default function BacklinkPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Backlink Management</h1>
      <BacklinkForm />
      <BacklinkList />
    </div>
  );
}
