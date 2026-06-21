"use client";

import React from "react";
import Link from "next/link";
import NachosPokerNavBar from "@/components/NachosPokerNavBar";
import { ArrowLeft, Calendar, Clock, Mail, ArrowRight } from "lucide-react";

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
  return `${Math.max(2, Math.ceil(words / 200))} min read`;
}

export default function NewsletterPost({ post }) {
  const htmlContent = post.content?.free?.web || "";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0E1A",
        color: TEXT,
        fontFamily: "Manrope, Inter, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <NachosPokerNavBar />

      {/* Ambient glow */}
      <div
        style={{
          position: "fixed", top: "-20%", left: "50%", transform: "translateX(-50%)",
          width: 800, height: 800,
          background: "radial-gradient(circle, rgba(167,138,67,0.05) 0%, transparent 60%)",
          pointerEvents: "none", zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Top bar */}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 0" }}>
          <Link
            href="/newsletters"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, color: TEXT_SUB, textDecoration: "none",
              transition: "color 0.2s ease",
            }}
          >
            <ArrowLeft size={14} />
            Back to Archive
          </Link>
        </div>

        {/* Article */}
        <article style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 60px" }}>
          {/* Header */}
          <header style={{ marginBottom: 40 }}>
            {/* Meta */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Calendar size={13} color={TEXT_DIM} />
                <span style={{ fontSize: 13, color: TEXT_DIM }}>{formatDate(post.publish_date)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Clock size={13} color={TEXT_DIM} />
                <span style={{ fontSize: 13, color: TEXT_DIM }}>{estimateReadTime(htmlContent)}</span>
              </div>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: TEXT,
                lineHeight: 1.2, letterSpacing: "-0.025em", marginBottom: 12,
              }}
            >
              {post.title}
            </h1>

            {/* Subtitle */}
            {post.subtitle && (
              <p style={{ fontSize: 17, color: TEXT_SUB, lineHeight: 1.7 }}>{post.subtitle}</p>
            )}

            {/* Thumbnail */}
            {post.thumbnail_url && (
              <div
                style={{
                  width: "100%", borderRadius: 14, overflow: "hidden",
                  marginTop: 28, border: `1px solid ${BORDER}`,
                }}
              >
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            )}
          </header>

          {/* Content */}
          <div
            className="newsletter-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* Footer CTA */}
          <footer
            style={{
              marginTop: 60, borderTop: `1px solid ${BORDER}`, paddingTop: 40,
              textAlign: "center",
            }}
          >
            <div
              style={{
                background: BG_CARD, border: `1px solid ${BORDER_GOLD}`, borderRadius: 16,
                padding: "32px 28px", backdropFilter: "blur(10px)",
              }}
            >
              <Mail size={24} color={GOLD} style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 8 }}>
                Enjoyed this? Get every edition.
              </h3>
              <p style={{ fontSize: 14, color: TEXT_SUB, marginBottom: 20 }}>
                Subscribe to the Nachos Exploits Newsletter for free.
              </p>
              <Link
                href="/newsletter"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: GOLD, color: "#0a0a0a",
                  padding: "14px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                  textDecoration: "none",
                  boxShadow: "0 4px 24px rgba(167,138,67,0.3)",
                }}
              >
                Subscribe <ArrowRight size={16} />
              </Link>
            </div>
          </footer>
        </article>
      </div>

      {/* Content styling - force dark theme over Beehiiv's white inline styles */}
      <style>{`
        .newsletter-content {
          font-size: 16px;
          line-height: 1.8;
          color: ${TEXT_SUB};
        }
        .newsletter-content * {
          background-color: transparent !important;
          background: transparent !important;
          color: inherit !important;
          border-color: ${BORDER} !important;
        }
        .newsletter-content h1,
        .newsletter-content h2,
        .newsletter-content h3,
        .newsletter-content h4 {
          color: ${TEXT} !important;
          font-weight: 700;
          margin-top: 2em;
          margin-bottom: 0.5em;
          line-height: 1.3;
        }
        .newsletter-content h2 { font-size: 24px; }
        .newsletter-content h3 { font-size: 20px; }
        .newsletter-content p {
          margin-bottom: 1.2em;
          color: ${TEXT_SUB} !important;
        }
        .newsletter-content span {
          color: ${TEXT_SUB} !important;
        }
        .newsletter-content strong,
        .newsletter-content b {
          color: ${TEXT} !important;
        }
        .newsletter-content a {
          color: ${GOLD} !important;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .newsletter-content a:hover {
          opacity: 0.8;
        }
        .newsletter-content img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
          margin: 1.5em 0;
          border: 1px solid ${BORDER} !important;
          background: transparent !important;
        }
        .newsletter-content ul,
        .newsletter-content ol {
          padding-left: 24px;
          margin-bottom: 1.2em;
        }
        .newsletter-content li {
          margin-bottom: 0.5em;
          color: ${TEXT_SUB} !important;
        }
        .newsletter-content blockquote {
          border-left: 3px solid ${GOLD} !important;
          border-top: none !important;
          border-right: none !important;
          border-bottom: none !important;
          padding-left: 20px;
          margin: 1.5em 0;
          font-style: italic;
          color: rgba(255,255,255,0.7) !important;
        }
        .newsletter-content pre,
        .newsletter-content code {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid ${BORDER} !important;
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
          font-size: 14px;
          color: ${TEXT_SUB} !important;
        }
        .newsletter-content code {
          padding: 2px 6px;
          border-radius: 4px;
        }
        .newsletter-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
        }
        .newsletter-content th,
        .newsletter-content td {
          border: 1px solid ${BORDER} !important;
          padding: 10px 14px;
          text-align: left;
          color: ${TEXT_SUB} !important;
        }
        .newsletter-content th {
          background: rgba(167,138,67,0.1) !important;
          color: ${TEXT} !important;
          font-weight: 600;
        }
        .newsletter-content hr {
          border: none !important;
          border-top: 1px solid ${BORDER} !important;
          margin: 2em 0;
        }
        .newsletter-content div,
        .newsletter-content section,
        .newsletter-content article,
        .newsletter-content header,
        .newsletter-content footer,
        .newsletter-content td,
        .newsletter-content tr,
        .newsletter-content tbody,
        .newsletter-content table {
          background: transparent !important;
          background-color: transparent !important;
        }
        .newsletter-content [style*="background"] {
          background: transparent !important;
          background-color: transparent !important;
        }
      `}</style>
    </div>
  );
}
