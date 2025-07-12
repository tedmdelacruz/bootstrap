// Application configuration
export const config = {
  appName: import.meta.env.VITE_APP_NAME || 'Bootstrap Starter',
  apiUrl: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://api.example.com' : 'http://localhost:8000'),
} as const

// Type for the configuration
export type Config = typeof config 