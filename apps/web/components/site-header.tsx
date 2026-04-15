import Link from "next/link";

export function SiteHeader() {
  const links = [
    { href: "/", label: "Planner" },
    { href: "/connect-chatgpt", label: "Connect to ChatGPT" },
    { href: "/community", label: "Community" },
  ] as const;

  return (
    <header className="border-b border-border/80 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link className="font-display text-2xl text-foreground" href="/">
          ITAM Planner
        </Link>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted">
          {links.map((link) => (
            <Link
              key={link.href}
              className="rounded-full px-3 py-2 transition hover:bg-white hover:text-foreground"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
