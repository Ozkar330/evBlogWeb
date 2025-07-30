import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AuthFormSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OAuth buttons skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          {/* Divider skeleton */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Skeleton className="w-full h-px" />
            </div>
            <div className="relative flex justify-center">
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          
          {/* Form fields skeleton */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AuthSuccessSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </CardContent>
      </Card>
    </div>
  )
}

export function LoadingButton({ children, isLoading, ...props }: { 
  children: React.ReactNode
  isLoading: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  if (isLoading) {
    return (
      <button {...props} disabled className={`${props.className} opacity-75 cursor-not-allowed`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {children}
        </div>
      </button>
    )
  }
  
  return <button {...props}>{children}</button>
}