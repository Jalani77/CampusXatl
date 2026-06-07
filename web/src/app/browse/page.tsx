import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Search, SlidersHorizontal, BookOpen, Laptop, Sofa, Shirt,
  Wrench, Home, GraduationCap, Grid2x2, ArrowRight,
} from "lucide-react";

const categories = [
  { label: "All",         icon: Grid2x2 },
  { label: "Textbooks",   icon: BookOpen },
  { label: "Electronics", icon: Laptop },
  { label: "Furniture",   icon: Sofa },
  { label: "Clothing",    icon: Shirt },
  { label: "Services",    icon: Wrench },
  { label: "Housing",     icon: Home },
  { label: "Tutoring",    icon: GraduationCap },
];

export default function BrowsePage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-gray-50">

        {/* Search header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-5">Browse listings</h1>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search listings, services, textbooks…"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7A6E] focus:border-transparent transition-all"
                  readOnly
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors">
                <SlidersHorizontal size={15} />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
              {categories.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    label === "All"
                      ? "text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={label === "All" ? { backgroundColor: "#1A7A6E" } : {}}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty state */}
        <div className="max-w-6xl mx-auto px-5 py-20">
          <div className="flex flex-col items-center text-center max-w-sm mx-auto">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{ backgroundColor: "#E8F5F3" }}
            >
              <Search size={24} style={{ color: "#1A7A6E" }} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Listings live in the app
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              CampusXATL is a native iPhone app. Download it to browse live
              listings from students at your campus.
            </p>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white rounded-xl transition-colors"
              style={{ backgroundColor: "#1A7A6E" }}
            >
              Get the app
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Skeleton cards to show layout */}
          <div className="mt-16">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                Preview layout
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                  <div className="aspect-square bg-gray-100 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-300 mt-4">
              Skeleton shown for layout reference only
            </p>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
