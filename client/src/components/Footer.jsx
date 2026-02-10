export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              Sekretet e Harresës
            </div>
            <p className="mt-2 text-sm text-zinc-600">
              Portal turistik-kulturor për shtegun Levan–Shtyllas–Apolloni.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900">Kontakt</div>
            <p className="mt-2 text-sm text-zinc-600">
              Email: info@shembull.al
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900">Social</div>
            <p className="mt-2 text-sm text-zinc-600">Instagram • Facebook</p>
          </div>
        </div>

        <div className="mt-8 text-xs text-zinc-500">
          © {new Date().getFullYear()} Sekretet e Harresës. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
