import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Home, LogIn, UserPlus, LayoutDashboard } from 'lucide-react'

const navItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Sign Up',
    href: '/signup',
    icon: UserPlus,
  },
  {
    title: 'Login',
    href: '/login',
    icon: LogIn,
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
] as const

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          asChild
          className={cn(
            'justify-start',
            location.pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline'
          )}
        >
          <Link
            to={item.href}
            className="flex items-center"
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
} 