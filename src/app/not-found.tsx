import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <div className="max-w-md select-none">
        {/* Uses hairline color for a soft, integrated 404 logo */}
        <h1 className="font-display text-9xl font-black text-hairline leading-none">
          404
        </h1>

        <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Page Not Found
        </h2>

        <p className="mt-4 text-sm text-muted max-w-sm mx-auto">
          The event, card, or check-in terminal you are looking for does not exist or has been moved.
        </p>

        <div className="mt-8">
          <Link href="/" className="btn-seal">
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
