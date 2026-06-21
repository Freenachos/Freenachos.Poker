"use client";

import React from "react";
import Link from "next/link";
import NachosPokerNavBar from "@/components/NachosPokerNavBar";
import { Mail, ArrowRight, ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

const GOLD = "#A78A43";
const BG_CARD = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_GOLD = "rgba(167,138,67,0.3)";
const TEXT = "#FFFFFF";
const TEXT_SUB = "#B0B0B8";
const TEXT_DIM = "rgba(255,255,255,0.45)";

function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(content) {
  if (!content) return "3 min";
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  return `${Math.max(2, Math.ceil(words / 200))} min`;
}

function stripHtmlPreview(html, maxLength = 160) {
  if (!html) return "";
  const text = html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export default function NewsletterArchive({ posts, currentPage, totalPages, totalResults }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        color: TEXT,
        fontFamily: "Manrope, Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <NachosPokerNavBar />

      {/* Ambient glow */}
      <div
        style={{
          position: "fixed", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: 900, height: 900,
          background: "radial-gradient(circle, rgba(167,138,67,0.06) 0%, transparent 60%)",
          pointerEvents: "none", zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <header style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px 40px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(167,138,67,0.1)", border: `1px solid ${BORDER_GOLD}`,
              borderRadius: 50, padding: "8px 18px", marginBottom: 20,
            }}
          >
            <Mail size={14} color={GOLD} />
            <span style={{ fontSize: 12, color: GOLD, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Newsletter Archive
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: TEXT,
              marginBottom: 12, letterSpacing: "-0.025em", lineHeight: 1.1,
            }}
          >
            The <span style={{ color: GOLD }}>Nachos Exploits</span> Newsletter
          </h1>

          <p style={{ fontSize: 16, color: TEXT_SUB, maxWidth: 560, margin: "0 auto 8px", lineHeight: 1.7 }}>
            Strategy breakdowns, population exploits, and data-driven insights to help you crush the games.
          </p>

          <p style={{ fontSize: 13, color: TEXT_DIM }}>
            {totalResults} {totalResults === 1 ? "edition" : "editions"} published
          </p>
        </header>

        {/* Posts Grid */}
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 40px" }}>
          {posts.length === 0 ? (
            <div
              style={{
                background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
                padding: "60px 32px", textAlign: "center",
              }}
            >
              <Mail size={40} color={TEXT_DIM} style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 16, color: TEXT_SUB }}>No newsletters published yet. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/newsletters/${post.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <article
                    style={{
                      background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
                      padding: "28px 24px", height: "100%",
                      display: "flex", flexDirection: "column",
                      backdropFilter: "blur(10px)",
                      transition: "border-color 0.2s ease, transform 0.15s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = BORDER_GOLD;
                      e.currentTarget.style.transform = "translateY(-3px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = BORDER;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Thumbnail */}
                    {post.thumbnail_url && (
                      <div
                        style={{
                          width: "100%", height: 160, borderRadius: 10, overflow: "hidden",
                          marginBottom: 16, background: "rgba(255,255,255,0.02)",
                        }}
                      >
                        <img
                          src={post.thumbnail_url}
                          alt={post.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Calendar size={12} color={TEXT_DIM} />
                        <span style={{ fontSize: 12, color: TEXT_DIM }}>{formatDate(post.publish_date)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={12} color={TEXT_DIM} />
                        <span style={{ fontSize: 12, color: TEXT_DIM }}>
                          {estimateReadTime(post.content?.free?.web)}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2
                      style={{
                        fontSize: 17, fontWeight: 700, color: TEXT,
                        marginBottom: 10, lineHeight: 1.4, letterSpacing: "-0.01em",
                      }}
                    >
                      {post.title}
                    </h2>

                    {/* Preview */}
                    <p style={{ fontSize: 13, color: TEXT_SUB, lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
                      {post.subtitle || stripHtmlPreview(post.content?.free?.web)}
                    </p>

                    {/* Read more */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "auto" }}>
                      <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>Read more</span>
                      <ArrowRight size={14} color={GOLD} />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 40px", display: "flex", justifyContent: "center", gap: 12 }}>
            {currentPage > 1 && (
              <Link
                href={`/newsletters?page=${currentPage - 1}`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 10,
                  padding: "10px 18px", fontSize: 13, color: TEXT_SUB, textDecoration: "none",
                  transition: "border-color 0.2s ease",
                }}
              >
                <ChevronLeft size={14} /> Previous
              </Link>
            )}

            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 10,
              padding: "10px 18px", fontSize: 13, color: TEXT_DIM,
            }}>
              Page {currentPage} of {totalPages}
            </div>

            {currentPage < totalPages && (
              <Link
                href={`/newsletters?page=${currentPage + 1}`}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 10,
                  padding: "10px 18px", fontSize: 13, color: TEXT_SUB, textDecoration: "none",
                  transition: "border-color 0.2s ease",
                }}
              >
                Next <ChevronRight size={14} />
              </Link>
            )}
          </nav>
        )}

        {/* Subscribe CTA */}
        <section style={{ maxWidth: 600, margin: "0 auto", padding: "20px 24px 80px", textAlign: "center" }}>
          <div
            style={{
              background: BG_CARD, border: `1px solid ${BORDER_GOLD}`, borderRadius: 16,
              padding: "36px 32px", backdropFilter: "blur(10px)",
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 8 }}>
              Don't miss the next one
            </h3>
            <p style={{ fontSize: 14, color: TEXT_SUB, marginBottom: 20, lineHeight: 1.6 }}>
              Get strategy breakdowns and population exploits delivered straight to your inbox.
            </p>
            <Link
              href="/newsletter"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: GOLD, color: "#0a0a0a",
                padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                textDecoration: "none",
                boxShadow: "0 4px 24px rgba(167,138,67,0.3)",
                transition: "transform 0.15s ease",
              }}
            >
              Subscribe <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
