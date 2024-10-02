'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const placementOptions = [
  { value: 'sidebar', label: 'Sidebar' },
  { value: 'footer', label: 'Footer' },
  { value: 'header', label: 'Header' },
]

const formSchema = z.object({
  adName: z.string().min(1, 'Ad name is required'),
  adType: z.enum(['google_ads', 'custom']),
  adCode: z.string().optional(),
  placement: z.enum(['sidebar', 'footer', 'header']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isActive: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

type Advertisement = {
  id: number;
  ad_name: string;
  ad_type: 'google_ads' | 'custom';
  ad_code: string | null;
  placement: 'sidebar' | 'footer' | 'header' | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export default function AdvertisingPage() {
  const [isGoogleAds, setIsGoogleAds] = useState(true)
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adType: 'google_ads',
      isActive: true,
    },
  })

  useEffect(() => {
    fetchAdvertisements()
  }, [])

  const fetchAdvertisements = async () => {
    try {
      const response = await fetch('/api/advertising')
      if (!response.ok) {
        throw new Error('Failed to fetch advertisements')
      }
      const data = await response.json()
      setAdvertisements(data)
    } catch (error) {
      console.error('Error fetching advertisements:', error)
      setAlert({ type: 'error', message: 'Failed to fetch advertisements' })
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const method = editingAd ? 'PUT' : 'POST'
      const url = editingAd ? `/api/advertising/${editingAd.id}` : '/api/advertising'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${editingAd ? 'update' : 'create'} advertisement`);
      }

      const result = await response.json();
      console.log(`Advertisement ${editingAd ? 'updated' : 'created'}:`, result);
      fetchAdvertisements()
      setEditingAd(null)
      form.reset()
      setAlert({ type: 'success', message: `Advertisement ${editingAd ? 'updated' : 'created'} successfully` })
    } catch (error) {
      console.error(`Error ${editingAd ? 'updating' : 'creating'} advertisement:`, error);
      setAlert({ type: 'error', message: `Failed to ${editingAd ? 'update' : 'create'} advertisement` })
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad)
    form.reset({
      adName: ad.ad_name,
      adType: ad.ad_type,
      adCode: ad.ad_code || undefined,
      placement: ad.placement || undefined,
      startDate: ad.start_date ? new Date(ad.start_date) : undefined,
      endDate: ad.end_date ? new Date(ad.end_date) : undefined,
      isActive: ad.is_active,
    })
    setIsGoogleAds(ad.ad_type === 'google_ads')
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this advertisement?')) {
      try {
        const response = await fetch(`/api/advertising/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Failed to delete advertisement')
        }
        fetchAdvertisements()
        setAlert({ type: 'success', message: 'Advertisement deleted successfully' })
      } catch (error) {
        console.error('Error deleting advertisement:', error)
        setAlert({ type: 'error', message: 'Failed to delete advertisement' })
      }
    }
  }

  return (
    <div className="container mx-auto p-6">
      {alert && (
        <Alert variant={alert.type === 'success' ? 'default' : 'destructive'} className="mb-6">
          <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="adName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ad name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setIsGoogleAds(value === 'google_ads')
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ad type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="google_ads">Google Ads</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="adCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isGoogleAds ? 'Google AdSense Code' : 'Custom Ad Code'}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={isGoogleAds ? "Paste your Google AdSense code here" : "Enter your custom ad code"}
                        {...field}
                      />
                    </FormControl>
                    {isGoogleAds && (
                      <FormDescription>
                        Enter the full AdSense code snippet provided by Google.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placement</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ad placement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {placementOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Activate Advertisement
                      </FormLabel>
                      <FormDescription>
                        Turn on to make this ad active immediately.
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

              <div className="flex space-x-4">
                <Button type="submit">{editingAd ? 'Update' : 'Create'} Advertisement</Button>
                {editingAd && (
                  <Button type="button" variant="outline" onClick={() => {
                    setEditingAd(null)
                    form.reset()
                  }}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mt-12 mb-4">Existing Advertisements</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {advertisements.map((ad) => (
          <Card key={ad.id}>
            <CardHeader>
              <CardTitle>{ad.ad_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Type: {ad.ad_type}</p>
              <p>Placement: {ad.placement || 'N/A'}</p>
              <p>Active: {ad.is_active ? 'Yes' : 'No'}</p>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(ad)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(ad.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}
