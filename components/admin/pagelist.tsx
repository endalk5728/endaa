'use client'

import { useState, useEffect } from 'react';
import { Pages } from '@/types/post';
import { Button } from '@/components/ui/button';

export default function PageList() {
  const [pages, setPages] = useState<Pages[]>([]);
  const [editingPage, setEditingPage] = useState<Pages | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        const response = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchPages();
        }
      } catch (error) {
        console.error('Error deleting page:', error);
      }
    }
  };

  const handleEdit = (page: Pages) => {
    setEditingPage(page);
  };

  const handleSaveEdit = async (updatedPage: Pages) => {
    try {
      const response = await fetch(`/api/pages/${updatedPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPage),
      });
      if (response.ok) {
        fetchPages();
        setEditingPage(null);
      }
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingPage(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Pages List</h2>
      {pages.map((page) => (
        <div key={page.id} className="border p-4 rounded-md flex justify-between items-center">
          <div>
            <h3 className="font-medium">{page.title}</h3>
            <p className="text-sm text-gray-500">{page.slug}</p>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => handleEdit(page)}>Edit</Button>
            <Button variant="destructive" onClick={() => handleDelete(page.id!)}>Delete</Button>
          </div>
        </div>
      ))}
      {editingPage && (
        <div className="border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Editing: {editingPage.title}</h3>
          <input
            type="text"
            value={editingPage.title}
            onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            value={editingPage.slug}
            onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <div className="space-x-2">
            <Button onClick={() => handleSaveEdit(editingPage)}>Save</Button>
            <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
}
