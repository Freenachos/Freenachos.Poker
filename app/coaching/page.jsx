"use client";

import React from "react";
import NachosPokerNavBar from "@/components/NachosPokerNavBar";
import { ArrowRight, User, Users } from "lucide-react";

const GOLD = "#A78A43";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_GOLD = "rgba(167,138,67,0.3)";
const TEXT = "#FFFFFF";
const TEXT_SUB = "#B0B0B8";
const TEXT_DIM = "rgba(255,255,255,0.45)";
const FONT = "Manrope, Inter, -apple-system, BlinkMacSystemFont, sans-serif";

const HEADSHOT = "https://i.gyazo.com/ad823c265c17c21f61996bb3aa3283e2.png";

export default function CoachingLandingPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0E1A",
      color: TEXT, fontFamily: FONT,
    }}>
      <NachosPokerNavBar />

      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 32px 80px",
      }}>

      {/* Avatar */}
      <div style={{
        width: 100, height: 100, borderRadius: "50%",
        border: `3px solid ${BORDER_GOLD}`, boxShadow: "0 0 60px rgba(167,138,67,0.15)",
        overflow: "hidden", marginBottom: 80,
      }}>
        <img src={HEADSHOT} alt="Patrick Gerritsen" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800,
        marginBottom: 16, letterSpacing: "-0.025em", textAlign: "center",
      }}>
        Level Up Your <span style={{ color: GOLD }}>Poker</span>
      </h1>

      <p style={{ fontSize: 16, color: TEXT_SUB, lineHeight: 1.6, maxWidth: 480, textAlign: "center", marginBottom: 100 }}>
        Two paths to becoming a crusher. Pick the one that fits your situation.
      </p>

      {/* Two columns */}
      <div style={{ display: "flex", gap: 48, flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: 1100 }}>

        {/* Private Coaching */}
        <div style={{
          flex: "1 1 420px", maxWidth: 500,
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${BORDER_GOLD}`, borderRadius: 20,
          padding: "52px 40px", textAlign: "left",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <User size={20} color={GOLD} />
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Private Coaching</h2>
          </div>

          <p style={{ fontSize: 15, color: TEXT_SUB, lineHeight: 1.8, marginBottom: 28 }}>
            1-on-1 sessions directly with Patrick. Your database gets reviewed, leaks get identified,
            and you get a personalized plan to move up. Maximum attention, fastest results.
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", fontSize: 14, color: TEXT_SUB, lineHeight: 2.2 }}>
            <li>&#8226; Dedicated private sessions</li>
            <li>&#8226; Full database & range audit</li>
            <li>&#8226; Personalized study roadmap</li>
            <li>&#8226; Direct access via Discord</li>
          </ul>

          <a
            href="https://freenachos.poker"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: GOLD, color: "#0a0a0a",
              padding: "16px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15,
              textDecoration: "none", width: "100%",
            }}
          >
            Learn More <ArrowRight size={16} />
          </a>
        </div>

        {/* CFP */}
        <div style={{
          flex: "1 1 420px", maxWidth: 500,
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${BORDER}`, borderRadius: 20,
          padding: "52px 40px", textAlign: "left",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <Users size={20} color={GOLD} />
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Coaching For Profits</h2>
          </div>

          <p style={{ fontSize: 15, color: TEXT_SUB, lineHeight: 1.8, marginBottom: 28 }}>
            A full ecosystem: 200M+ hands of pool data, exploitative playbooks, video library,
            proprietary tools, bot-warfare strategies, and backing. You play, we invest.
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", fontSize: 14, color: TEXT_SUB, lineHeight: 2.2 }}>
            <li>&#8226; Data-driven exploit strategies</li>
            <li>&#8226; 400+ hours of video content</li>
            <li>&#8226; Staking & financial backing</li>
            <li>&#8226; Community of active grinders</li>
          </ul>

          <a
            href="https://nachospoker.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "transparent", color: GOLD, border: `2px solid ${GOLD}`,
              padding: "16px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15,
              textDecoration: "none", width: "100%",
            }}
          >
            Apply Now <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Footnote */}
      <p style={{ fontSize: 13, color: TEXT_DIM, marginTop: 100, textAlign: "center", maxWidth: 520 }}>
        Not sure which is right for you? Private coaching is for players who want dedicated 1-on-1 mentorship.
        The CFP is for players who want backing, tools, and a complete system.
      </p>
      </div>
    </div>
  );
}
