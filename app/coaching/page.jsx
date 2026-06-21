"use client";

import React, { useState } from "react";
import {
  ArrowRight, User, Users, Clock, DollarSign, BarChart3,
  CheckCircle, Video, MessageCircle, Brain, Crosshair,
  Database, Zap, BookOpen, GraduationCap, Trophy, Headphones,
  Shield, Target, Star, ChevronDown, Lock, Swords, TrendingUp
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
  { icon: Crosshair, title: "Surgical Leak Correction", text: "Full database audit comparing your ranges against GTO. We identify exactly where you bleed EV and build protocols to plug every leak." },
  { icon: User, title: "Dedicated 1-on-1 Sessions", text: "55-minute deep dives tailored to your game. No generic advice — every session is built around your specific weaknesses and goals." },
  { icon: Brain, title: "Personalized Study Plan", text: "A quarterly-updated roadmap designed around your database review. You always know exactly what to study and why." },
  { icon: Swords, title: "Weekly Group War Room", text: "Live study sessions with a group of motivated crushers. Dissect hands, debate lines, and stay accountable in a high-performance environment." },
  { icon: Zap, title: "Nacho Stat Validator", text: "Exclusive tool that compares your entire range structure to solver outputs. Instantly visualize where your strategy deviates from optimal." },
  { icon: Lock, title: "The Strategy Vault", text: "Growing library of high-stakes analyses, hand reviews, and deep theoretical dives covering concepts used to beat 1KNL and above." },
  { icon: MessageCircle, title: "Direct Priority Access", text: "Private Discord channel with Patrick. Post hands, ask questions, and get strategy breakdowns directly — you're never alone on the grind." },
  { icon: Clock, title: "Flexible & Pauseable", text: "Book sessions on your schedule. The 6-month program includes a 2-month pause option for life's curveballs." },
];

const cfpFeatures = [
  { icon: Database, title: "200M+ Hand Database", text: "Every strategy is powered by analysis of over 200 million real hands. Pool-specific data for Pokerstars, Bovada, GGPoker, and more." },
  { icon: Target, title: "Exploitative Playbook", text: "Comprehensive guidelines, catching matrices, and bluffing grids tell you exactly when to call, fold, or attack — backed by data, not guesswork." },
  { icon: Shield, title: "Bot Warfare Division", text: "198,000+ bots tracked across 5+ profiles. Our team has beaten them for millions. If you play Ignition/Bovada/Bodog, this alone is worth it." },
  { icon: Video, title: "400+ Hours of Video", text: "Complete archive of live sessions, presentations, and strategy breakdowns. 2-4 hours of fresh content added weekly — you'll never run out." },
  { icon: Zap, title: "Proprietary Stat Checker", text: "Our stat checker analyzes your entire game and identifies leaks instantly. Get a clear x-ray of where to focus study for maximum EV." },
  { icon: GraduationCap, title: "8 Coaches Available", text: "Once you reach Gold status, book 1-on-1 sessions with any of our 8 coaches. Interactive group coaching included from day one." },
  { icon: TrendingUp, title: "$5.5M+ Player Profits", text: "Our players have collectively generated over $5.5 million in profits. The system works — the numbers prove it." },
  { icon: Users, title: "Community of Crushers", text: "Active Discord with players grinding mid to high stakes. Hand discussions, study groups, and a support system that keeps you accountable." },
];

const privatePricing = [
  {
    name: "3-Month Kickstart",
    price: "€2,499",
    note: "Paid in full",
    features: ["6 Private 1-on-1 Sessions", "Lifetime Weekly Group Coaching", "Full Database Review", "Personalized Study Plan", "Lifetime Discord Access"],
    featured: false,
  },
  {
    name: "6-Month Accelerator",
    price: "€3,999",
    note: "Pay in full or 3 installments",
    badge: "MOST POPULAR",
    savings: "Save €1,000",
    features: ["12 Private 1-on-1 Sessions", "Lifetime Weekly Group Coaching", "Quarterly Database Review", "Quarterly Updated Study Plan", "Lifetime Discord Access", "2-Month Pause Option"],
    featured: true,
  },
  {
    name: "12-Month Mastery",
    price: "€5,999",
    note: "Pay in full or quarterly",
    badge: "BEST VALUE",
    savings: "Save €3,000",
    features: ["24 Private 1-on-1 Sessions", "Lifetime Weekly Group Coaching", "Quarterly Database Review", "Quarterly Updated Study Plan", "Lifetime Discord Access", "Priority Scheduling"],
    featured: false,
  },
];

const testimonials = [
  { name: "Keven Li", result: "100NL → 1000NL", quote: "His data-driven coaching changed everything — my results skyrocketed. Working with Patrick was the best decision I've made in poker." },
  { name: "Davide", result: "100NL → 1KNL in < 1 year", quote: "They helped me improve in every aspect of the game. Patrick is always patient, humble, and delivers more than expected." },
  { name: "Andrea", result: "Breakeven NL50 → Beating NL200", quote: "In about 13 months I went from being breakeven at NL50 to beating NL200, almost ready for NL500." },
  { name: "Peter", result: "Back to 2KNL", quote: "Freenachos CFP may have been the best decision of my career. I've since skyrocketed back on track, now competing at 2K." },
  { name: "Brendon", result: "Breakeven 100NL → 1000NL", quote: "Patrick's methodology elevated my game. The supportive community offers in-depth discussions crucial to my development." },
];

function FeatureRow({ icon: Icon, title, text }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: "rgba(167,138,67,0.08)", border: `1px solid ${BORDER_GOLD}`,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <Icon size={16} color={GOLD} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: TEXT, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 13, color: TEXT_SUB, lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  );
}

function PricingCard({ plan }) {
  return (
    <div style={{
      background: plan.featured ? "rgba(167,138,67,0.06)" : BG_CARD,
      border: `1px solid ${plan.featured ? BORDER_GOLD : BORDER}`,
      borderRadius: 14, padding: "24px 20px",
      position: "relative",
      flex: 1, minWidth: 0,
    }}>
      {plan.badge && (
        <div style={{
          position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
          background: GOLD, color: "#0a0a0a", fontSize: 10, fontWeight: 800,
          padding: "4px 12px", borderRadius: 50, letterSpacing: "0.05em"
        }}>{plan.badge}</div>
      )}
      <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 4 }}>{plan.name}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: GOLD, marginBottom: 2 }}>{plan.price}</div>
      <div style={{ fontSize: 12, color: TEXT_DIM, marginBottom: 4 }}>{plan.note}</div>
      {plan.savings && <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 600, marginBottom: 12 }}>{plan.savings}</div>}
      {!plan.savings && <div style={{ height: 12, marginBottom: 12 }} />}
      <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12 }}>
        {plan.features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <CheckCircle size={13} color={GOLD} />
            <span style={{ fontSize: 12, color: TEXT_SUB }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <div style={{
      background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
      padding: "20px 22px", marginBottom: 12
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>{t.name}</span>
        <span style={{ fontSize: 11, color: GOLD, fontWeight: 600, background: "rgba(167,138,67,0.1)", padding: "3px 10px", borderRadius: 50 }}>{t.result}</span>
      </div>
      <p style={{ fontSize: 13, color: TEXT_SUB, lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>"{t.quote}"</p>
    </div>
  );
}

export default function CoachingLandingPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    { q: "What skill level is best suited for private coaching?", a: "Players at mid-stakes or higher gain the most, but ambitious low-stakes players ready for serious commitment are also welcome. Patrick tailors every session to your level." },
    { q: "What's the difference between private coaching and the CFP?", a: "Private coaching is 1-on-1 mentorship directly with Patrick — maximum personal attention. The CFP is a complete ecosystem: data, video library, community, stat tools, and backing. Many players do both." },
    { q: "How does the CFP selection process work?", a: "Fill out the application on nachospoker.com. The team reviews your experience, goals, and mindset. If accepted, you get access to everything immediately and start your development path." },
    { q: "What payment options are available?", a: "BTC, USDT, Wise, and Revolut. PayPal and Skrill accepted with a 7% premium. Flexible payment plans available for all programs." },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
      color: TEXT, fontFamily: FONT,
    }}>
      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: "-30%", left: "50%", transform: "translateX(-50%)",
        width: 1000, height: 1000,
        background: "radial-gradient(circle, rgba(167,138,67,0.06) 0%, transparent 60%)",
        pointerEvents: "none", zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Hero */}
        <section style={{ maxWidth: 1300, margin: "0 auto", padding: "70px 32px 32px", textAlign: "center" }}>
          <div style={{
            width: 110, height: 110, borderRadius: "50%", margin: "0 auto 28px",
            border: `3px solid ${BORDER_GOLD}`, boxShadow: "0 0 60px rgba(167,138,67,0.2)",
            overflow: "hidden", background: BG,
          }}>
            <img src={HEADSHOT} alt="Patrick Gerritsen" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(167,138,67,0.1)", border: `1px solid ${BORDER_GOLD}`,
            borderRadius: 50, padding: "8px 20px", marginBottom: 20
          }}>
            <Trophy size={14} color={GOLD} />
            <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>$5.5M+ in Student Profits Generated</span>
          </div>

          <h1 style={{
            fontSize: "clamp(30px, 4.5vw, 50px)", fontWeight: 800, color: TEXT,
            marginBottom: 16, lineHeight: 1.1, letterSpacing: "-0.025em"
          }}>
            Choose Your Path to <span style={{ color: GOLD, textShadow: "0 0 80px rgba(167,138,67,0.4)" }}>Crushing</span> the Games
          </h1>

          <p style={{ fontSize: 17, color: TEXT_SUB, maxWidth: 700, margin: "0 auto 12px", lineHeight: 1.7 }}>
            Whether you want dedicated 1-on-1 attention from Patrick or a complete data-driven ecosystem with backing, there's a proven path built for you.
          </p>
          <p style={{ fontSize: 14, color: TEXT_DIM }}>by Patrick "Freenachos" Gerritsen — 100+ students coached from low to high stakes</p>
        </section>

        {/* Two Columns */}
        <section style={{ maxWidth: 1300, margin: "0 auto", padding: "40px 32px 60px", display: "flex", gap: 28, alignItems: "stretch" }} className="coaching-columns">

          {/* LEFT: Private Coaching */}
          <div style={{
            flex: 1, minWidth: 0, background: BG_CARD,
            border: `1px solid ${BORDER_GOLD}`, borderRadius: 20,
            padding: "44px 36px", display: "flex", flexDirection: "column",
            backdropFilter: "blur(10px)", position: "relative",
          }}>
            {/* Top gold line */}
            <div style={{
              position: "absolute", top: -1, left: 40, right: 40, height: 2,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, borderRadius: 2
            }} />

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(167,138,67,0.1)", border: `1px solid ${BORDER_GOLD}`,
              borderRadius: 50, padding: "6px 16px", marginBottom: 20, alignSelf: "flex-start"
            }}>
              <User size={14} color={GOLD} />
              <span style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>1-on-1 Mentorship</span>
            </div>

            <h2 style={{ fontSize: 30, fontWeight: 800, color: TEXT, marginBottom: 10, letterSpacing: "-0.02em" }}>Private Coaching</h2>
            <p style={{ fontSize: 15, color: TEXT_SUB, lineHeight: 1.7, marginBottom: 28 }}>
              Intensive mentorship directly with Patrick. Your game gets dissected, your leaks get plugged, and you receive a personalized roadmap to move up in stakes. For players who want maximum accountability and the fastest results.
            </p>

            {/* Who it's for */}
            <div style={{
              background: "rgba(167,138,67,0.04)", border: `1px solid ${BORDER}`,
              borderRadius: 12, padding: "16px 20px", marginBottom: 28
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Best For</div>
              <div style={{ fontSize: 13, color: TEXT_SUB, lineHeight: 1.7 }}>
                Serious players at NL100+ who want personalized attention, rapid improvement, and direct access to a proven high-stakes coach. Players willing to put in the off-table work.
              </div>
            </div>

            {/* Features */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DIM, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>What You Get</div>
              {privateFeatures.map((f, i) => <FeatureRow key={i} icon={f.icon} title={f.title} text={f.text} />)}
            </div>

            {/* Pricing */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DIM, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>Investment</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {privatePricing.map((p, i) => <PricingCard key={i} plan={p} />)}
              </div>
            </div>

            {/* CTA */}
            <div style={{ marginTop: "auto" }}>
              <a
                href="https://freenachos.poker"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  background: GOLD, color: "#0a0a0a",
                  padding: "20px 32px", borderRadius: 12, fontWeight: 700, fontSize: 16,
                  textDecoration: "none", cursor: "pointer", width: "100%",
                  boxShadow: "0 4px 30px rgba(167,138,67,0.35)",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 40px rgba(167,138,67,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 30px rgba(167,138,67,0.35)"; }}
              >
                Book a Free Intro Call <ArrowRight size={18} />
              </a>
              <p style={{ fontSize: 12, color: TEXT_DIM, textAlign: "center", marginTop: 10 }}>No commitment — let's see if we're a good fit</p>
            </div>
          </div>

          {/* RIGHT: Coaching For Profits */}
          <div style={{
            flex: 1, minWidth: 0, background: BG_CARD,
            border: `1px solid ${BORDER}`, borderRadius: 20,
            padding: "44px 36px", display: "flex", flexDirection: "column",
            backdropFilter: "blur(10px)", position: "relative",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(167,138,67,0.1)", border: `1px solid ${BORDER_GOLD}`,
              borderRadius: 50, padding: "6px 16px", marginBottom: 20, alignSelf: "flex-start"
            }}>
              <Users size={14} color={GOLD} />
              <span style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>CFP Program</span>
            </div>

            <h2 style={{ fontSize: 30, fontWeight: 800, color: TEXT, marginBottom: 10, letterSpacing: "-0.02em" }}>Coaching For Profits</h2>
            <p style={{ fontSize: 15, color: TEXT_SUB, lineHeight: 1.7, marginBottom: 28 }}>
              Join the fastest-growing CFP in poker backed by 200M+ hands of real data. Get access to pool-specific exploits, proprietary tools, a massive video library, bot-warfare strategies, and a community of crushers. You play, we invest.
            </p>

            {/* Who it's for */}
            <div style={{
              background: "rgba(167,138,67,0.04)", border: `1px solid ${BORDER}`,
              borderRadius: 12, padding: "16px 20px", marginBottom: 28
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>Best For</div>
              <div style={{ fontSize: 13, color: TEXT_SUB, lineHeight: 1.7 }}>
                Players ready to go pro with backing. You get the strategies, tools, community, and financial support to rapidly ascend from mid to high stakes without risking your own bankroll.
              </div>
            </div>

            {/* Features */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DIM, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>What You Get</div>
              {cfpFeatures.map((f, i) => <FeatureRow key={i} icon={f.icon} title={f.title} text={f.text} />)}
            </div>

            {/* Stats */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32
            }}>
              {[
                { label: "Hands Analyzed", value: "200M+" },
                { label: "Player Profits", value: "$5.5M+" },
                { label: "Bots Tracked", value: "198K+" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "rgba(167,138,67,0.04)", border: `1px solid ${BORDER}`,
                  borderRadius: 10, padding: "14px 12px", textAlign: "center"
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: GOLD }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ marginTop: "auto" }}>
              <a
                href="https://nachospoker.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  background: "transparent", color: GOLD, border: `2px solid ${GOLD}`,
                  padding: "20px 32px", borderRadius: 12, fontWeight: 700, fontSize: 16,
                  textDecoration: "none", cursor: "pointer", width: "100%",
                  transition: "transform 0.15s ease, background 0.15s ease, color 0.15s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "#0a0a0a"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = GOLD; }}
              >
                Apply to NachosPoker <ArrowRight size={18} />
              </a>
              <p style={{ fontSize: 12, color: TEXT_DIM, textAlign: "center", marginTop: 10 }}>Free application — spots are limited</p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section style={{ maxWidth: 1300, margin: "0 auto", padding: "0 32px 60px" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: TEXT, marginBottom: 8 }}>
              Players Who <span style={{ color: GOLD }}>Transformed</span> Their Game
            </h2>
            <p style={{ fontSize: 14, color: TEXT_SUB }}>Results from both private coaching and the CFP program</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {testimonials.map((t, i) => <TestimonialCard key={i} t={t} />)}
          </div>
        </section>

        {/* Comparison Table */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px 60px" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: TEXT, textAlign: "center", marginBottom: 24 }}>
            Quick Comparison
          </h2>
          <div style={{
            background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
            overflow: "hidden", backdropFilter: "blur(10px)"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <th style={{ padding: "16px 20px", textAlign: "left", color: TEXT_DIM, fontWeight: 600 }}></th>
                  <th style={{ padding: "16px 20px", textAlign: "center", color: GOLD, fontWeight: 700 }}>Private Coaching</th>
                  <th style={{ padding: "16px 20px", textAlign: "center", color: TEXT, fontWeight: 700 }}>Coaching For Profits</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1-on-1 with Patrick", "Every session", "Available at Gold tier"],
                  ["Personalized study plan", "Yes, quarterly", "General curriculum"],
                  ["Database review", "Full deep-dive", "Stat checker tool"],
                  ["Video library", "Strategy Vault", "400+ hours"],
                  ["Community access", "Lifetime Discord", "Full Discord + groups"],
                  ["Backing / staking", "No", "Yes — you play, we invest"],
                  ["Bot counter-strategies", "Discussed in sessions", "Full bot-warfare system"],
                  ["Pool-specific data", "Via sessions", "Complete data sets"],
                  ["Investment", "From €2,499", "Profit-share model"],
                ].map(([feature, priv, cfp], i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td style={{ padding: "12px 20px", color: TEXT_SUB }}>{feature}</td>
                    <td style={{ padding: "12px 20px", textAlign: "center", color: TEXT }}>{priv}</td>
                    <td style={{ padding: "12px 20px", textAlign: "center", color: TEXT }}>{cfp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px 60px" }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: TEXT, textAlign: "center", marginBottom: 24 }}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12,
                marginBottom: 10, overflow: "hidden", cursor: "pointer",
              }}
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
              >
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "18px 22px",
                }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>{faq.q}</span>
                  <ChevronDown size={18} color={TEXT_DIM} style={{
                    transform: expandedFaq === i ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s ease"
                  }} />
                </div>
                {expandedFaq === i && (
                  <div style={{ padding: "0 22px 18px" }}>
                    <p style={{ fontSize: 14, color: TEXT_SUB, lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px 80px", textAlign: "center" }}>
          <div style={{
            background: BG_CARD, border: `1px solid ${BORDER_GOLD}`, borderRadius: 20,
            padding: "48px 40px", backdropFilter: "blur(10px)", position: "relative"
          }}>
            <div style={{
              position: "absolute", top: -1, left: 60, right: 60, height: 2,
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, borderRadius: 2
            }} />
            <h2 style={{ fontSize: 26, fontWeight: 800, color: TEXT, marginBottom: 12 }}>
              Ready to Stop Leaving Money on the Table?
            </h2>
            <p style={{ fontSize: 15, color: TEXT_SUB, lineHeight: 1.7, marginBottom: 32, maxWidth: 550, margin: "0 auto 32px" }}>
              Whether you choose private coaching or the CFP, the goal is the same: help you become the strongest version of yourself at the table.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a
                href="https://freenachos.poker"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: GOLD, color: "#0a0a0a",
                  padding: "16px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                  textDecoration: "none", boxShadow: "0 4px 30px rgba(167,138,67,0.35)",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Private Coaching <ArrowRight size={16} />
              </a>
              <a
                href="https://nachospoker.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "transparent", color: GOLD, border: `2px solid ${GOLD}`,
                  padding: "16px 28px", borderRadius: 10, fontWeight: 700, fontSize: 14,
                  textDecoration: "none",
                  transition: "transform 0.15s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Apply to CFP <ArrowRight size={16} />
              </a>
            </div>
            <p style={{ fontSize: 13, color: TEXT_DIM, marginTop: 20, fontStyle: "italic" }}>
              "I only take on players I genuinely believe I can help." — Patrick
            </p>
          </div>
        </section>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .coaching-columns {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}
