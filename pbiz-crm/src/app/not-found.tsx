import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 font-sans">
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <p className="text-gray-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="rounded-md bg-[#C8658E] px-4 py-2 text-sm text-white hover:bg-[#C8658E]/90"
      >
        Go Home
      </Link>
    </div>
  );
}
