import React, { useState } from 'react'
import { useAppDispatch } from '../hooks/useRedux'
import { shortenUrl, clearError, clearSuccessMessage, deleteUrl, clearHistory } from '../store/slices/shortenSlice'
import { useShortenState } from '../hooks/useRedux'
import { ShortenUrlForm } from '../components/forms/ShortenUrlForm'
import { UrlHistoryTable } from '../components/tables/UrlHistoryTable'
import type { ShortenUrlFormData } from '../utils/validation'

const FeatureCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div className="text-sm border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
    <p className="text-xs text-gray-500 dark:text-gray-600 mb-2">{number}</p>
    <h4 className="font-semibold text-black dark:text-white mb-1">{title}</h4>
    <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">{description}</p>
  </div>
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

  return (
    <div className="flex flex-col gap-16">
      <div className="container-card max-w-2xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-widest mb-6 border border-gray-300 dark:border-gray-700 inline-block px-3 py-1 rounded">
            URL Shortener
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-4 leading-tight">
            Make it<br /><span className="text-gray-500 dark:text-gray-600">shorter.</span>
          </h2>
          <p className="text-gray-700 dark:text-gray-400 text-base max-w-lg mx-auto">
            Paste your long URL. Get a clean short link. No sign-up.
          </p>
        </div>

        <div className="mb-6">
          <ShortenUrlForm
            onSubmit={handleShortenUrl}
            loading={loading}
            error={error || ''}
            successMessage={successMessage || ''}
            onErrorClear={() => dispatch(clearError())}
            onSuccessClear={() => dispatch(clearSuccessMessage())}
          />
        </div>

        {lastShortenedUrl && (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-4 mt-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={lastShortenedUrl.shortUrl}
                readOnly
                className="input-base flex-1 font-mono text-sm"
              />
              <button
                onClick={() => handleCopy(lastShortenedUrl.shortUrl)}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium hover:opacity-90 transition"
              >
                {copiedId === lastShortenedUrl.shortUrl ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-2 border-gray-300  border-solid rounded-md p-4
      dark:border-gray-700 pt-12">
        <FeatureCard
          number="01"
          title="Lightning fast"
          description="Powered by Redis cache - repeated visits redirect in under a millisecond."
        />
        <FeatureCard
          number="02"
          title="Custom links"
          description="Choose your own short code instead of a random one - make it memorable."
        />
        <FeatureCard
          number="03"
          title="Auto-expiring"
          description="Set an expiry on any link stage online. Expired links show a 'link expired' page."
        />
      </div>

      {urls.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Your Links</h3>
            <button
              onClick={() => {
                if (window.confirm('Clear all history?')) {
                  dispatch(clearHistory())
                }
              }}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
            >
              Clear
            </button>
          </div>
          <UrlHistoryTable
            urls={urls}
            loading={false}
            onDelete={handleDeleteUrl}
            onCopy={handleCopy}
          />
        </div>
      )}
    </div>
  )
}
