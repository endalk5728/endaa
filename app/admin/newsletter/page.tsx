import { Suspense } from 'react';
import { SubscribersList } from './SubscribersList';
import { BulkEmailForm } from './BulkEmailForm';

export default function NewsletterAdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Newsletter Subscribers</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <SubscribersList />
      </Suspense>
      <h2 className="text-xl font-semibold mt-8 mb-4">Send Bulk Email</h2>
      <BulkEmailForm />
    </div>
  );
}
