export * from './post'

// Utility types
export type Nullable<T> = T | null

export type WithId<T> = T & { id: number }

export type PaginationParams = {
  page: number
  limit: number
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type SortOrder = 'asc' | 'desc'

export type SortParams = {
  field: string
  order: SortOrder
}

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

// You can add more utility types here as needed

// Example: A type for API filters
export type ApiFilters = {
  [key: string]: string | number | boolean | null | undefined
}

// Example: A type for form field errors
export type FormErrors<T> = {
  [K in keyof T]?: string
}

// Example: A type for API query parameters
export type QueryParams = {
  [key: string]: string | number | boolean | undefined
}
