import React from 'react'
import type { UrlHistory } from '../../types'
import { Button, Badge } from '../common'
import { formatDate, isUrlExpired, timeUntilExpiry, copyToClipboard } from '../../utils'

interface UrlHistoryTableProps {
  urls: UrlHistory[]
  loading?: boolean
  onDelete?: (id: number) => void
  onCopy?: (url: string) => void
}

export const UrlHistoryTable: React.FC<UrlHistoryTableProps> = ({
  urls,
  loading = false,
  onDelete,
  onCopy,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-200 h-16 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (urls.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg mb-2">No URLs shortened yet</p>
        <p className="text-gray-400 text-sm">Start by shortening your first URL above!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Short URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Original URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Expires</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {urls.map((url) => {
              const isExpired = isUrlExpired(url.expiresAt)
              return (
                <tr key={url.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-blue-600">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {url.shortCode}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="max-w-xs truncate" title={url.longUrl}>
                      {url.longUrl}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {isExpired ? (
                      <Badge variant="danger">Expired</Badge>
                    ) : (
                      <Badge variant="success">Active</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {!isExpired ? timeUntilExpiry(url.expiresAt) : 'Expired'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(url.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => copyToClipboard(url.shortUrl)}
                    >
                      📋 Copy
                    </Button>
                    {onDelete && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(url.id)}
                      >
                        🗑️ Delete
                      </Button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
