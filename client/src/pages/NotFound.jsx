import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="text-2xl font-semibold text-zinc-900">404</h1>
      <p className="mt-2 text-zinc-600">Kjo faqe nuk u gjet.</p>
      <Link
        className="mt-6 inline-block rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white"
        to="/"
      >
        Kthehu në Ballina
      </Link>
    </main>
  );
}
