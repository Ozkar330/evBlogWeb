import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  Users, 
  Settings, 
  Database, 
  BarChart3, 
  FileText, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react'

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard?error=access-denied')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild className="mr-4">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-orange-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <Badge variant="destructive" className="ml-3">
                  ADMIN ACCESS
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">{session.user.name}</span>
              </div>
              <Button variant="outline" asChild>
                <Link href="/api/auth/signout">Sign Out</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Warning Banner */}
          <div className="mb-8">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-orange-800">
                      Administrative Access
                    </h3>
                    <p className="text-sm text-orange-700 mt-1">
                      You have administrative privileges. Use these tools responsibly and ensure all actions comply with data protection policies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">
                    Current active users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Healthy</div>
                  <p className="text-xs text-muted-foreground">
                    All systems operational
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.9%</div>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Admin Tools */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Administration Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User Management */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage user accounts, roles, and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      View All Users
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Role Assignments
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Account Actions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Content Management */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Content Management
                  </CardTitle>
                  <CardDescription>
                    Moderate posts, comments, and user-generated content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Review Posts
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Moderate Comments
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Content Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Settings */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    System Settings
                  </CardTitle>
                  <CardDescription>
                    Configure application settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      General Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Security Config
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Email Templates
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Database Management */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Database Management
                  </CardTitle>
                  <CardDescription>
                    Monitor database health and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Database Status
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Run Migrations
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Backup & Restore
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Analytics & Reports
                  </CardTitle>
                  <CardDescription>
                    View detailed system analytics and generate reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      User Analytics
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Performance Metrics
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Export Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Center */}
              <Card className="hover:shadow-md transition-shadow border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-700">
                    <Shield className="h-5 w-5 mr-2" />
                    Security Center
                  </CardTitle>
                  <CardDescription>
                    Monitor security events and manage access controls
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Security Logs
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Failed Logins
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      IP Restrictions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Admin Activity */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Administrative Activity</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <span className="text-sm font-medium">User role updated</span>
                        <p className="text-xs text-gray-500">Changed user@example.com from READER to AUTHOR</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <div>
                        <span className="text-sm font-medium">Content moderated</span>
                        <p className="text-xs text-gray-500">Removed inappropriate comment from post #1247</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <span className="text-sm font-medium">System backup completed</span>
                        <p className="text-xs text-gray-500">Automated daily backup finished successfully</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <div>
                        <span className="text-sm font-medium">Security alert resolved</span>
                        <p className="text-xs text-gray-500">Blocked suspicious login attempts from IP 192.168.1.100</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">2 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}