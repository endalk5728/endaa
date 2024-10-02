'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

interface Category {
  id: number;
  name: string;
  slug: string;
  meta_title: string;
  meta_description: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', meta_title: '', meta_description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await updateCategory(editingCategory.id);
    } else {
      await createCategory();
    }
  };

  const createCategory = async () => {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory),
    });
    if (res.ok) {
      setNewCategory({ name: '', slug: '', meta_title: '', meta_description: '' });
      fetchCategories();
      toast({ title: 'Success', description: 'Category created successfully' });
    } else {
      toast({ title: 'Error', description: 'Failed to create category', variant: 'destructive' });
    }
  };

  const updateCategory = async (id: number) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory),
    });
    if (res.ok) {
      setNewCategory({ name: '', slug: '', meta_title: '', meta_description: '' });
      setEditingCategory(null);
      fetchCategories();
      toast({ title: 'Success', description: 'Category updated successfully' });
    } else {
      toast({ title: 'Error', description: 'Failed to update category', variant: 'destructive' });
    }
  };

  const deleteCategory = async (id: number) => {
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchCategories();
      toast({ title: 'Success', description: 'Category deleted successfully' });
    } else {
      toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' });
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setNewCategory(category);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Manage Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              />
              <Input
                placeholder="Slug"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
              />
              <Input
                placeholder="Meta Title"
                value={newCategory.meta_title}
                onChange={(e) => setNewCategory({ ...newCategory, meta_title: e.target.value })}
              />
              <Textarea
                placeholder="Meta Description"
                value={newCategory.meta_description}
                onChange={(e) => setNewCategory({ ...newCategory, meta_description: e.target.value })}
              />
              <div className="flex space-x-2">
                <Button type="submit">{editingCategory ? 'Update Category' : 'Add Category'}</Button>
                {editingCategory && (
                  <Button variant="outline" onClick={() => setEditingCategory(null)}>Cancel Edit</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Existing Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>/{category.slug}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => startEditing(category)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteCategory(category.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
