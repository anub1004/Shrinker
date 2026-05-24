export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  SHORTEN_URL: '/api/shorten',
  REDIRECT: (shortCode: string) => `/${shortCode}`,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  GONE: 410,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const CACHE_KEYS = {
  SHORTENED_URLS: 'shortened_urls',
  URL_HISTORY: 'url_history',
} as const;

export const UI_CONSTANTS = {
  MAX_URL_LENGTH: 2048,
  MIN_CUSTOM_CODE_LENGTH: 3,
  MAX_CUSTOM_CODE_LENGTH: 20,
  TOAST_DURATION: 3000,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_URL: 'Please enter a valid URL starting with http:// or https://',
  CUSTOM_CODE_TAKEN: 'This custom code is already taken.',
  URL_NOT_FOUND: 'URL not found.',
  URL_EXPIRED: 'This link has expired.',
  GENERIC_ERROR: 'An error occurred. Please try again.',
} as const;
