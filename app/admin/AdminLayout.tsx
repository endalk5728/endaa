'use client'

import Navigation from '@/components/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <Navigation />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
