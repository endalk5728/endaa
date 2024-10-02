import type { Metadata } from "next";
import AdminLayoutClient from './AdminLayoutClient';

export const metadata: Metadata = {
  title: {
    template: '%s | Admin Dashboard',
    default: 'Admin Dashboard',
  },
  description: "Admin dashboard for managing website settings",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
