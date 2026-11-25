import Link from "next/link";

export const metadata = {
  title: "Not found",
};

export default function NotFound() {
  return (
    <div className="max-w-3xl px-6 py-16 font-mono lg:px-12">
      <h1 className="text-2xl font-bold text-red">
        E484: Can&apos;t open file
      </h1>
      <p className="mt-4 text-muted">There is no page at this address.</p>
      <Link
        href="/"
        className="mt-6 inline-block text-cyan underline underline-offset-4 hover:text-pink"
      >
        Go home
      </Link>
    </div>
  );
}
