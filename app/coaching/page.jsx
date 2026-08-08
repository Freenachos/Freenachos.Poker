"use client";

import React from "react";
import NachosPokerNavBar from "@/components/NachosPokerNavBar";
import Footer from "@/components/Footer";
import ThreePaths from "@/components/home/ThreePaths";

/**
 * /coaching — the three-path router (P5.1): Course / Program / CFP.
 * The honest comparison page; each card links to its own funnel.
 */

const GOLD = "#A78A43";
const FONT = "Manrope, Inter, -apple-system, BlinkMacSystemFont, sans-serif";
const HEADSHOT = "/proof/coach-headshot.png";

export default function CoachingLandingPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0E1A",
      color: "#FFFFFF",
      fontFamily: FONT,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
      `}</style>

      <NachosPokerNavBar />

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 24px 100px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}>

        {/* Avatar */}
        <div style={{
          width: 100, height: 100, borderRadius: "50%",
          border: "3px solid rgba(167,138,67,0.3)", boxShadow: "0 0 60px rgba(167,138,67,0.15)",
          overflow: "hidden", marginBottom: 48,
        }}>
          <img src={HEADSHOT} alt="Patrick Gerritsen" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
          marginBottom: 16, letterSpacing: "-0.025em", textAlign: "center",
        }}>
          Which is right <span style={{ color: GOLD, textShadow: "0 0 60px rgba(167,138,67,0.4)" }}>for you?</span>
        </h1>

        <p style={{
          fontSize: 16, color: "#B0B0B8", lineHeight: 1.7, maxWidth: 520,
          textAlign: "center", marginBottom: 72,
        }}>
          Three ways to work with me: self-study, private mentorship, or backing. Different situations need different deals.
        </p>

        {/* The three paths */}
        <div style={{ width: "100%" }}>
          <ThreePaths context="coaching" />
        </div>

        {/* Footnote */}
        <p style={{
          fontSize: 13.5, color: "rgba(255,255,255,0.45)", marginTop: 72,
          textAlign: "center", maxWidth: 560, lineHeight: 1.8,
        }}>
          Not sure? Apply for the program and say so. The application asks, and I&apos;ll route you honestly. I&apos;d rather point you at the right thing than sell you the wrong one.
        </p>
      </div>

      <Footer />
    </div>
  );
}
