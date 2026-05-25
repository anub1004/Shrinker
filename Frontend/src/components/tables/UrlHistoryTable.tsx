import React from 'react'
import type { UrlHistory } from '../../types'
import { Badge } from '../common'
import { formatDate, isUrlExpired, timeUntilExpiry } from '../../utils'

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
          <div key={i} className="bg-gray-200 dark:bg-gray-800 h-12 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  if (urls.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">No URLs shortened yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wide">Short</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wide">Original</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wide">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wide">Expires</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wide">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
            {urls.map((url) => {
              const isExpired = isUrlExpired(url.expiresAt)
              return (
                <tr key={url.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-700 dark:text-gray-300">
                    <a
                      href={url.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-black dark:hover:text-white transition"
                    >
                      {url.shortCode}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
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
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {!isExpired ? timeUntilExpiry(url.expiresAt) : 'Expired'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(url.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => onCopy?.(url.shortUrl)}
                      className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded transition"
                    >
                      Copy
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(url.id)}
                        className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
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
