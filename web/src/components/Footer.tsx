import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-5 py-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "#1A7A6E" }}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M7 2.5C4.5 2.5 2.5 4.5 2.5 7.5C2.5 10.5 4.5 12.5 7 12.5"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path d="M8.5 4L12 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M12 4L8.5 11" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900 tracking-tight text-[15px]">
                Campus<span style={{ color: "#1A7A6E" }}>XATL</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              The student marketplace built for Atlanta&apos;s college community.
            </p>
            <div className="flex items-center gap-1.5 mt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: i === 0 ? "#1A7A6E" : "#CBD5E1" }}
                />
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Product
              </p>
              <ul className="space-y-2.5">
                {[
                  { label: "Browse", href: "/browse" },
                  { label: "Sell", href: "/sell" },
                  { label: "Pricing", href: "/about#pricing" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Company
              </p>
              <ul className="space-y-2.5">
                {[
                  { label: "About", href: "/about" },
                  { label: "Campuses", href: "/about#campuses" },
                  { label: "Contact", href: "/about#contact" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Legal
              </p>
              <ul className="space-y-2.5">
                {[
                  { label: "Privacy", href: "/about" },
                  { label: "Terms", href: "/about" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} CampusXATL. Atlanta, GA.
          </p>
          <p className="text-xs text-gray-400">
            Built for students, by students.
          </p>
        </div>
      </div>
    </footer>
  );
}
