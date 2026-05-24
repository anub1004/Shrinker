export interface Url {
  id: number
  longUrl: string
  shortCode: string
  createdAt: string
  expiresAt: string
}

export interface ShortenUrlRequest {
  longUrl: string
  customCode?: string | null
  customExpiry?: string | null
}

export interface ShortenUrlResponse {
  shortUrl: string
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
}

export interface UrlHistory {
  id: number
  longUrl: string
  shortCode: string
  shortUrl: string
  createdAt: string
  expiresAt: string
  isExpired: boolean
  clickCount?: number
}
