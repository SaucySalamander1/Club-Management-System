import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-8xl font-black text-amber-400">404</p>
        <h1 className="mb-4 text-3xl font-black text-foreground">
          Page not found
        </h1>
        <p className="mb-10 max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-full bg-amber-400 px-8 py-3.5 font-semibold text-black transition hover:bg-amber-300"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="rounded-full border border-border px-8 py-3.5 font-semibold transition hover:bg-accent"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </main>
  );
}