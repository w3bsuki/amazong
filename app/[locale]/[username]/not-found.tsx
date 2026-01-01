import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="text-6xl font-bold text-brand/20">404</div>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Not Found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This profile doesn&apos;t exist or has been removed.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90"
        >
          Go to homepage
        </Link>
        <Link
          href="/en/search"
          className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          Search products
        </Link>
      </div>
    </div>
  );
}
