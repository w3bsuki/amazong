import { Button } from '@/components/ui/button'
import { MagnifyingGlass, House } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-brand/20 mb-4">404</div>
        
        <div className="size-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <MagnifyingGlass className="size-10 text-brand" weight="regular" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Page not found
        </h1>
        
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
          Try searching for what you need or go back to the homepage.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2 bg-brand hover:bg-brand/90 w-full sm:w-auto">
              <House className="size-4" />
              Go to homepage
            </Button>
          </Link>
          
          <Link href="/search">
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <MagnifyingGlass className="size-4" />
              Search products
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Link href="/todays-deals" className="text-link hover:underline">
              Today's Deals
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/customer-service" className="text-link hover:underline">
              Customer Service
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact" className="text-link hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
