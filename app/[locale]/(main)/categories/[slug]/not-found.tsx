import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"

export default function NotFound() {
  return (
    <div className="min-h-(--dialog-h-50vh) flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-7xl font-bold text-brand/20 mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Category not found</h1>
        <p className="text-muted-foreground mb-6">
          This category doesn&apos;t exist or was removed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/categories">
            <Button className="w-full sm:w-auto">Browse categories</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">Go to homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
