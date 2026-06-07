import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

const values = [
  {
    title: "Community first",
    body: "CampusXATL exists to strengthen the connections between students — not just facilitate transactions. Every design decision prioritises trust over volume.",
  },
  {
    title: "Local by design",
    body: "We believe the best marketplace for college students is one built around a shared physical place. Campus life has a geography; our product reflects that.",
  },
  {
    title: "Honest product",
    body: "No fake social proof. No inflated metrics. No dark patterns. The app only shows you what is real — listings you create, messages you send, stats from your actual activity.",
  },
  {
    title: "Student economics",
    body: "Free tier is genuinely free. Paid tiers exist to fund the product, not gate essential features. You should be able to run a meaningful campus side-hustle without paying us.",
  },
];

const campuses = [
  "Georgia Tech",
  "Spelman College",
  "Morehouse College",
  "Clark Atlanta University",
  "Georgia State University",
  "Emory University",
  "Agnes Scott College",
  "Kennesaw State University",
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-24">
            <div className="max-w-2xl">
              <p className="text-sm font-medium mb-4" style={{ color: "#1A7A6E" }}>About CampusXATL</p>
              <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-[1.15] mb-6">
                A marketplace built<br />for Atlanta students.
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed">
                CampusXATL is a local-first student marketplace designed for
                the college communities of Atlanta, Georgia. It is built to be
                simple, trustworthy, and genuinely useful — without the noise
                of generic classifieds platforms.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-16">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                College students move constantly — into dorms, off-campus
                apartments, across cities at graduation. They need textbooks at
                the start of every semester and nowhere to put them at the end.
                They have skills and time to offer, and they need affordable
                services from peers they can trust.
              </p>
              <p className="text-gray-600 leading-relaxed">
                CampusXATL is built to be the reliable marketplace layer for
                all of that. Not a side project. Not a hackathon demo. A real
                product that a student should be able to open, use immediately,
                and trust.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-10">What we stand for</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {values.map((v) => (
                <div key={v.title} className="border border-gray-100 rounded-xl p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Campuses */}
        <section id="campuses" className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Supported campuses</h2>
            <p className="text-gray-500 mb-8 max-w-lg">
              CampusXATL currently supports students at these Atlanta-area institutions.
              More campuses will be added based on demand.
            </p>
            <ul className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
              {campuses.map((c) => (
                <li
                  key={c}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="bg-white">
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
            <div className="max-w-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Get in touch</h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Questions about CampusXATL, partnership inquiries, or feedback?
                We read every message.
              </p>
              <a
                href="mailto:hello@campusxatl.com"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white rounded-xl"
                style={{ backgroundColor: "#1A7A6E" }}
              >
                <Mail size={15} />
                hello@campusxatl.com
              </a>
            </div>

            <div className="mt-16 pt-10 border-t border-gray-100 flex flex-wrap gap-4">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                Home <ArrowRight size={12} />
              </Link>
              <Link href="/browse" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                Browse <ArrowRight size={12} />
              </Link>
              <Link href="/sell" className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                Sell <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
