export function ApplyFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-neutral-50 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between md:px-8">
        <p>© 2026 BB Deco &amp; Catering Training Centre. All rights reserved.</p>
        <nav className="flex flex-wrap gap-6">
          <a className="hover:text-zinc-800" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-zinc-800" href="#">
            Terms of Service
          </a>
          <a className="hover:text-zinc-800" href="#">
            Help Center
          </a>
        </nav>
      </div>
    </footer>
  );
}
