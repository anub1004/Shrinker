import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { shortenUrlSchema } from '../../utils/validation'
import type { ShortenUrlFormData } from '../../utils/validation'
import { Button, Alert } from '../common'

interface ShortenUrlFormProps {
  onSubmit: (data: ShortenUrlFormData) => Promise<void>
  loading?: boolean
  error?: string
  successMessage?: string
  onErrorClear?: () => void
  onSuccessClear?: () => void
}

export const ShortenUrlForm: React.FC<ShortenUrlFormProps> = ({
  onSubmit,
  loading = false,
  error,
  successMessage,
  onErrorClear,
  onSuccessClear,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ShortenUrlFormData>({
    resolver: zodResolver(shortenUrlSchema),
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFormSubmit = async (data: ShortenUrlFormData) => {
    await onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <Alert type="error" message={error} onClose={onErrorClear} />
      )}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={onSuccessClear} />
      )}

      <div>
        <label htmlFor="longUrl" className="block text-sm font-medium text-gray-700 mb-2">
          Your Long URL *
        </label>
        <input
          {...register('longUrl')}
          type="url"
          placeholder="https://example.com/very/long/url"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
        {errors.longUrl && (
          <p className="text-red-600 text-sm mt-1">{errors.longUrl.message}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-blue-600 text-sm hover:text-blue-700 font-medium"
      >
        {showAdvanced ? '▼ Hide' : '▶ Show'} Advanced Options
      </button>

      {showAdvanced && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div>
            <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Short Code (Optional)
            </label>
            <input
              {...register('customCode')}
              type="text"
              placeholder="my-custom-code"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            {errors.customCode && (
              <p className="text-red-600 text-sm mt-1">{errors.customCode.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">3-20 characters, alphanumeric</p>
          </div>

          <div>
            <label htmlFor="customExpiry" className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date (Optional)
            </label>
            <input
              {...register('customExpiry')}
              type="datetime-local"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <p className="text-xs text-gray-500 mt-1">Default: 6 months from now</p>
          </div>
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
        Shorten URL
      </Button>
    </form>
  )
}
