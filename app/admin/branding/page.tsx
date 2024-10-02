'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

import { Branding, BrandingFormData } from '@/types/post';

export default function AdminBranding() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<BrandingFormData>();
  const logoType = watch('logo_type');
  const logoFileRef = useRef<HTMLInputElement>(null);
  const faviconFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchBranding() {
      const response = await fetch('/api/admin/branding');
      const data: Branding = await response.json();
      setValue('logo_type', data.logo_type || 'image');
      setValue('logo_image', data.logo_image || '');
      setValue('logo_text', data.logo_text || '');
      setValue('favicon', data.favicon || '');
    }

    fetchBranding();
  }, [setValue]);

  const onSubmit = async (data: BrandingFormData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('logo_type', data.logo_type);

      if (data.logo_type === 'image') {
        if (logoFileRef.current?.files?.[0]) {
          formData.append('logo_image', logoFileRef.current.files[0]);
        } else {
          formData.append('logo_image', data.logo_image || '');
        }
      } else {
        formData.append('logo_text', data.logo_text || '');
      }

      if (faviconFileRef.current?.files?.[0]) {
        formData.append('favicon', faviconFileRef.current.files[0]);
      } else {
        formData.append('favicon', data.favicon || '');
      }

      const response = await fetch('/api/admin/branding', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({ title: 'Branding updated successfully' });
        const updatedBranding = await response.json();
        setValue('logo_image', updatedBranding.logo_image || '');
        setValue('logo_text', updatedBranding.logo_text || '');
        setValue('favicon', updatedBranding.favicon || '');
        if (logoFileRef.current) logoFileRef.current.value = '';
        if (faviconFileRef.current) faviconFileRef.current.value = '';
      } else {
        throw new Error('Failed to update branding');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update branding', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Branding</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <RadioGroup defaultValue="image" {...register('logo_type')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="image" id="logo-image" />
            <Label htmlFor="logo-image">Logo Image</Label>
          </div>
        </RadioGroup>

        {logoType === 'image' && (
          <div className="space-y-2">
            <Label htmlFor="logo-file">Upload Logo Image</Label>
            <Input
              id="logo-file"
              type="file"
              accept="image/*"
              ref={logoFileRef}
            />
            <Input
              type="text"
              placeholder="Current Logo Image Path"
              {...register('logo_image')}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="favicon-file">Upload Favicon</Label>
          <Input
            id="favicon-file"
            type="file"
            accept="image/x-icon,image/png"
            ref={faviconFileRef}
          />
          <Input
            type="text"
            placeholder="Current Favicon Path"
            {...register('favicon')}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Branding'}
        </Button>
      </form>
    </div>
  );
}
