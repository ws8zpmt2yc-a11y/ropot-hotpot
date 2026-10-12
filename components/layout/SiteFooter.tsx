import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { RobotMark } from "@/components/brand/RobotMark";
import { LOCATIONS } from "@/data/locations";

const COLUMNS = [
  {
    title: "Eat",
    links: [
      { href: "/menu", label: "Menu" },
      { href: "/order", label: "Build your bowl" },
      { href: "/locations", label: "Locations" },
    ],
  },
  {
    title: "The robots",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/about", label: "About RoPot" },
      { href: "/order", label: "Meet the arms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="dark-surface relative grain overflow-hidden bg-ink text-cream">
      <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] text-cream/[0.035]">
        <RobotMark className="h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo className="h-20 text-cream" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/65">
              Hot pot with a helping hand. Robots on the floor, cooks on the
              wok, one very good bowl at the end of it.
            </p>
            <p className="eyebrow mt-6 text-amber">Good food. Cuter robots.</p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="eyebrow text-cream/45">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[0.95rem] text-cream/80 transition-colors hover:text-amber"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="eyebrow text-cream/45">Find us</h3>
            <ul className="mt-4 space-y-4">
              {LOCATIONS.map((location) => (
                <li key={location.id} className="text-sm text-cream/75">
                  <span className="block font-semibold text-cream">
                    {location.name.replace("RoPot ", "")}
                  </span>
                  {location.address}
                  <br />
                  {location.suburb}
                  <br />
                  <a
                    href={`tel:${location.phone.replace(/[^\d+]/g, "")}`}
                    className="text-amber transition-opacity hover:opacity-80"
                  >
                    {location.phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/12 pt-7 text-[0.78rem] text-cream/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RoPot Hotpot. Adelaide, South Australia.</p>
          <p className="max-w-md">
            Our arms select and portion ingredients. Everything is cooked by the
            kitchen team out the back.
          </p>
        </div>
      </div>
    </footer>
  );
}
