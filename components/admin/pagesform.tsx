'use client'

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { PagesInput, PageStatus } from '@/types/post';

const pageSchema = z.object({
    id: z.number().optional(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().nullable(),
  content: z.string().min(1, 'Content is required'),
  meta_title: z.string().nullable(),
  meta_description: z.string().nullable(),
  meta_keywords: z.string().nullable(),
  status: z.nativeEnum(PageStatus),
  is_footer_page: z.boolean(),
  footer_order: z.number().nullable(),
});

export default function PageManagement() {
  const [pages, setPages] = useState<PagesInput[]>([]);
  const [editingPage, setEditingPage] = useState<PagesInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<PagesInput>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      status: PageStatus.DRAFT,
      is_footer_page: false,
    },
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      } else {
        console.error('Failed to fetch pages');
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  useEffect(() => {
    if (editingPage) {
      reset(editingPage);
    } else {
      reset({
        status: PageStatus.DRAFT,
        is_footer_page: false,
      });
    }
  }, [editingPage, reset]);

  const onSubmit = async (data: PagesInput) => {
    setIsLoading(true);
    setAlertInfo(null);

    try {
      const response = await fetch('/api/pages', {
        method: editingPage ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setAlertInfo({
          type: 'success',
          message: editingPage ? 'Page updated successfully!' : 'Page created successfully!'
        });
        fetchPages();
        setEditingPage(null);
        reset();
      } else {
        const errorData = await response.json();
        setAlertInfo({
          type: 'error',
          message: errorData.message || 'An error occurred. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setAlertInfo({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        const response = await fetch(`/api/pages?id=${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setAlertInfo({
            type: 'success',
            message: 'Page deleted successfully!'
          });
          fetchPages();
        } else {
          const errorData = await response.json();
          setAlertInfo({
            type: 'error',
            message: errorData.message || 'Failed to delete the page. Please try again.'
          });
        }
      } catch (error) {
        console.error('Error deleting page:', error);
        setAlertInfo({
          type: 'error',
          message: 'An unexpected error occurred. Please try again.'
        });
      }
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
      <div className="w-full md:w-2/3 space-y-8">
        <h1 className="text-2xl font-bold">Page Management</h1>

        {alertInfo && (
          <Alert variant={alertInfo.type === 'success' ? 'default' : 'destructive'}>
            {alertInfo.type === 'success' ? (
              <CheckCircledIcon className="h-4 w-4" />
            ) : (
              <CrossCircledIcon className="h-4 w-4" />
            )}
            <AlertTitle>{alertInfo.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{alertInfo.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register('title')} placeholder="Title" />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}

          <Input {...register('slug')} placeholder="Slug" />
          {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}

          <Textarea {...register('description')} placeholder="Description" />

          <Textarea {...register('content')} placeholder="Content" />
          {errors.content && <p className="text-red-500">{errors.content.message}</p>}

          <Input {...register('meta_title')} placeholder="Meta Title" />
          <Input {...register('meta_description')} placeholder="Meta Description" />
          <Input {...register('meta_keywords')} placeholder="Meta Keywords" />

          <Select onValueChange={(value) => setValue('status', value as PageStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(PageStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_footer_page"
              onCheckedChange={(checked) => setValue('is_footer_page', checked)}
            />
            <label htmlFor="is_footer_page">Show in Footer</label>
          </div>

          <Input
            type="number"
            {...register('footer_order', { valueAsNumber: true })}
            placeholder="Footer Order"
          />

          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? 'Saving...' : editingPage ? 'Update Page' : 'Create Page'}
          </Button>
        </form>
      </div>

      <div className="w-full md:w-1/3 space-y-4">
        <h2 className="text-xl font-semibold">Pages List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
          {pages.map((page) => (
            <div key={page.id} className="border p-4 rounded-md flex flex-col">
              <div>
                <h3 className="font-medium">{page.title}</h3>
                <p className="text-sm text-gray-500">{page.slug}</p>
              </div>
              <div className="mt-2 space-x-2 flex flex-wrap">
                <Button variant="outline" onClick={() => setEditingPage(page)} className="mt-2">Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(page.id!)} className="mt-2">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

