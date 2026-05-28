"use client";

import React from "react";
import {
  ArrowRight, User, Users, Clock, DollarSign, BarChart3,
  CheckCircle, Video, MessageCircle, Brain, Crosshair,
  Database, Zap, BookOpen, GraduationCap, Trophy, Headphones
} from "lucide-react";

const GOLD = "#A78A43";
const BG = "#0a0a0a";
const BG_CARD = "rgba(255,255,255,0.03)";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_GOLD = "rgba(167,138,67,0.3)";
const TEXT = "#FFFFFF";
const TEXT_SUB = "#B0B0B8";
const TEXT_DIM = "rgba(255,255,255,0.45)";
const FONT = "Manrope, Inter, -apple-system, BlinkMacSystemFont, sans-serif";

const HEADSHOT = "https://i.gyazo.com/ad823c265c17c21f61996bb3aa3283e2.png";

const privateFeatures = [
  { icon: Crosshair, text: "Surgical leak correction with full database review" },
  { icon: User, text: "Dedicated 1-on-1 sessions tailored to your game" },
  { icon: Brain, text: "Personalized study plan updated quarterly" },
  { icon: Users, text: "Lifetime access to weekly group coaching" },
  { icon: MessageCircle, text: "Lifetime Discord community access" },
  { icon: Clock, text: "Flexible scheduling, pause option available" },
];

const cfpFeatures = [
  { icon: Database, text: "200M+ hand database powering exploitative strategies" },
  { icon: BarChart3, text: "Pool-specific data for every major site" },
  { icon: Video, text: "400+ hours of video content, updated weekly" },
  { icon: Zap, text: "Proprietary stat checker to X-ray your game" },
  { icon: Trophy, text: "$5.5M+ in player profits generated" },
  { icon: GraduationCap, text: "8 coaches available for 1-on-1 sessions" },
];

function FeatureItem({ icon: Icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: `rgba(167,138,67,0.1)`, border: `1px solid ${BORDER_GOLD}`,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon size={16} color={GOLD} />
      </div>
      <span style={{ fontSize: 15, color: TEXT_SUB, lineHeight: 1.6, paddingTop: 4 }}>{text}</span>
    </div>
  );
}

function Card({ title, subtitle, bestFor, features, ctaText, ctaHref, accent }) {
  const isGold = accent === "gold";
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: BG_CARD,
      border: `1px solid ${isGold ? BORDER_GOLD : BORDER}`,
      borderRadius: 16,
      padding: "40px 36px",
      display: "flex", flexDirection: "column",
      position: "relative",
      backdropFilter: "blur(10px)",
      transition: "border-color 0.2s ease",
    }}>
      {isGold && (
        <div style={{
          position: "absolute", top: -1, left: 40, right: 40, height: 2,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          borderRadius: 2
        }} />
      )}

      <h2 style={{
        fontSize: 28, fontWeight: 800, color: TEXT, marginBottom: 8,
        fontFamily: FONT, letterSpacing: "-0.02em"
      }}>{title}</h2>

      <p style={{ fontSize: 15, color: TEXT_SUB, lineHeight: 1.7, marginBottom: 20 }}>{subtitle}</p>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: "rgba(167,138,67,0.08)", border: `1px solid ${BORDER_GOLD}`,
        borderRadius: 50, padding: "6px 16px", marginBottom: 28, alignSelf: "flex-start"
      }}>
        <GraduationCap size={14} color={GOLD} />
        <span style={{ fontSize: 12, color: GOLD, fontWeight: 600, letterSpacing: "0.03em" }}>{bestFor}</span>
      </div>

      <div style={{ flex: 1 }}>
        {features.map((f, i) => <FeatureItem key={i} icon={f.icon} text={f.text} />)}
      </div>

      <a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
          background: isGold ? GOLD : "transparent",
          color: isGold ? "#0a0a0a" : GOLD,
          border: isGold ? "none" : `1.5px solid ${GOLD}`,
          padding: "18px 32px", borderRadius: 12, fontWeight: 700, fontSize: 15,
          textDecoration: "none", marginTop: 12, cursor: "pointer",
          boxShadow: isGold ? `0 4px 30px rgba(167,138,67,0.35)` : "none",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
      >
        {ctaText} <ArrowRight size={18} />
      </a>
    </div>
  );
}

export default function CoachingLandingPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)`,
      color: TEXT, fontFamily: FONT,
    }}>
      {/* Halo glow */}
      <div style={{
        position: "fixed", top: "-30%", left: "50%", transform: "translateX(-50%)",
        width: 900, height: 900,
        background: `radial-gradient(circle, rgba(167,138,67,0.08) 0%, transparent 65%)`,
        pointerEvents: "none", zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <section style={{
          maxWidth: 1200, margin: "0 auto", padding: "80px 32px 40px",
          textAlign: "center"
        }}>
          {/* Headshot */}
          <div style={{
            width: 120, height: 120, borderRadius: "50%", margin: "0 auto 32px",
            border: `3px solid ${BORDER_GOLD}`,
            boxShadow: `0 0 60px rgba(167,138,67,0.2)`,
            overflow: "hidden",
            background: BG,
          }}>
            <img
              src={HEADSHOT}
              alt="Patrick Gerritsen - Freenachos"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
            />
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(167,138,67,0.1)", border: `1px solid ${BORDER_GOLD}`,
            borderRadius: 50, padding: "8px 20px", marginBottom: 24
          }}>
            <Trophy size={14} color={GOLD} />
            <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>$5.5M+ in Student Profits</span>
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: TEXT,
            marginBottom: 20, lineHeight: 1.1, letterSpacing: "-0.025em"
          }}>
            Two Ways to <span style={{
              color: GOLD,
              textShadow: "0 0 80px rgba(167,138,67,0.4)"
            }}>Level Up</span> Your Game
          </h1>

          <p style={{
            fontSize: 17, color: TEXT_SUB, maxWidth: 600, margin: "0 auto 16px",
            lineHeight: 1.8
          }}>
            Whether you want dedicated personal attention or a complete ecosystem of data-driven strategies, there's a path built for you.
          </p>

          <p style={{ fontSize: 14, color: TEXT_DIM, marginBottom: 56 }}>
            by Patrick "Freenachos" Gerritsen
          </p>
        </section>

        {/* Two columns */}
        <section style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 32px 80px",
          display: "flex", gap: 24, flexWrap: "wrap"
        }}>
          <Card
            title="Private Coaching"
            subtitle="Intensive 1-on-1 mentorship directly with Patrick. Your game gets dissected, your leaks get plugged, and you get a personalized roadmap to move up in stakes. For players who want maximum accountability and rapid results."
            bestFor="BEST FOR: Serious players wanting personalized attention"
            features={privateFeatures}
            ctaText="Book a Free Intro Call"
            ctaHref="https://calendly.com/freenachos/intro"
            accent="gold"
          />
          <Card
            title="NachosPoker CFP"
            subtitle="Join the coaching-for-profits program backed by 200M+ hands of real data. Get access to pool-specific exploits, proprietary tools, a massive video library, and a community of crushers. You play, we invest."
            bestFor="BEST FOR: Players ready to go pro with backing"
            features={cfpFeatures}
            ctaText="Apply to NachosPoker"
            ctaHref="https://nachospoker.com"
            accent="outline"
          />
        </section>

        {/* Bottom quote */}
        <section style={{
          maxWidth: 720, margin: "0 auto", padding: "0 32px 80px", textAlign: "center"
        }}>
          <div style={{
            background: BG_CARD, border: `1px solid ${BORDER}`,
            borderRadius: 16, padding: "36px 40px",
            backdropFilter: "blur(10px)"
          }}>
            <p style={{ fontSize: 16, color: TEXT_SUB, lineHeight: 1.8, fontStyle: "italic", marginBottom: 16 }}>
              "Whether you choose private coaching or the CFP, the goal is the same: help you become the strongest version of yourself at the table. I only take on players I genuinely believe I can help."
            </p>
            <p style={{ fontSize: 14, color: GOLD, fontWeight: 600 }}>— Patrick "Freenachos" Gerritsen</p>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section[style*="display: flex"] {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
