import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { shortenUrlSchema } from '../../utils/validation'
import type { ShortenUrlFormData } from '../../utils/validation'
import { Alert } from '../common'

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
    control,
  } = useForm<ShortenUrlFormData>({
    resolver: zodResolver(shortenUrlSchema),
  })

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedExpiry, setSelectedExpiry] = useState<string>('6m')
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'))

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const handleFormSubmit = async (data: ShortenUrlFormData) => {
    await onSubmit(data)
    reset()
  }

  const expiryOptions = [
    { id: '7d', label: '7 days', sublabel: 'Short-term', days: 7 },
    { id: '30d', label: '30 days', sublabel: 'Monthly', days: 30 },
    { id: '6m', label: '6 months', sublabel: 'Long-term', days: 180 },
    { id: 'never', label: 'Never', sublabel: 'Permanent', days: null },
  ]

  const minDate = new Date()
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <Alert type="error" message={error} onClose={onErrorClear} />
      )}
      {successMessage && (
        <Alert type="success" message={successMessage} onClose={onSuccessClear} />
      )}

      {/* URL Input Section */}
      <div className="flex gap-2">
        <input
          {...register('longUrl')}
          type="url"
          placeholder="https://your-very-long-url-goes-here.com/path"
          className="input-base flex-1 dark:text-gray-300"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 bg-black dark:bg-white text-white dark:text-black font-medium hover:opacity-90 disabled:opacity-50 transition whitespace-nowrap"
        >
          {loading ? 'Shrinking...' : 'SHRINK →'}
        </button>
      </div>

      {errors.longUrl && (
        <p className="text-red-600 dark:text-red-400 text-sm">{errors.longUrl.message}</p>
      )}

      {/* Toggle Options */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-gray-600 dark:text-gray-400 text-xs hover:text-gray-800 dark:hover:text-gray-300 transition"
      >
        {showAdvanced ? '▼' : '▶'} hide options
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-8 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 p-6 rounded">
          {/* Custom Slug Section */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-2 text-center">Custom slug</h4>
            <p className="text-gray-600 dark:text-gray-400 text-xs text-center mb-4">
              Leave blank for a random code like g7xK2. Enter something memorable instead.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-gray-700 dark:text-gray-400 text-sm font-mono flex items-center">
                shrink-backend.onrender.com/
              </div>
              <input
                {...register('customCode')}
                type="text"
                placeholder="my-custom-link"
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              />
            </div>
            {errors.customCode && (
              <p className="text-red-600 dark:text-red-400 text-xs mt-2">{errors.customCode.message}</p>
            )}
          </div>

          {/* Link Expiry Section */}
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-2 text-center">Link expiry</h4>
            <p className="text-gray-600 dark:text-gray-400 text-xs text-center mb-4">
              How long the link stays online. Expired links show a "link expired" page.
            </p>

            <div className="grid grid-cols-4 gap-3 mb-6">
              {expiryOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedExpiry(option.id)}
                  className={`py-3 px-3 rounded text-center transition border ${
                    selectedExpiry === option.id
                      ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold text-xs">{option.label}</div>
                  <div className={`text-xs mt-1 ${selectedExpiry === option.id ? 'text-gray-200 dark:text-gray-700' : 'text-gray-500 dark:text-gray-500'}`}>
                    {option.sublabel}
                  </div>
                </button>
              ))}
            </div>

            <div className={`date-picker-wrapper ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
              <Controller
                name="customExpiry"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) => {
                      if (date) {
                        const isoString = date.toISOString().slice(0, 16)
                        field.onChange(isoString)
                      }
                    }}
                    showTimeSelect
                    timeIntervals={15}
                    dateFormat="MMM d, yyyy h:mm aa"
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Select date & time"
                    className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white`}
                    popperClassName={isDarkMode ? 'dark-date-picker' : 'light-date-picker'}
                  />
                )}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.react-datepicker__wrapper) {
          position: relative;
          display: block;
          width: 100%;
        }

        :global(.light-date-picker) {
          --color-bg: white;
          --color-text: black;
          --color-border: #d1d5db;
          --color-hover: #f3f4f6;
          --color-selected: black;
          --color-selected-text: white;
        }

        :global(.dark-date-picker) {
          --color-bg: #111827;
          --color-text: #f3f4f6;
          --color-border: #374151;
          --color-hover: #1f2937;
          --color-selected: white;
          --color-selected-text: black;
        }

        :global(.react-datepicker) {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background-color: var(--color-bg, white);
          border: 1px solid var(--color-border, #d1d5db);
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          padding: 1rem;
        }

        :global(.dark-date-picker .react-datepicker) {
          background-color: var(--color-bg);
          border-color: var(--color-border);
        }

        :global(.react-datepicker__header) {
          background-color: var(--color-bg, white);
          border-bottom: 1px solid var(--color-border, #d1d5db);
          border-radius: 0.5rem 0.5rem 0 0;
          padding: 0.75rem;
        }

        :global(.dark-date-picker .react-datepicker__header) {
          background-color: var(--color-bg);
          border-color: var(--color-border);
        }

        :global(.react-datepicker__current-month-date-header) {
          color: var(--color-text, black);
          font-weight: 600;
          font-size: 0.875rem;
        }

        :global(.react-datepicker__day-names) {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        :global(.react-datepicker__day-name) {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text, black);
          font-size: 0.75rem;
          font-weight: 600;
          opacity: 0.6;
        }

        :global(.react-datepicker__month) {
          margin: 0;
        }

        :global(.react-datepicker__week) {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        :global(.react-datepicker__day) {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text, black);
          background-color: transparent;
          border: 1px solid transparent;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.75rem;
          transition: all 0.2s;
        }

        :global(.react-datepicker__day:hover) {
          background-color: var(--color-hover, #f3f4f6);
          border-color: var(--color-border, #d1d5db);
        }

        :global(.react-datepicker__day--selected) {
          background-color: var(--color-selected, black);
          color: var(--color-selected-text, white);
          border-color: var(--color-selected, black);
          font-weight: 600;
        }

        :global(.react-datepicker__day--keyboard-selected) {
          background-color: var(--color-selected, black);
          color: var(--color-selected-text, white);
        }

        :global(.react-datepicker__day--today) {
          font-weight: bold;
          border: 1px solid var(--color-selected, black);
        }

        :global(.react-datepicker__time-container) {
          border-left: 1px solid var(--color-border, #d1d5db);
          width: 100px;
        }

        :global(.dark-date-picker .react-datepicker__time-container) {
          border-color: var(--color-border);
        }

        :global(.react-datepicker__time-list) {
          background-color: var(--color-bg, white);
        }

        :global(.react-datepicker__time-list-item) {
          color: var(--color-text, black);
          font-size: 0.75rem;
          padding: 0.5rem;
          transition: all 0.2s;
        }

        :global(.react-datepicker__time-list-item:hover) {
          background-color: var(--color-hover, #f3f4f6);
        }

        :global(.react-datepicker__time-list-item--selected) {
          background-color: var(--color-selected, black);
          color: var(--color-selected-text, white);
          font-weight: 600;
        }

        :global(.react-datepicker__navigation) {
          top: 0.75rem;
        }

        :global(.react-datepicker__navigation--previous) {
          left: 0.75rem;
        }

        :global(.react-datepicker__navigation--next) {
          right: 0.75rem;
        }

        :global(.react-datepicker__navigation-icon) {
          top: 0.2rem;
          width: 0.5rem;
          height: 0.5rem;
        }

        :global(.react-datepicker__navigation-icon::before) {
          border-color: var(--color-text, black);
        }
      `}</style>
    </form>
  )
}
