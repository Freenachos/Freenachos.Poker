"use client";

import React from "react";
import { ArrowRight, User, Users } from "lucide-react";

const GOLD = "#A78A43";
const BG = "#0a0a0a";
const BORDER = "rgba(255,255,255,0.08)";
const BORDER_GOLD = "rgba(167,138,67,0.3)";
const TEXT = "#FFFFFF";
const TEXT_SUB = "#B0B0B8";
const TEXT_DIM = "rgba(255,255,255,0.45)";
const FONT = "Manrope, Inter, -apple-system, BlinkMacSystemFont, sans-serif";

export default function CoachingLandingPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
      color: TEXT, fontFamily: FONT,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
    }}>
      <div style={{ maxWidth: 800, width: "100%", textAlign: "center" }}>

        <h1 style={{
          fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800,
          marginBottom: 12, letterSpacing: "-0.025em",
        }}>
          Level Up Your <span style={{ color: GOLD }}>Poker</span>
        </h1>

        <p style={{ fontSize: 16, color: TEXT_SUB, marginBottom: 48, lineHeight: 1.6, maxWidth: 550, margin: "0 auto 48px" }}>
          Two paths to becoming a crusher. Pick the one that fits your situation.
        </p>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>

          {/* Private Coaching */}
          <div style={{
            flex: "1 1 320px", maxWidth: 380,
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${BORDER_GOLD}`, borderRadius: 16,
            padding: "36px 28px", textAlign: "left",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <User size={18} color={GOLD} />
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Private Coaching</h2>
            </div>

            <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.7, marginBottom: 20 }}>
              1-on-1 sessions directly with Patrick. Your database gets reviewed, leaks get identified,
              and you get a personalized plan to move up. Maximum attention, fastest results.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", fontSize: 13, color: TEXT_SUB }}>
              <li style={{ marginBottom: 8 }}>&#8226; Dedicated private sessions</li>
              <li style={{ marginBottom: 8 }}>&#8226; Full database & range audit</li>
              <li style={{ marginBottom: 8 }}>&#8226; Personalized study roadmap</li>
              <li style={{ marginBottom: 8 }}>&#8226; Direct access via Discord</li>
            </ul>

            <a
              href="https://freenachos.poker"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: GOLD, color: "#0a0a0a",
                padding: "14px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                textDecoration: "none", width: "100%",
              }}
            >
              Learn More <ArrowRight size={16} />
            </a>
          </div>

          {/* CFP */}
          <div style={{
            flex: "1 1 320px", maxWidth: 380,
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${BORDER}`, borderRadius: 16,
            padding: "36px 28px", textAlign: "left",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <Users size={18} color={GOLD} />
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Coaching For Profits</h2>
            </div>

            <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.7, marginBottom: 20 }}>
              A full ecosystem: 200M+ hands of pool data, exploitative playbooks, video library,
              proprietary tools, bot-warfare strategies, and backing. You play, we invest.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", fontSize: 13, color: TEXT_SUB }}>
              <li style={{ marginBottom: 8 }}>&#8226; Data-driven exploit strategies</li>
              <li style={{ marginBottom: 8 }}>&#8226; 400+ hours of video content</li>
              <li style={{ marginBottom: 8 }}>&#8226; Staking & financial backing</li>
              <li style={{ marginBottom: 8 }}>&#8226; Community of active grinders</li>
            </ul>

            <a
              href="https://nachospoker.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "transparent", color: GOLD, border: `2px solid ${GOLD}`,
                padding: "14px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                textDecoration: "none", width: "100%",
              }}
            >
              Apply Now <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <p style={{ fontSize: 13, color: TEXT_DIM, marginTop: 40 }}>
          Not sure which is right for you? Private coaching is for players who want dedicated 1-on-1 mentorship.
          The CFP is for players who want backing, tools, and a complete system.
        </p>
      </div>
    </div>
  );
}
