import React, { useState } from 'react'
import { useAppDispatch } from '../hooks/useRedux'
import { shortenUrl, clearError, clearSuccessMessage, deleteUrl, clearHistory } from '../store/slices/shortenSlice'
import { useShortenState } from '../hooks/useRedux'
import { ShortenUrlForm } from '../components/forms/ShortenUrlForm'
import { UrlHistoryTable } from '../components/tables/UrlHistoryTable'
import { Card, Button, Alert } from '../components/common'
import type { ShortenUrlFormData } from '../utils/validation'

interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  description?: string
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, description }) => (
  <Card className="text-center">
    <div className="text-4xl mb-2">{icon}</div>
    <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
    {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
  </Card>
)

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { urls, loading, error, successMessage, lastShortenedUrl } = useShortenState()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleShortenUrl = async (data: ShortenUrlFormData) => {
    await dispatch(shortenUrl({
      longUrl: data.longUrl,
      customCode: data.customCode,
      customExpiry: data.customExpiry,
    }))
  }

  const handleDeleteUrl = (id: number) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      dispatch(deleteUrl(id))
    }
  }

  const handleCopy = async (url: string) => {
    const copied = await navigator.clipboard.writeText(url)
    if (copied) {
      setCopiedId(url)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const activeUrls = urls.filter(u => !new Date(u.expiresAt).getTime() < Date.now())
  const expiredUrls = urls.filter(u => new Date(u.expiresAt).getTime() < Date.now())

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Shorten Your URLs, Track Your Links
        </h2>
        <p className="text-xl text-gray-600">
          Create short, shareable links instantly. Simple, fast, and reliable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total URLs Shortened"
          value={urls.length}
          icon="🔗"
          description="Across all time"
        />
        <StatsCard
          title="Active Links"
          value={activeUrls.length}
          icon="✅"
          description="Ready to use"
        />
        <StatsCard
          title="Expired Links"
          value={expiredUrls.length}
          icon="⏰"
          description="No longer active"
        />
      </div>

      <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Shorten a URL</h3>
          <p className="text-gray-600 text-sm mt-1">Paste your long URL below to create a short link</p>
        </div>
        <ShortenUrlForm
          onSubmit={handleShortenUrl}
          loading={loading}
          error={error || ''}
          successMessage={successMessage || ''}
          onErrorClear={() => dispatch(clearError())}
          onSuccessClear={() => dispatch(clearSuccessMessage())}
        />
      </Card>

      {lastShortenedUrl && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4">✅ URL Successfully Shortened!</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={lastShortenedUrl.shortUrl}
                  readOnly
                  className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleCopy(lastShortenedUrl.shortUrl)}
                >
                  {copiedId === lastShortenedUrl.shortUrl ? '✓ Copied!' : '📋 Copy'}
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original URL</label>
              <input
                type="text"
                value={lastShortenedUrl.longUrl}
                readOnly
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
        </Card>
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">URL History</h3>
          {urls.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all history?')) {
                  dispatch(clearHistory())
                }
              }}
            >
              🗑️ Clear History
            </Button>
          )}
        </div>
        <UrlHistoryTable
          urls={urls}
          loading={false}
          onDelete={handleDeleteUrl}
          onCopy={handleCopy}
        />
      </div>
    </div>
  )
}
