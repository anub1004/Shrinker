import { z } from 'zod'
import { isValidUrl } from './index'

export const shortenUrlSchema = z.object({
  longUrl: z
    .string()
    .min(1, 'URL is required')
    .refine(isValidUrl, 'URL must start with http:// or https://'),
  customCode: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length >= 3 && val.length <= 20),
      'Custom code must be between 3 and 20 characters'
    ),
  customExpiry: z.string().optional(),
})

export type ShortenUrlFormData = z.infer<typeof shortenUrlSchema>
