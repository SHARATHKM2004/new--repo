import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-start justify-center gap-6 px-6 py-16">
      <p className="eyebrow text-xs font-semibold">404</p>
      <h1 className="serif text-5xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-xl text-lg leading-8 text-muted">
        The requested route does not exist in the current mock CMS dataset.
      </p>
      <Link
        href="/en"
        className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
      >
        Return home
      </Link>
    </main>
  );
}