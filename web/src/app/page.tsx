import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  BookOpen, Laptop, Sofa, Shirt, Wrench, Home, GraduationCap, Grid2x2,
  ArrowRight, ShieldCheck, MessageCircle, Star, MapPin, Zap,
} from "lucide-react";

const categories = [
  { label: "Textbooks",   icon: BookOpen },
  { label: "Electronics", icon: Laptop },
  { label: "Furniture",   icon: Sofa },
  { label: "Clothing",    icon: Shirt },
  { label: "Services",    icon: Wrench },
  { label: "Housing",     icon: Home },
  { label: "Tutoring",    icon: GraduationCap },
  { label: "Other",       icon: Grid2x2 },
];

const campuses = [
  "Georgia Tech",
  "Spelman College",
  "Morehouse College",
  "Clark Atlanta",
  "Georgia State",
  "Emory University",
  "Agnes Scott",
  "Kennesaw State",
];

const howItWorks = [
  {
    step: "01",
    title: "Create your profile",
    body: "Sign up with your student info. Add your school, graduation year, and a short bio so buyers and sellers know who they are dealing with.",
  },
  {
    step: "02",
    title: "Post or browse listings",
    body: "List items for sale or services you offer in minutes. Browse listings posted by students at your campus and nearby schools.",
  },
  {
    step: "03",
    title: "Connect and transact",
    body: "Message sellers directly from listings. Arrange meetups on campus. No middleman, no fees on the free tier.",
  },
];

const whyUs = [
  {
    icon: ShieldCheck,
    title: "Student-verified",
    body: "Accounts are tied to campus communities. No anonymous strangers — just students you can look up.",
  },
  {
    icon: MapPin,
    title: "Hyper-local",
    body: "Listings default to your campus area. Find someone in your dorm, not across the city.",
  },
  {
    icon: MessageCircle,
    title: "Built-in messaging",
    body: "Message sellers directly inside the app. Conversation threads are tied to listings so context is never lost.",
  },
  {
    icon: Zap,
    title: "Fast to list",
    body: "Post a listing in under two minutes. Simple form, photo upload, category, price — publish and done.",
  },
  {
    icon: Star,
    title: "Seller reputation",
    body: "Seller stats surface naturally from your activity. Build a real track record on your campus.",
  },
  {
    icon: GraduationCap,
    title: "Made for college life",
    body: "Textbooks at semester start. Furniture before graduation. Services when deadlines hit. Designed around how students actually live.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to get started.",
    features: [
      "Up to 3 active listings",
      "Standard profile",
      "Direct messaging",
      "Browse all categories",
    ],
    cta: "Get started free",
    highlight: false,
  },
  {
    name: "Campus+",
    price: "$4",
    period: "/ month",
    description: "For students who sell regularly.",
    features: [
      "Up to 15 active listings",
      "Seller badge on profile",
      "Activity insights",
      "Priority listing placement",
    ],
    cta: "Start Campus+",
    highlight: true,
  },
  {
    name: "Campus Pro",
    price: "$9",
    period: "/ month",
    description: "For power sellers and service providers.",
    features: [
      "Unlimited active listings",
      "Advanced seller tools",
      "Enhanced profile customization",
      "All Campus+ features",
    ],
    cta: "Start Campus Pro",
    highlight: false,
  },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-20 md:py-28">
            <div className="max-w-2xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                style={{ backgroundColor: "#E8F5F3", color: "#1A7A6E" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1A7A6E" }} />
                Now available in Atlanta
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-[1.15] mb-5">
                Your campus.<br />
                Your marketplace.
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                CampusXATL connects Atlanta college students to buy, sell, and
                offer services — all within your campus community.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white rounded-xl transition-colors"
                  style={{ backgroundColor: "#1A7A6E" }}
                >
                  Browse listings
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Start selling
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6">
                {["Atlanta campuses", "No hidden fees on free tier", "Student-verified accounts"].map((s) => (
                  <div key={s} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#1A7A6E" }} />
                    <span className="text-sm text-gray-500">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Browse by category</h2>
                <p className="text-sm text-gray-500">Find exactly what you need across campus.</p>
              </div>
              <Link href="/browse" className="text-sm font-medium flex items-center gap-1" style={{ color: "#1A7A6E" }}>
                See all <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map(({ label, icon: Icon }) => (
                <Link
                  key={label}
                  href={`/browse?category=${label.toLowerCase()}`}
                  className="group bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-4 flex flex-col gap-3 transition-all hover:shadow-sm"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#E8F5F3" }}>
                    <Icon size={17} style={{ color: "#1A7A6E" }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Browse in app</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
            <div className="max-w-xl mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">How CampusXATL works</h2>
              <p className="text-gray-500">
                Designed around the pace of student life — fast to start, easy to use, trusted by your campus community.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((s) => (
                <div key={s.step} className="flex flex-col gap-4">
                  <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#1A7A6E" }}>
                    {s.step}
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why CampusXATL */}
        <section className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
            <div className="max-w-xl mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Built for your campus</h2>
              <p className="text-gray-500">
                Not a generic classifieds site. Not Craigslist. CampusXATL is made specifically for college life in Atlanta.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {whyUs.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E8F5F3" }}>
                    <Icon size={17} style={{ color: "#1A7A6E" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Campuses */}
        <section id="campuses" className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-16">
            <div className="max-w-xl mb-10">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Atlanta&apos;s campus network</h2>
              <p className="text-gray-500">
                Listings filter to your school by default, but you can browse across the whole Atlanta college community.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {campuses.map((c) => (
                <div key={c} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-700">
                  {c}
                </div>
              ))}
              <div className="px-4 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-full text-sm text-gray-400">
                + more coming
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
            <div className="max-w-xl mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Simple, honest pricing</h2>
              <p className="text-gray-500">Start free. Upgrade only when you need more. No surprise fees.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl border p-6 flex flex-col gap-5 bg-white ${plan.highlight ? "border-[#1A7A6E] shadow-sm" : "border-gray-200"}`}
                >
                  {plan.highlight && (
                    <div className="self-start px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: "#E8F5F3", color: "#1A7A6E" }}>
                      Most popular
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-gray-500 mb-1">{plan.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-semibold text-gray-900">{plan.price}</span>
                      <span className="text-sm text-gray-400">{plan.period}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1.5">{plan.description}</p>
                  </div>
                  <ul className="flex flex-col gap-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E8F5F3" }}>
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M1 3L3 5L7 1" stroke="#1A7A6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/sell"
                    className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium text-center transition-colors ${plan.highlight ? "text-white" : "text-gray-700 bg-gray-100 hover:bg-gray-200"}`}
                    style={plan.highlight ? { backgroundColor: "#1A7A6E" } : {}}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-24">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight leading-[1.2] mb-5">
                Ready to start selling<br className="hidden sm:block" /> on your campus?
              </h2>
              <p className="text-gray-500 mb-8 max-w-md">
                Download CampusXATL, create your profile, and post your first listing in under five minutes.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/sell"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white rounded-xl transition-colors"
                  style={{ backgroundColor: "#1A7A6E" }}
                >
                  Get the app
                  <ArrowRight size={15} />
                </Link>
                <Link href="/about" className="px-5 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
