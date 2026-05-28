"use client";

import { useState, useMemo } from "react";
import { BlogPost, CATEGORY_ICONS, CATEGORY_ORDER } from "@/lib/blog-data";
import BlogCard from "./BlogCard";

const ALL = "Tümü";

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState(ALL);

  // Kategorileri ve içerik sayılarını hesapla
  const { categories, filteredPosts } = useMemo(() => {
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    const sorted = Object.keys(counts).sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

    const categories = [
      { slug: ALL, label: ALL, icon: "☰", count: posts.length },
      ...sorted.map((cat) => ({
        slug: cat,
        label: cat,
        icon: CATEGORY_ICONS[cat] || "📄",
        count: counts[cat],
      })),
    ];

    const filteredPosts =
      activeCategory === ALL
        ? posts
        : posts.filter((p) => p.category === activeCategory);

    return { categories, filteredPosts };
  }, [posts, activeCategory]);

  return (
    <div>
      {/* Mobil: yatay kaydırmalı kategori çipleri */}
      <div className="lg:hidden mb-6 -mx-6 px-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-semibold transition-all duration-200"
              style={
                activeCategory === cat.slug
                  ? {
                      background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                      color: "#fff",
                      boxShadow: "0 2px 8px rgba(124,58,237,0.35)",
                    }
                  : {
                      background: "#fff",
                      color: "#6b6880",
                      border: "1px solid rgba(139,92,246,0.15)",
                    }
              }
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full"
                style={
                  activeCategory === cat.slug
                    ? { background: "rgba(255,255,255,0.25)", color: "#fff" }
                    : { background: "rgba(139,92,246,0.08)", color: "#7c3aed" }
                }
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Masaüstü: sol sidebar + grid */}
      <div className="lg:flex gap-8 items-start">
        {/* Sol Sidebar */}
        <aside className="hidden lg:block w-[240px] flex-shrink-0">
          <div
            className="sticky top-8 rounded-2xl p-5"
            style={{
              background: "#fff",
              border: "1px solid rgba(139,92,246,0.1)",
              boxShadow: "0 2px 12px rgba(100,80,180,0.05)",
            }}
          >
            <p
              className="text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ color: "#9997b8" }}
            >
              Kategoriler
            </p>
            <nav className="flex flex-col gap-1">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
                    style={
                      isActive
                        ? {
                            background: "linear-gradient(135deg, #7c3aed18, #a855f718)",
                            color: "#6d28d9",
                            fontWeight: "700",
                          }
                        : { color: "#4a4870" }
                    }
                  >
                    {/* Sol aksent çizgisi */}
                    <span
                      className="w-0.5 h-5 rounded-full flex-shrink-0 transition-all duration-200"
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                          : "transparent",
                      }}
                    />
                    <span className="text-base leading-none">{cat.icon}</span>
                    <span className="flex-1">{cat.label}</span>
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full flex-shrink-0"
                      style={
                        isActive
                          ? {
                              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                              color: "#fff",
                            }
                          : {
                              background: "rgba(139,92,246,0.08)",
                              color: "#7c6fa0",
                            }
                      }
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Blog'da yer almak isteyenler için CTA */}
            <div
              className="mt-5 p-4 rounded-xl text-center"
              style={{
                background: "linear-gradient(135deg, #7c3aed10, #ec489910)",
                border: "1px solid rgba(168,85,247,0.15)",
              }}
            >
              <p className="text-[12px] font-semibold mb-2" style={{ color: "#6d28d9" }}>
                Dijital pazarlama danışmanlığı?
              </p>
              <a
                href="/#iletisim"
                className="inline-block text-[11px] font-bold px-3 py-1.5 rounded-full text-white"
                style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
              >
                Ücretsiz Danışmanlık
              </a>
            </div>
          </div>
        </aside>

        {/* İçerik Grid */}
        <div className="flex-1 min-w-0">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[32px] mb-3">📭</p>
              <p className="font-semibold" style={{ color: "#4a4870" }}>
                Bu kategoride henüz içerik yok
              </p>
              <p className="text-[13px] mt-1" style={{ color: "#9997b8" }}>
                Yakında yayınlanacak!
              </p>
              <button
                onClick={() => setActiveCategory(ALL)}
                className="mt-5 text-[13px] font-semibold px-4 py-2 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  color: "#fff",
                }}
              >
                Tüm içerikleri gör
              </button>
            </div>
          ) : (
            <>
              <p className="text-[13px] mb-5" style={{ color: "#9997b8" }}>
                <span className="font-semibold" style={{ color: "#4a4870" }}>
                  {filteredPosts.length}
                </span>{" "}
                içerik
                {activeCategory !== ALL && (
                  <>
                    {" · "}
                    <button
                      onClick={() => setActiveCategory(ALL)}
                      className="underline underline-offset-2 hover:text-purple-700 transition-colors"
                    >
                      Tümünü gör
                    </button>
                  </>
                )}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
