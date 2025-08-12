import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from './api'

interface User {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  bio?: string
  mobile?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<boolean>
  updateProfile: (data: Partial<User>) => Promise<User>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  const login = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    
    try {
      const profile = await apiClient.getProfile(accessToken)
      setUser(profile)
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      logout()
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      setIsLoading(false)
      return false
    }

    try {
      const profile = await apiClient.getProfile(token)
      setUser(profile)
      setIsLoading(false)
      return true
    } catch (error) {
      // Token might be expired, try to refresh
      const refreshToken = localStorage.getItem('refresh_token')
      
      if (refreshToken) {
        try {
          const response = await apiClient.refreshToken(refreshToken)
          localStorage.setItem('access_token', response.access_token)
          localStorage.setItem('refresh_token', response.refresh_token)
          
          const profile = await apiClient.getProfile(response.access_token)
          setUser(profile)
          setIsLoading(false)
          return true
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError)
          logout()
          setIsLoading(false)
          return false
        }
      } else {
        logout()
        setIsLoading(false)
        return false
      }
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    updateProfile: async (data: Partial<User>) => {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Not authenticated');
      const updated = await apiClient.updateProfile(token, data);
      setUser(updated);
      return updated;
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 