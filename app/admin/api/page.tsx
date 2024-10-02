'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'

const formSchema = z.object({
  apiUrl: z.string().url({ message: 'Please enter a valid URL' }),
  jobCount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Please enter a valid number greater than 0',
  }),
})

export default function JobFetchForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingEnabled, setIsFetchingEnabled] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiUrl: 'http://api.ethiojobs.net/ethiojobs/api/job-board/jobs',
      jobCount: '10',
    },
  })

  useEffect(() => {
    setIsClient(true)
    const stored = localStorage.getItem('isFetchingEnabled')
    setIsFetchingEnabled(stored === null ? true : stored === 'true')
  }, [])

  const fetchJobs = useCallback(async (values: z.infer<typeof formSchema>) => {
    if (!isFetchingEnabled) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch jobs')
      }

      const result = await response.json()
      toast({
        title: 'Success',
        description: `Fetched and stored ${result.jobsStored} jobs`,
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch and store jobs',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [isFetchingEnabled])

  const startFetching = useCallback(() => {
    const values = form.getValues()
    fetchJobs(values)
    intervalRef.current = setInterval(() => {
      fetchJobs(values)
    }, 60000) // Fetch every minute
  }, [form, fetchJobs])

  const stopFetching = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsLoading(false) // Ensure loading state is reset when stopping
  }, [])

  useEffect(() => {
    if (isFetchingEnabled) {
      startFetching()
    } else {
      stopFetching()
    }
    return stopFetching // Cleanup function
  }, [isFetchingEnabled, startFetching, stopFetching])

  const toggleFetching = (enabled: boolean) => {
    setIsFetchingEnabled(enabled)
    localStorage.setItem('isFetchingEnabled', enabled.toString())
    if (!enabled) {
      stopFetching()
    }
  }

  if (!isClient) {
    return null // or a loading spinner
  }

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="apiUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter API URL" {...field} />
              </FormControl>
              <FormDescription>The URL of the job API</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Jobs to Fetch</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of jobs" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[5,10, 20, 50, 100].map((count) => (
                    <SelectItem key={count} value={count.toString()}>
                      {count}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Choose how many jobs to fetch from the API</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Enable Fetching</FormLabel>
            <FormDescription>
              Turn this off to stop automatic job fetching
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={isFetchingEnabled}
              onCheckedChange={toggleFetching}
            />
          </FormControl>
        </FormItem>

        <div>
          {isLoading ? 'Fetching...' : isFetchingEnabled ? 'Automatic fetching is enabled' : 'Automatic fetching is disabled'}
        </div>
      </form>
    </Form>
  )
}
