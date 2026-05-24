import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { UrlHistory } from '../../types'
import { urlService } from '../../services/urlService'

interface ShortenUrlPayload {
  longUrl: string
  customCode?: string
  customExpiry?: string
}

interface ShortenState {
  urls: UrlHistory[]
  loading: boolean
  error: string | null
  lastShortenedUrl: UrlHistory | null
  successMessage: string | null
}

const initialState: ShortenState = {
  urls: JSON.parse(localStorage.getItem('urlHistory') || '[]'),
  loading: false,
  error: null,
  lastShortenedUrl: null,
  successMessage: null,
}

export const shortenUrl = createAsyncThunk(
  'shorten/shortenUrl',
  async (payload: ShortenUrlPayload, { rejectWithValue }) => {
    try {
      const shortUrl = await urlService.shortenUrl({
        longUrl: payload.longUrl,
        customCode: payload.customCode,
        customExpiry: payload.customExpiry,
      })

      const newUrl: UrlHistory = {
        id: Date.now(),
        longUrl: payload.longUrl,
        shortCode: shortUrl.split('/').pop() || '',
        shortUrl: shortUrl,
        createdAt: new Date().toISOString(),
        expiresAt: payload.customExpiry || new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        isExpired: false,
        clickCount: 0,
      }

      return newUrl
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to shorten URL')
    }
  }
)

const shortenSlice = createSlice({
  name: 'shorten',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null
    },
    deleteUrl: (state, action: PayloadAction<number>) => {
      state.urls = state.urls.filter((url) => url.id !== action.payload)
      localStorage.setItem('urlHistory', JSON.stringify(state.urls))
    },
    clearHistory: (state) => {
      state.urls = []
      state.lastShortenedUrl = null
      localStorage.removeItem('urlHistory')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(shortenUrl.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(shortenUrl.fulfilled, (state, action) => {
        state.loading = false
        state.urls.unshift(action.payload)
        state.lastShortenedUrl = action.payload
        state.successMessage = 'URL shortened successfully!'
        localStorage.setItem('urlHistory', JSON.stringify(state.urls))
      })
      .addCase(shortenUrl.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearSuccessMessage, deleteUrl, clearHistory } = shortenSlice.actions
export default shortenSlice.reducer
