import { httpClient } from './apiClient'
import type { ShortenUrlRequest, ShortenUrlResponse } from '../types'

export const urlService = {
  shortenUrl: async (payload: ShortenUrlRequest): Promise<string> => {
    const response = await httpClient.post<string>(
      '/api/shorten',
      {
        longUrl: payload.longUrl,
        customCode: payload.customCode || null,
        customExpiry: payload.customExpiry || null,
      }
    )
    return response.data
  },

  getOriginalUrl: async (shortCode: string): Promise<string> => {
    const response = await httpClient.get<string>(
      `/${shortCode}`
    )
    return response.data
  },
}
