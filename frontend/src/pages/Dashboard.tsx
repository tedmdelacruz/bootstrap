import { useState } from "react"
import { config } from "@/lib/config"
import { Navbar1 } from "@/components/NavBar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, BarChart3, Settings } from "lucide-react"

export function Dashboard() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDialogMessage, setProfileDialogMessage] = useState<string | null>(null);

  // Dashboard-specific navigation menu
  const dashboardMenu: any[] = []

  return (
    <div className="min-h-screen bg-background">
      <Navbar1
        logo={{
          url: "/dashboard",
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
          alt: `${config.appName} logo`,
          title: config.appName,
        }}
        menu={dashboardMenu}
        showLogout={true}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        profileDialogMessage={profileDialogMessage}
        setProfileDialogMessage={setProfileDialogMessage}
      />
      
      <div className="container py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to your starter dashboard</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Item
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No items yet</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Just you for now</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ready</div>
              <p className="text-xs text-muted-foreground">All systems go</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              This is your clean starter dashboard. Start building your application by:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Adding your own components to the frontend/src/components/ directory</li>
              <li>• Creating new API endpoints in the backend Django apps</li>
              <li>• Updating the routing in frontend/src/lib/router.tsx</li>
              <li>• Customizing the dashboard with your own content</li>
            </ul>
            <div className="pt-4">
              <Button variant="outline">
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 