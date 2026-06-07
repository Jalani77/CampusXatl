import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle, Smartphone } from "lucide-react";

const steps = [
  { n: "1", title: "Download CampusXATL", body: "Available for iPhone on iOS 17+. Free to download — no account required to browse." },
  { n: "2", title: "Create your profile", body: "Sign up with your name, school, and graduation year. Add a photo and bio so buyers can trust you." },
  { n: "3", title: "Post your first listing", body: "Tap Sell, choose a category, add photos, set your price, and publish. Takes less than two minutes." },
  { n: "4", title: "Connect with buyers", body: "Buyers message you directly from your listing. You set the meet-up spot — usually right on campus." },
];

const sellerBenefits = [
  "List items for sale or services you offer",
  "Set your own prices — no commissions on free tier",
  "Message buyers directly in-app",
  "Manage active, sold, and archived listings",
  "Build a seller profile with real transaction history",
  "Upgrade to Campus+ or Campus Pro for more tools",
];

export default function SellPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-24">
            <div className="max-w-2xl">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                style={{ backgroundColor: "#E8F5F3", color: "#1A7A6E" }}
              >
                <Smartphone size={12} />
                iOS app required
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-[1.15] mb-5">
                Start selling<br />to your campus.
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
                Turn textbooks, furniture, and your skills into cash. CampusXATL
                puts your listings in front of students at your school — and
                across Atlanta.
              </p>
              <a
                href="#get-started"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white rounded-xl"
                style={{ backgroundColor: "#1A7A6E" }}
              >
                How to get started
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* What you can sell */}
        <section className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">What sellers get</h2>
            <p className="text-gray-500 mb-8 max-w-lg">
              Whether you are selling a textbook or offering tutoring services,
              CampusXATL gives you the tools to do it cleanly.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {sellerBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4">
                  <CheckCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#1A7A6E" }} />
                  <span className="text-sm text-gray-700">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Steps */}
        <section id="get-started" className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">How to start selling</h2>
            <p className="text-gray-500 mb-12 max-w-md">
              Four steps from download to your first listing live on campus.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {steps.map((s) => (
                <div key={s.n} className="flex gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "#1A7A6E" }}
                  >
                    {s.n}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1.5">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App download CTA */}
        <section className="bg-gray-50">
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Ready to post your first listing?
                </h2>
                <p className="text-gray-500 max-w-md">
                  Open the CampusXATL app on your iPhone and tap Sell. Your first
                  listing can be live in under two minutes.
                </p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <div
                  className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium text-white"
                  style={{ backgroundColor: "#1A7A6E" }}
                >
                  <Smartphone size={16} />
                  <span>Download on the App Store</span>
                </div>
                <p className="text-xs text-gray-400 text-center">Requires iOS 17 · iPhone only</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
