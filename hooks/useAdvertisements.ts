import { useState, useEffect } from 'react'
import { Advertisement } from '@/types/post'

export function useAdvertisements() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAdvertisements() {
      try {
        const response = await fetch('/api/advertising')
        if (!response.ok) {
          throw new Error('Failed to fetch advertisements')
        }
        const data = await response.json()
        setAdvertisements(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching advertisements:', error)
        setError('Failed to fetch advertisements')
        setLoading(false)
      }
    }

    fetchAdvertisements()
  }, [])

  return { advertisements, loading, error }
}
