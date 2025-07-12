import { createBrowserRouter, useNavigate, Navigate, type RouteObject } from 'react-router-dom'
import App from '@/App'
import { Signup } from '@/pages/Signup'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Define route parameters interfaces if needed
export interface DashboardParams {
  section?: string
}

// Define routes with proper TypeScript types
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ':section',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },

]

// Create the router
export const router = createBrowserRouter(routes)

// Custom hook for type-safe navigation
export const useAppNavigation = () => {
  const navigate = useNavigate()
  
  return {
    navigateToSignup: () => navigate('/signup'),
    navigateToLogin: () => navigate('/login'),
    navigateToDashboard: (section?: string) => 
      navigate(section ? `/dashboard/${section}` : '/dashboard'),
    navigateToHome: () => navigate('/'),
  }
} 