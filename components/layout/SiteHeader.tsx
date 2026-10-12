"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/brand/Button";
import { useOrder } from "@/hooks/useOrder";

const LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Build Your Bowl" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { itemCount } = useOrder();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`dark-surface fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open
          ? "bg-red-brand/96 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.75)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      {/* Scrim so the nav stays readable over photography before you scroll. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-[140%] bg-[linear-gradient(180deg,rgba(23,6,7,0.72)_0%,rgba(23,6,7,0.34)_55%,transparent_100%)] transition-opacity duration-300 ${
          scrolled || open ? "opacity-0" : "opacity-100"
        }`}
      />

      <div className="relative mx-auto flex h-[var(--nav-h)] max-w-[1400px] items-center gap-6 px-5 text-cream sm:px-8">
        <Link
          href="/"
          className="press rounded-lg"
          aria-label="RoPot Hotpot — home"
        >
          <Logo className="h-10 text-cream sm:h-11" />
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`press rounded-full px-4 py-2 text-[0.74rem] font-bold uppercase tracking-[0.14em] transition-colors ${
                  active
                    ? "bg-cream/15 text-cream"
                    : "text-cream/75 hover:bg-cream/10 hover:text-cream"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-2">
          <span className="hidden sm:block">
            <ButtonLink href="/order" variant="cream" size="sm">
              Order Takeaway
              {itemCount > 0 ? (
                <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-bright px-1.5 text-[0.65rem] text-cream">
                  {itemCount}
                </span>
              ) : null}
            </ButtonLink>
          </span>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="press flex h-10 w-10 items-center justify-center rounded-full bg-cream/12 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 8h16M4 16h16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div className="dark-surface border-t border-cream/15 bg-red-brand px-5 pb-8 pt-4 text-cream lg:hidden">
          <nav className="flex flex-col">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="press border-b border-cream/12 py-4 font-display text-2xl font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ButtonLink href="/order" variant="cream" size="lg" className="mt-6 w-full">
            Order Takeaway
          </ButtonLink>
        </div>
      ) : null}
    </header>
  );
}
