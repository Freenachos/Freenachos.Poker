"use client";

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NachosPokerNavBar from '@/components/NachosPokerNavBar';
import Footer from '@/components/Footer';
import { ArrowRight, Check } from 'lucide-react';
import { track } from '@vercel/analytics';
import { FIT } from '@/lib/offer';
import { RIO_COURSE_URL, COURSE, cfpUrl } from '@/lib/links';

/**
 * /apply — the application form (P2.1). Questions in the exact order from the
 * build plan. No public booking link anywhere: the fit-call invite is sent
 * personally after review (see lib/links.js).
 */

const GOLD = '#A78A43';
const SITES = ['GGPoker', 'PokerStars', 'WPN', 'Winamax', 'iPoker', 'Ignition/Bovada', 'Other'];
const STAKES = ['50NL', '100NL', '200NL', '500NL', '1KNL', '2KNL+', 'Live'];
const VOLUMES = ['<20k', '20–50k', '50–100k', '100k+'];
const BANKROLLS = [
  { value: 'own', label: 'My own bankroll' },
  { value: 'staked', label: 'Staked / CFP' },
  { value: 'mixed', label: 'Mixed' }
];
const INVESTMENT = ['Yes', 'Yes, with installments', 'No'];
const CFP_INTEREST = ['Yes', 'No', 'Not sure'];

const labelStyle = {
  display: 'block',
  color: '#F0F0F0',
  fontSize: '15px',
  fontWeight: '600',
  lineHeight: 1.6,
  marginBottom: '12px'
};

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '12px',
  border: '1px solid rgba(167, 138, 67, 0.3)',
  background: 'rgba(18, 18, 18, 0.6)',
  color: '#F0F0F0',
  fontSize: '15px',
  outline: 'none',
  fontFamily: 'inherit'
};

const numberBadge = (n) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: 'rgba(167, 138, 67, 0.15)',
    border: '1px solid rgba(167, 138, 67, 0.35)',
    color: GOLD,
    fontSize: '13px',
    fontWeight: '700',
    marginRight: '10px',
    flexShrink: 0
  }}>
    {n}
  </span>
);

const PillGroup = ({ options, value, onChange, name }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
    {options.map((opt) => {
      const optValue = typeof opt === 'string' ? opt : opt.value;
      const optLabel = typeof opt === 'string' ? opt : opt.label;
      const selected = value === optValue;
      return (
        <button
          key={optValue}
          type="button"
          aria-pressed={selected}
          onClick={() => onChange(optValue)}
          style={{
            padding: '11px 18px',
            borderRadius: '10px',
            border: selected ? `1.5px solid ${GOLD}` : '1px solid rgba(255, 255, 255, 0.15)',
            background: selected ? 'rgba(167, 138, 67, 0.15)' : 'rgba(18, 18, 18, 0.5)',
            color: selected ? GOLD : 'rgba(240, 240, 240, 0.7)',
            fontSize: '14px',
            fontWeight: selected ? '700' : '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {optLabel}
        </button>
      );
    })}
  </div>
);

function ApplyForm() {
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent') === 'audit' ? 'audit' : 'program';

  const [form, setForm] = useState({
    site: '',
    stake: '',
    volume_bucket: '',
    db_summary: '',
    no_database: false,
    bankroll: '',
    staked_until: '',
    study_process: '',
    goal_12mo: '',
    biggest_obstacle: '',
    investment_viable: '',
    cfp_interest: '',
    name: '',
    email: '',
    discord: '',
    website: '' // honeypot — humans never see or fill this
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const mountedAtRef = useRef(Date.now());

  useEffect(() => {
    mountedAtRef.current = Date.now();
  }, []);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const missing = () => {
    if (!form.site) return 'Where do you play? (question 1)';
    if (!form.stake) return 'Your main stake (question 1)';
    if (!form.volume_bucket) return 'Your monthly volume (question 2)';
    if (!form.no_database && !form.db_summary.trim()) return 'Your database summary, or tick the checkbox (question 3)';
    if (!form.bankroll) return 'Your bankroll situation (question 4)';
    if (form.bankroll === 'staked' && !form.staked_until.trim()) return 'Your staking contract end date (question 4)';
    if (!form.study_process.trim()) return 'Your study process (question 5)';
    if (!form.goal_12mo.trim()) return 'Where you want to be in 12 months (question 6)';
    if (!form.biggest_obstacle.trim()) return 'Your biggest obstacle (question 7)';
    if (!form.investment_viable) return 'Whether the investment is viable (question 8)';
    if (!form.cfp_interest) return 'Whether you are interested in the CFP (question 9)';
    if (!form.name.trim()) return 'Your name (question 10)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'A valid email (question 10)';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;
    const miss = missing();
    if (miss) {
      setErrorMsg(`Still needed: ${miss}`);
      return;
    }
    setErrorMsg('');
    setStatus('submitting');

    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach((k) => {
      const v = searchParams.get(k);
      if (v) utm[k] = v;
    });

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          intent,
          source_utm: Object.keys(utm).length ? utm : null,
          elapsed_ms: Date.now() - mountedAtRef.current
        })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong submitting the application.');
      }
      setStatus('success');
      track('application_submitted', { stake: form.stake, volume: form.volume_bucket });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="glass-card" style={{
        maxWidth: '640px',
        margin: '0 auto',
        borderRadius: '24px',
        padding: '56px 44px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(167, 138, 67, 0.15)',
          border: `1.5px solid ${GOLD}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px'
        }}>
          <Check size={26} color={GOLD} />
        </div>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: '#FFFFFF',
          marginBottom: '18px',
          fontFamily: 'Manrope, Inter, sans-serif'
        }}>
          Application received.
        </h2>
        <p style={{
          color: 'rgba(240, 240, 240, 0.7)',
          fontSize: '15.5px',
          lineHeight: 1.85
        }}>
          I read every application myself. You&apos;ll hear from me within 48 hours. If it looks like a fit, you&apos;ll get a booking link for a short fit call. If not, I&apos;ll tell you why and point you somewhere better, usually the course or the CFP.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '680px', margin: '0 auto' }}>
      {intent === 'audit' && (
        <div style={{
          marginBottom: '28px',
          padding: '14px 18px',
          borderRadius: '12px',
          background: 'rgba(167, 138, 67, 0.08)',
          border: '1px solid rgba(167, 138, 67, 0.3)',
          color: 'rgba(240, 240, 240, 0.75)',
          fontSize: '14px',
          lineHeight: 1.7
        }}>
          You&apos;re requesting the standalone <span style={{ color: GOLD, fontWeight: 600 }}>Database Audit</span>. Same application. I&apos;ll treat it as an audit request when I review it.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* 1 — site + stake */}
        <div>
          <label style={labelStyle}>{numberBadge(1)}Where do you play, and what&apos;s your main stake?</label>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <select
              value={form.site}
              onChange={(e) => set('site')(e.target.value)}
              style={{ ...inputStyle, flex: '1 1 220px', cursor: 'pointer' }}
            >
              <option value="" disabled>Site / network…</option>
              {SITES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={form.stake}
              onChange={(e) => set('stake')(e.target.value)}
              style={{ ...inputStyle, flex: '1 1 180px', cursor: 'pointer' }}
            >
              <option value="" disabled>Main stake…</option>
              {STAKES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* 2 — volume */}
        <div>
          <label style={labelStyle}>{numberBadge(2)}Monthly volume, in hands?</label>
          <PillGroup options={VOLUMES} value={form.volume_bucket} onChange={set('volume_bucket')} />
        </div>

        {/* 3 — database */}
        <div>
          <label style={labelStyle}>{numberBadge(3)}What does your database say? Sample size and winrate (bb/100) over your last 12 months.</label>
          <textarea
            value={form.db_summary}
            onChange={(e) => set('db_summary')(e.target.value)}
            disabled={form.no_database}
            rows={3}
            placeholder="e.g. 180k hands at NL200, 1.8bb/100, plus 60k at NL500 roughly breakeven"
            style={{ ...inputStyle, resize: 'vertical', opacity: form.no_database ? 0.45 : 1 }}
          />
          <label style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '12px',
            color: 'rgba(240, 240, 240, 0.6)',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={form.no_database}
              onChange={(e) => set('no_database')(e.target.checked)}
              style={{ accentColor: GOLD, width: '16px', height: '16px' }}
            />
            I don&apos;t track a database
          </label>
        </div>

        {/* 4 — bankroll */}
        <div>
          <label style={labelStyle}>{numberBadge(4)}Bankroll situation</label>
          <PillGroup options={BANKROLLS} value={form.bankroll} onChange={set('bankroll')} />
          {form.bankroll === 'staked' && (
            <input
              type="text"
              value={form.staked_until}
              onChange={(e) => set('staked_until')(e.target.value)}
              placeholder="When does your staking contract end?"
              style={{ ...inputStyle, marginTop: '14px' }}
            />
          )}
        </div>

        {/* 5 — study process */}
        <div>
          <label style={labelStyle}>{numberBadge(5)}What does your current study process look like in a normal week?</label>
          <textarea
            value={form.study_process}
            onChange={(e) => set('study_process')(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* 6 — 12-month goal */}
        <div>
          <label style={labelStyle}>{numberBadge(6)}Where do you want your game to be in 12 months, in concrete terms?</label>
          <textarea
            value={form.goal_12mo}
            onChange={(e) => set('goal_12mo')(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* 7 — biggest obstacle */}
        <div>
          <label style={labelStyle}>{numberBadge(7)}What do you believe is the single biggest thing holding your winrate back right now?</label>
          <textarea
            value={form.biggest_obstacle}
            onChange={(e) => set('biggest_obstacle')(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {/* 8 — investment viability */}
        <div>
          <label style={labelStyle}>{numberBadge(8)}The mentorship is a 6-month program with a four-figure investment, paid from your own funds. Is that viable for you right now?</label>
          <PillGroup options={INVESTMENT} value={form.investment_viable} onChange={set('investment_viable')} />
        </div>

        {/* 9 — CFP interest */}
        <div>
          <label style={labelStyle}>{numberBadge(9)}Are you also interested in staking/CFP instead of paying for coaching?</label>
          <PillGroup options={CFP_INTEREST} value={form.cfp_interest} onChange={set('cfp_interest')} />
        </div>

        {/* 10 — contact */}
        <div>
          <label style={labelStyle}>{numberBadge(10)}Name, email, Discord handle.</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name')(e.target.value)}
              placeholder="Name"
              style={inputStyle}
              autoComplete="name"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email')(e.target.value)}
              placeholder="Email"
              style={inputStyle}
              autoComplete="email"
            />
            <input
              type="text"
              value={form.discord}
              onChange={(e) => set('discord')(e.target.value)}
              placeholder="Discord handle (optional)"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Honeypot — hidden from humans, tabIndex removed */}
        <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
          <label>
            Your website
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => set('website')(e.target.value)}
            />
          </label>
        </div>

        {/* Routing note (P2.4) — informational only, never blocks submission */}
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: 'rgba(240, 240, 240, 0.55)',
          fontSize: '13.5px',
          lineHeight: 1.8
        }}>
          Below {FIT.stakesFloor} or no database yet? The honest answer is{' '}
          <a
            href={RIO_COURSE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('outbound', { target: 'rio_course_apply' })}
            style={{ color: GOLD, textDecoration: 'none', borderBottom: '1px solid rgba(167, 138, 67, 0.4)' }}
          >
            the {COURSE.priceFormatted} course
          </a>{' '}
          first: most of the theory at a tenth of the price. Want backing instead of paying flat? That&apos;s{' '}
          <a
            href={cfpUrl('apply_page')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('outbound', { target: 'cfp_apply' })}
            style={{ color: GOLD, textDecoration: 'none', borderBottom: '1px solid rgba(167, 138, 67, 0.4)' }}
          >
            the CFP
          </a>.
        </div>

        {errorMsg && (
          <div style={{
            padding: '14px 18px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#f2b8b5',
            fontSize: '14px',
            lineHeight: 1.6
          }}>
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-hover cta-primary"
          style={{
            background: GOLD,
            color: '#0a0a0a',
            padding: '18px 40px',
            borderRadius: '14px',
            fontWeight: '700',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 4px 30px rgba(167, 138, 67, 0.4)',
            opacity: status === 'submitting' ? 0.7 : 1
          }}
        >
          {status === 'submitting' ? 'Submitting…' : 'Submit application'} <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}

export default function ApplyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0E1A',
      position: 'relative',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        .glass-card {
          background: rgba(18, 18, 18, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(167, 138, 67, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .btn-hover {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease;
        }
        .btn-hover:hover:not(:disabled) { transform: translateY(-3px); }
        .btn-hover:active:not(:disabled) { transform: translateY(-1px); }
        select option { background: #12121a; color: #F0F0F0; }
      `}</style>

      <NachosPokerNavBar />

      {/* Ambient glow */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        right: '-8%',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167, 138, 67, 0.07) 0%, transparent 60%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '60px 24px 120px'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 56px' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 4.5vw, 48px)',
            fontWeight: '800',
            color: '#FFFFFF',
            marginBottom: '20px',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            fontFamily: 'Manrope, Inter, sans-serif'
          }}>
            Apply for <span style={{ color: GOLD, textShadow: '0 0 60px rgba(167, 138, 67, 0.4)' }}>the Program</span>
          </h1>
          <p style={{
            color: 'rgba(240, 240, 240, 0.65)',
            fontSize: '16px',
            lineHeight: 1.85
          }}>
            This takes ~4 minutes. I read every application myself and reply within 48 hours. I take a small number of mentees per quarter, so the honest answer helps us both.
          </p>
        </div>

        <Suspense fallback={null}>
          <ApplyForm />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
