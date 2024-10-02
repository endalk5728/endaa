'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { BacklinkFormData } from '@/types/post';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
  anchor_text: z.string().min(1, { message: 'Anchor text is required' }),
  target_url: z.string().url({ message: 'Please enter a valid target URL' }),
  rel_attribute: z.enum(['follow', 'nofollow']),
  is_active: z.boolean(),
});

export default function BacklinkForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BacklinkFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      anchor_text: '',
      target_url: '',
      rel_attribute: 'follow',
      is_active: true,
    },
  });

  async function onSubmit(values: BacklinkFormData) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/backlinks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create backlink');
      }

      toast({
        title: 'Backlink created',
        description: 'Your backlink has been successfully created.',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create backlink. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormDescription>The URL of the page containing the backlink</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anchor_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anchor Text</FormLabel>
              <FormControl>
                <Input placeholder="Click here" {...field} />
              </FormControl>
              <FormDescription>The visible, clickable text of the backlink</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="target_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target URL</FormLabel>
              <FormControl>
                <Input placeholder="https://yourdomain.com" {...field} />
              </FormControl>
              <FormDescription>The URL that the backlink points to</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rel_attribute"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rel Attribute</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rel attribute" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="follow">Follow</SelectItem>
                  <SelectItem value="nofollow">Nofollow</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Choose whether search engines should follow this link</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
                <FormDescription>
                  Determine if this backlink should be active and displayed on the site
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Backlink'}
        </Button>
      </form>
    </Form>
  );
}
