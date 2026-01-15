'use client';

import NachosPokerNavBar from '@/components/NachosPokerNavBar';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ExternalLink, 
  Fish, 
  ChevronLeft, 
  Clock, 
  User, 
  Tag, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  BookOpen, 
  TrendingUp, 
  Lightbulb, 
  Code, 
  BarChart3, 
  Quote, 
  Type, 
  List, 
  FileImage,
  Terminal,
  Zap,
  ChevronDown,
  ChevronUp,
  GripVertical,
  X,
  Settings,
  FileText,
  LogIn,
  LogOut,
  Loader,
  AlertTriangle,
  Globe,
  EyeOff,
  Image
} from 'lucide-react';
import { articlesApi, authApi } from '@/lib/supabaseClient';

/**
 * FreeNachos Articles Page
 * Full Supabase integration with authentication and CRUD
 */

const CATEGORIES = ['All', 'Strategy', 'Analysis', 'Fundamentals', 'Mindset', 'Tools'];

const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const transformArticle = (dbArticle) => ({
  id: dbArticle.id,
  title: dbArticle.title,
  slug: dbArticle.slug,
  category: dbArticle.category,
  excerpt: dbArticle.excerpt || '',
  readTime: dbArticle.read_time,
  thumbnail: dbArticle.thumbnail,
  thumbnailUrl: dbArticle.thumbnail_url,
  blocks: dbArticle.blocks || [],
  published: dbArticle.published,
  createdAt: dbArticle.created_at,
  updatedAt: dbArticle.updated_at
});

export default function FreeNachosArticles() {
  const [view, setView] = useState('library');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editorArticle, setEditorArticle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  const [nachos, setNachos] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const nachoRef = useRef(null);

  // Auth Effects
  useEffect(() => {
    authApi.getSession().then(session => setUser(session?.user || null));
    const { data: { subscription } } = authApi.onAuthStateChange((event, session) => setUser(session?.user || null));
    return () => subscription.unsubscribe();
  }, []);

  // Data Fetching
  useEffect(() => { fetchArticles(); }, [user]);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = user ? await articlesApi.getAll() : await articlesApi.getPublished();
      setArticles(data.map(transformArticle));
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  // Auth Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      await authApi.signIn(loginEmail, loginPassword);
      setShowLogin(false);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      setView('library');
      setEditorArticle(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // CRUD Handlers
  const openArticle = (article) => { setSelectedArticle(article); setView('reader'); };

  const openEditor = (article = null) => {
    if (article) {
      setEditorArticle({ ...article });
      setIsEditing(true);
    } else {
      setEditorArticle({ id: null, title: '', slug: '', category: 'Strategy', excerpt: '', readTime: '5 min', thumbnail: 'default', thumbnailUrl: '', blocks: [], published: false });
      setIsEditing(false);
    }
    setView('editor');
  };

  const saveArticle = async (publish = null) => {
    if (!editorArticle.title) return;
    setSaving(true);
    setError(null);
    try {
      const slug = editorArticle.slug || generateSlug(editorArticle.title);
      const articleData = { ...editorArticle, slug, published: publish !== null ? publish : editorArticle.published };
      if (isEditing && editorArticle.id) { await articlesApi.update(editorArticle.id, articleData); }
      else { await articlesApi.create(articleData); }
      await fetchArticles();
      setView('library');
      setEditorArticle(null);
    } catch (err) {
      console.error('Error saving article:', err);
      setError(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (articleId) => {
    setDeleting(true);
    try {
      await articlesApi.delete(articleId);
      await fetchArticles();
      setShowDeleteConfirm(null);
      if (view === 'reader') { setView('library'); setSelectedArticle(null); }
    } catch (err) {
      console.error('Error deleting article:', err);
      setError('Failed to delete article');
    } finally {
      setDeleting(false);
    }
  };

// Nacho Animation
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!showLogin) setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [showLogin]);

  const getEyeOffset = () => {
    if (!nachoRef.current) return { x: 0, y: 0 };
    const rect = nachoRef.current.getBoundingClientRect();
    const nachoCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const angle = Math.atan2(mousePos.y - nachoCenter.y, mousePos.x - nachoCenter.x);
    const distance = Math.min(3, Math.hypot(mousePos.x - nachoCenter.x, mousePos.y - nachoCenter.y) / 50);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  useEffect(() => {
    const newNachos = Array.from({ length: 54 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100, size: 12 + Math.random() * 28,
      duration: 40 + Math.random() * 20, delay: Math.random() * 20,
      opacity: 0.4 + Math.random() * 0.5, moveX: Math.random() * 200 - 100, moveY: Math.random() * 200 - 100
    }));
    setNachos(newNachos);
  }, []);

  const eyeOffset = getEyeOffset();
  
  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  // Components
  const CartoonNacho = () => (
    <svg ref={nachoRef} width="90" height="90" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 4px 12px rgba(255, 179, 71, 0.4))' }}>
      <path d="M50 8 L88 85 Q90 92 82 92 L18 92 Q10 92 12 85 Z" fill="#FFB347" stroke="#E09A30" strokeWidth="2"/>
      <path d="M25 70 Q20 75 22 82 Q24 88 28 85 Q30 80 28 75 Z" fill="#FFD54F" opacity="0.9"/>
      <path d="M72 65 Q78 72 76 80 Q74 86 70 82 Q68 76 70 70 Z" fill="#FFD54F" opacity="0.9"/>
      <path d="M48 75 Q45 82 48 88 Q52 92 55 86 Q56 80 52 76 Z" fill="#FFD54F" opacity="0.9"/>
      <ellipse cx="50" cy="50" rx="22" ry="18" fill="#FFB347" />
      <ellipse cx="40" cy="48" rx="8" ry="9" fill="white" />
      <ellipse cx="60" cy="48" rx="8" ry="9" fill="white" />
      <circle cx={40 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#1a1a1a" style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}/>
      <circle cx={60 + eyeOffset.x} cy={48 + eyeOffset.y} r="4" fill="#1a1a1a" style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}/>
      <circle cx={38 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <circle cx={58 + eyeOffset.x * 0.5} cy={46 + eyeOffset.y * 0.5} r="1.5" fill="white" opacity="0.8" />
      <path d="M38 62 Q50 72 62 62" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M33 38 Q40 35 47 38" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <path d="M53 38 Q60 35 67 38" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      <circle cx="30" cy="30" r="2" fill="#E09A30" opacity="0.5" />
      <circle cx="70" cy="35" r="2.5" fill="#E09A30" opacity="0.5" />
      <circle cx="35" cy="80" r="2" fill="#E09A30" opacity="0.5" />
      <circle cx="65" cy="78" r="1.5" fill="#E09A30" opacity="0.5" />
    </svg>
  );

  const NachoTriangle = ({ size, opacity }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ opacity }}>
      <path d="M10 2 L18 17 L2 17 Z" fill="#FFB347" opacity="0.8"/>
    </svg>
  );

  const LoginModal = () => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-card" style={{ borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', margin: '20px', border: '1px solid rgba(255, 179, 71, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={20} color="#FFB347" />
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Admin Login</h2>
          </div>
          <button onClick={() => setShowLogin(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
            <X size={18} color="rgba(255,255,255,0.6)" />
          </button>
        </div>
        <form onSubmit={handleLogin}>
          {loginError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} color="#ef4444" />
              <span style={{ color: '#ef4444', fontSize: '13px' }}>{loginError}</span>
            </div>
          )}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
            <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }} />
          </div>
          <button type="submit" disabled={loginLoading} style={{ width: '100%', background: loginLoading ? 'rgba(255, 179, 71, 0.5)' : '#FFB347', border: 'none', borderRadius: '8px', padding: '14px', color: '#0a0a0a', fontSize: '14px', fontWeight: '600', cursor: loginLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loginLoading ? (<><Loader size={16} className="spin" />Signing in...</>) : (<><LogIn size={16} />Sign In</>)}
          </button>
        </form>
      </div>
    </div>
  );

  const DeleteConfirmModal = ({ article }) => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="glass-card" style={{ borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '450px', margin: '20px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={24} color="#ef4444" /></div>
          <div><h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Delete Article?</h2><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '4px 0 0' }}>This action cannot be undone</p></div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}><p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '14px' }}>"{article.title}"</p></div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => deleteArticle(article.id)} disabled={deleting} style={{ flex: 1, background: deleting ? 'rgba(239, 68, 68, 0.5)' : '#ef4444', border: 'none', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: deleting ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {deleting ? (<><Loader size={14} className="spin" />Deleting...</>) : (<><Trash2 size={14} />Delete</>)}
          </button>
        </div>
      </div>
    </div>
  );

  const ArticleRenderer = ({ article }) => {
    if (!article) return null;
    const renderBlock = (block, index) => {
      switch (block.type) {
        case 'header':
          const HeaderTag = block.level === 1 ? 'h1' : block.level === 2 ? 'h2' : 'h3';
          const headerStyles = { 1: { fontSize: '2.2em', fontWeight: '800', marginBottom: '24px', marginTop: index === 0 ? 0 : '48px' }, 2: { fontSize: '1.5em', fontWeight: '700', marginBottom: '16px', marginTop: '40px' }, 3: { fontSize: '1.2em', fontWeight: '600', marginBottom: '12px', marginTop: '32px' } };
          return <HeaderTag key={index} style={{ color: '#ffffff', lineHeight: 1.2, ...headerStyles[block.level] }}>{block.content}</HeaderTag>;
        case 'paragraph':
          return <p key={index} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', lineHeight: 1.8, marginBottom: '20px' }}>{block.content}</p>;
        case 'callout':
          const calloutStyles = { insight: { bg: 'rgba(255, 179, 71, 0.15)', border: 'rgba(255, 179, 71, 0.3)', icon: Lightbulb, iconColor: '#FFB347' }, warning: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', icon: Zap, iconColor: '#ef4444' }, stat: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', icon: TrendingUp, iconColor: '#22c55e' }, tip: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', icon: BookOpen, iconColor: '#60a5fa' } };
          const style = calloutStyles[block.variant] || calloutStyles.insight;
          const IconComponent = style.icon;
          return (<div key={index} style={{ background: style.bg, border: `1px solid ${style.border}`, borderRadius: '12px', padding: '24px', marginBottom: '24px', marginTop: '24px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><IconComponent size={20} color={style.iconColor} /><span style={{ color: style.iconColor, fontWeight: '600', fontSize: '14px' }}>{block.title}</span></div><p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>{block.content}</p></div>);
        case 'list':
          return (<ul key={index} style={{ marginBottom: '24px', paddingLeft: '8px', listStyle: 'none' }}>{block.items.map((item, i) => (<li key={i} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.8, marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}><span style={{ color: '#FFB347', fontSize: '18px', lineHeight: 1.4 }}>▸</span><span>{item}</span></li>))}</ul>);
        case 'code':
          return (<div key={index} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', marginTop: '24px', border: '1px solid rgba(255,255,255,0.1)' }}><div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}><Code size={14} color="#FFB347" /><span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '500' }}>{block.title || block.language}</span></div><pre style={{ margin: 0, padding: '20px', overflow: 'auto', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}><code>{block.content}</code></pre></div>);
        case 'data-viz':
          return (<div key={index} className="glass-card" style={{ borderRadius: '12px', padding: '24px', marginBottom: '24px', marginTop: '24px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><BarChart3 size={18} color="#FFB347" /><span style={{ color: '#FFB347', fontWeight: '600', fontSize: '14px' }}>{block.title}</span></div><div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{block.data.labels.map((label, i) => { const value = block.data.values[i]; const maxValue = Math.max(...block.data.values.map(Math.abs)); const percentage = (Math.abs(value) / maxValue) * 100; const isPositive = value >= 0; return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ width: '70px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '500' }}>{label}</span><div style={{ flex: 1, height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${percentage}%`, height: '100%', background: isPositive ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.6), rgba(34, 197, 94, 0.9))' : 'linear-gradient(90deg, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.9))', borderRadius: '6px', transition: 'width 0.5s ease-out' }} /></div><span style={{ width: '70px', textAlign: 'right', color: isPositive ? '#22c55e' : '#ef4444', fontSize: '14px', fontWeight: '600' }}>{isPositive ? '+' : ''}{value.toFixed(1)}</span></div>); })}</div></div>);
        case 'quote':
          return (<blockquote key={index} style={{ borderLeft: '4px solid #FFB347', margin: '32px 0', padding: '20px 24px', background: 'rgba(255, 179, 71, 0.08)', borderRadius: '0 12px 12px 0' }}><Quote size={24} color="#FFB347" style={{ marginBottom: '12px', opacity: 0.6 }} /><p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>{block.content}</p>{block.attribution && (<cite style={{ display: 'block', marginTop: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontStyle: 'normal' }}>— {block.attribution}</cite>)}</blockquote>);
        case 'image':
          return (<figure key={index} style={{ margin: '32px 0', textAlign: 'center' }}>{block.src ? (<img src={block.src} alt={block.alt || ''} style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />) : (<div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}><FileImage size={48} color="rgba(255,255,255,0.3)" /><span style={{ marginLeft: '12px', color: 'rgba(255,255,255,0.4)' }}>[Image: {block.alt || 'Image'}]</span></div>)}{block.caption && <figcaption style={{ marginTop: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{block.caption}</figcaption>}</figure>);
        default: return null;
      }
    };
    return (
      <article style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255, 179, 71, 0.2)', color: '#FFB347', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{article.category}</span>
          {!article.published && (<span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Draft</span>)}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}><User size={14} /><span>FreeNachos</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}><Clock size={14} /><span>{article.readTime}</span></div>
        </div>
        {article.blocks.map((block, index) => renderBlock(block, index))}
      </article>
    );
  };

  const ArticleCard = ({ article, onClick }) => {
    const thumbnailIcons = { 'poker-table': Fish, 'chart': BarChart3, 'stats': TrendingUp, 'default': FileText };
    const ThumbnailIcon = thumbnailIcons[article.thumbnail] || thumbnailIcons.default;
    const hasThumbnailImage = article.thumbnailUrl && article.thumbnailUrl.trim() !== '';
    
    return (
      <div className="card-hover glass-card article-card" onClick={() => onClick(article)} style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
        {!article.published && (<div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', zIndex: 2 }}>Draft</div>)}
        <div style={{ height: '140px', background: 'linear-gradient(135deg, rgba(255, 179, 71, 0.15) 0%, rgba(255, 179, 71, 0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          {hasThumbnailImage ? (
            <img src={article.thumbnailUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <ThumbnailIcon size={48} color="#FFB347" style={{ opacity: 0.6 }} />
          )}
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ background: 'rgba(255, 179, 71, 0.2)', color: '#FFB347', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{article.category}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={10} /> {article.readTime}</span>
          </div>
          <h3 style={{ color: '#ffffff', fontSize: '16px', fontWeight: '600', marginBottom: '10px', lineHeight: 1.4 }}>{article.title}</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.excerpt}</p>
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}</span>
            <span style={{ color: '#FFB347', fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>Read More →</span>
          </div>
        </div>
      </div>
    );
  };

  const ArticleEditor = () => {
    if (!editorArticle) return null;
    const addBlock = (type) => {
      const newBlock = { type };
      switch (type) {
        case 'header': newBlock.level = 2; newBlock.content = 'New Header'; break;
        case 'paragraph': newBlock.content = 'New paragraph text...'; break;
        case 'callout': newBlock.variant = 'insight'; newBlock.title = 'Key Insight'; newBlock.content = 'Important information here...'; break;
        case 'list': newBlock.items = ['Item 1', 'Item 2', 'Item 3']; break;
        case 'code': newBlock.language = 'javascript'; newBlock.title = 'Code Example'; newBlock.content = '// Your code here'; break;
        case 'data-viz': newBlock.vizType = 'bar'; newBlock.title = 'Data Visualization'; newBlock.data = { labels: ['A', 'B', 'C'], values: [10, 20, 30] }; break;
        case 'quote': newBlock.content = 'Quote text...'; newBlock.attribution = 'Author'; break;
        case 'image': newBlock.src = ''; newBlock.alt = 'Image description'; newBlock.caption = ''; break;
        default: break;
      }
      setEditorArticle({ ...editorArticle, blocks: [...editorArticle.blocks, newBlock] });
    };
    const updateBlock = (index, updates) => { const newBlocks = [...editorArticle.blocks]; newBlocks[index] = { ...newBlocks[index], ...updates }; setEditorArticle({ ...editorArticle, blocks: newBlocks }); };
    const removeBlock = (index) => { setEditorArticle({ ...editorArticle, blocks: editorArticle.blocks.filter((_, i) => i !== index) }); };
    const moveBlock = (index, direction) => { const newBlocks = [...editorArticle.blocks]; const newIndex = index + direction; if (newIndex < 0 || newIndex >= newBlocks.length) return; [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]]; setEditorArticle({ ...editorArticle, blocks: newBlocks }); };

    const BlockEditor = ({ block, index }) => {
      const blockTypeIcons = { header: Type, paragraph: FileText, callout: Lightbulb, list: List, code: Code, 'data-viz': BarChart3, quote: Quote, image: FileImage };
      const BlockIcon = blockTypeIcons[block.type] || FileText;
      return (
        <div className="glass-card" style={{ borderRadius: '12px', marginBottom: '16px', overflow: 'hidden', border: '1px solid rgba(255, 179, 71, 0.2)' }}>
          <div style={{ background: 'rgba(255, 179, 71, 0.1)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><GripVertical size={16} color="rgba(255,255,255,0.4)" /><BlockIcon size={16} color="#FFB347" /><span style={{ color: '#FFB347', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{block.type}</span></div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => moveBlock(index, -1)} disabled={index === 0} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}><ChevronUp size={14} color="rgba(255,255,255,0.7)" /></button>
              <button onClick={() => moveBlock(index, 1)} disabled={index === editorArticle.blocks.length - 1} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: index === editorArticle.blocks.length - 1 ? 'not-allowed' : 'pointer', opacity: index === editorArticle.blocks.length - 1 ? 0.3 : 1 }}><ChevronDown size={14} color="rgba(255,255,255,0.7)" /></button>
              <button onClick={() => removeBlock(index)} style={{ background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}><Trash2 size={14} color="#ef4444" /></button>
            </div>
          </div>
          <div style={{ padding: '16px' }}>
            {block.type === 'header' && (<><div style={{ marginBottom: '12px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Level</label><select value={block.level} onChange={(e) => updateBlock(index, { level: parseInt(e.target.value) })} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', width: '100px' }}><option value={1}>H1</option><option value={2}>H2</option><option value={3}>H3</option></select></div><input type="text" value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })} placeholder="Header text..." style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none' }} /></>)}
            {block.type === 'paragraph' && (<textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })} placeholder="Paragraph text..." rows={4} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', color: '#fff', fontSize: '14px', resize: 'vertical', lineHeight: 1.6, outline: 'none' }} />)}
            {block.type === 'callout' && (<><div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}><div style={{ flex: 1 }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Variant</label><select value={block.variant} onChange={(e) => updateBlock(index, { variant: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px' }}><option value="insight">Insight</option><option value="warning">Warning</option><option value="stat">Stat</option><option value="tip">Tip</option></select></div><div style={{ flex: 2 }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Title</label><input type="text" value={block.title} onChange={(e) => updateBlock(index, { title: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }} /></div></div><textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })} rows={3} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', color: '#fff', fontSize: '14px', resize: 'vertical', outline: 'none' }} /></>)}
            {block.type === 'list' && (<><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Items (one per line)</label><textarea value={block.items.join('\n')} onChange={(e) => updateBlock(index, { items: e.target.value.split('\n') })} rows={4} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', color: '#fff', fontSize: '14px', resize: 'vertical', fontFamily: 'monospace', outline: 'none' }} /></>)}
            {block.type === 'code' && (<><div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}><div style={{ flex: 1 }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Language</label><input type="text" value={block.language} onChange={(e) => updateBlock(index, { language: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }} /></div><div style={{ flex: 2 }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Title</label><input type="text" value={block.title || ''} onChange={(e) => updateBlock(index, { title: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }} /></div></div><textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })} rows={6} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', color: '#fff', fontSize: '13px', resize: 'vertical', fontFamily: 'monospace', outline: 'none' }} /></>)}
            {block.type === 'data-viz' && (<><input type="text" value={block.title} onChange={(e) => updateBlock(index, { title: e.target.value })} placeholder="Chart title..." style={{ width: '100%', marginBottom: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none' }} /><div style={{ display: 'flex', gap: '12px' }}><div style={{ flex: 1 }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Labels (comma-separated)</label><input type="text" value={block.data.labels.join(', ')} onChange={(e) => updateBlock(index, { data: { ...block.data, labels: e.target.value.split(',').map(s => s.trim()) } })} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }} /></div><div style={{ flex: 1 }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Values (comma-separated)</label><input type="text" value={block.data.values.join(', ')} onChange={(e) => updateBlock(index, { data: { ...block.data, values: e.target.value.split(',').map(s => parseFloat(s.trim()) || 0) } })} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }} /></div></div></>)}
            {block.type === 'quote' && (<><textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })} rows={3} style={{ width: '100%', marginBottom: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '10px 14px', color: '#fff', fontSize: '14px', resize: 'vertical', fontStyle: 'italic', outline: 'none' }} /><input type="text" value={block.attribution || ''} onChange={(e) => updateBlock(index, { attribution: e.target.value })} placeholder="Attribution..." style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }} /></>)}
            {block.type === 'image' && (<><div style={{ marginBottom: '12px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Image URL</label><input type="text" value={block.src || ''} onChange={(e) => updateBlock(index, { src: e.target.value })} placeholder="https://..." style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }} /></div><div style={{ display: 'flex', gap: '12px' }}><div style={{ flex: 1 }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Alt Text</label><input type="text" value={block.alt || ''} onChange={(e) => updateBlock(index, { alt: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }} /></div><div style={{ flex: 1 }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px' }}>Caption</label><input type="text" value={block.caption || ''} onChange={(e) => updateBlock(index, { caption: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', outline: 'none' }} /></div></div></>)}
          </div>
        </div>
      );
    };

    return (
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
          <div className="glass-card" style={{ borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid rgba(255, 179, 71, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><Terminal size={18} color="#FFB347" /><h3 style={{ color: '#FFB347', fontSize: '14px', fontWeight: '600', margin: 0 }}>ARTICLE METADATA</h3></div>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Title</label><input type="text" value={editorArticle.title} onChange={(e) => setEditorArticle({ ...editorArticle, title: e.target.value })} placeholder="Article title..." style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '16px', fontWeight: '500', outline: 'none' }} /></div>
              <div><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Slug (URL path)</label><input type="text" value={editorArticle.slug} onChange={(e) => setEditorArticle({ ...editorArticle, slug: e.target.value })} placeholder={editorArticle.title ? generateSlug(editorArticle.title) : 'auto-generated'} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', fontFamily: 'monospace', outline: 'none' }} /></div>
              <div style={{ display: 'flex', gap: '16px' }}><div style={{ flex: 1 }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Category</label><select value={editorArticle.category} onChange={(e) => setEditorArticle({ ...editorArticle, category: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px' }}>{CATEGORIES.filter(c => c !== 'All').map(cat => (<option key={cat} value={cat}>{cat}</option>))}</select></div><div style={{ flex: 1 }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Read Time</label><input type="text" value={editorArticle.readTime} onChange={(e) => setEditorArticle({ ...editorArticle, readTime: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }} /></div></div>
              <div><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Excerpt</label><textarea value={editorArticle.excerpt} onChange={(e) => setEditorArticle({ ...editorArticle, excerpt: e.target.value })} rows={2} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', resize: 'vertical', outline: 'none' }} /></div>
              <div><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Thumbnail Image URL (optional)</label><input type="text" value={editorArticle.thumbnailUrl || ''} onChange={(e) => setEditorArticle({ ...editorArticle, thumbnailUrl: e.target.value })} placeholder="https://... (leave empty for icon)" style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }} /></div>
              <div><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Fallback Icon</label><select value={editorArticle.thumbnail} onChange={(e) => setEditorArticle({ ...editorArticle, thumbnail: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px' }}><option value="default">Default (Document)</option><option value="poker-table">Poker Table (Fish)</option><option value="chart">Chart</option><option value="stats">Stats (Trending)</option></select></div>
            </div>
          </div>
          <div className="glass-card" style={{ borderRadius: '12px', padding: '20px', marginBottom: '24px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}><Plus size={18} color="#22c55e" /><h3 style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600', margin: 0 }}>ADD CONTENT BLOCK</h3></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{[{ type: 'header', icon: Type, label: 'Header' }, { type: 'paragraph', icon: FileText, label: 'Paragraph' }, { type: 'callout', icon: Lightbulb, label: 'Callout' }, { type: 'list', icon: List, label: 'List' }, { type: 'code', icon: Code, label: 'Code' }, { type: 'data-viz', icon: BarChart3, label: 'Data Viz' }, { type: 'quote', icon: Quote, label: 'Quote' }, { type: 'image', icon: FileImage, label: 'Image' }].map(({ type, icon: Icon, label }) => (<button key={type} onClick={() => addBlock(type)} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '6px', padding: '8px 12px', color: '#22c55e', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}><Icon size={14} />{label}</button>))}</div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}><Settings size={18} color="rgba(255,255,255,0.5)" /><h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontWeight: '600', margin: 0 }}>CONTENT BLOCKS ({editorArticle.blocks.length})</h3></div>
            {editorArticle.blocks.length === 0 ? (<div className="glass-card" style={{ borderRadius: '12px', padding: '40px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.2)' }}><FileText size={32} color="rgba(255,255,255,0.3)" style={{ marginBottom: '12px' }} /><p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>No content blocks yet. Add blocks above.</p></div>) : (editorArticle.blocks.map((block, index) => (<BlockEditor key={index} block={block} index={index} />)))}
          </div>
        </div>
        <div style={{ flex: '1 1 400px', minWidth: '300px' }}>
          <div className="glass-card" style={{ borderRadius: '12px', padding: '24px', position: 'sticky', top: '20px', maxHeight: 'calc(100vh - 40px)', overflow: 'auto', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><Eye size={18} color="#60a5fa" /><h3 style={{ color: '#60a5fa', fontSize: '14px', fontWeight: '600', margin: 0 }}>LIVE PREVIEW</h3></div>
            {editorArticle.title || editorArticle.blocks.length > 0 ? (<ArticleRenderer article={editorArticle} />) : (<div style={{ textAlign: 'center', padding: '40px 0' }}><Eye size={32} color="rgba(255,255,255,0.2)" style={{ marginBottom: '12px' }} /><p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '14px' }}>Start adding content to see preview</p></div>)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{minHeight: '100vh', background: '#0a0a0a', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'}}>
      {showLogin && <LoginModal />}
      {showDeleteConfirm && <DeleteConfirmModal article={showDeleteConfirm} />}

      <div style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1}}>
        {nachos.map(nacho => (<div key={nacho.id} style={{ position: 'absolute', left: `${nacho.x}%`, top: `${nacho.y}%`, animation: `floatNacho ${nacho.duration}s ease-in-out infinite`, animationDelay: `${nacho.delay}s`, '--moveX': `${nacho.moveX}px`, '--moveY': `${nacho.moveY}px` }}><NachoTriangle size={nacho.size} opacity={nacho.opacity} /></div>))}
      </div>
      
      <style>{`
        @keyframes floatNacho { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(var(--moveX), var(--moveY)) rotate(180deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes traceBorder { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        .glass-card { background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        .btn-hover { transition: transform 0.2s ease; }
        .btn-hover:hover:not(:disabled) { transform: translateY(-2px); }
        .spark-border { position: relative; overflow: hidden; border-radius: 16px; background: #0a0a0a; }
        .spark-border::before { content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 2px; background: linear-gradient(135deg, rgba(255, 179, 71, 0.3), rgba(255, 179, 71, 0.1)); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; z-index: 1; pointer-events: none; }
        .spark-border::after { content: ""; position: absolute; top: 0; left: 0; width: 100px; height: 2px; background: linear-gradient(90deg, transparent 0%, #FFB347 50%, #FFB347 100%); box-shadow: 0 0 10px 1px rgba(255, 179, 71, 0.6); offset-path: rect(0 100% 100% 0 round 16px); animation: traceBorder 5s linear infinite; z-index: 2; pointer-events: none; }
        .filter-btn { padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; border: 1px solid rgba(255, 255, 255, 0.1); }
        .filter-btn.active { background: #FFB347; color: #0a0a0a; border-color: #FFB347; }
        .filter-btn:not(.active) { background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.6); }
        .filter-btn:not(.active):hover { background: rgba(255, 255, 255, 0.1); color: rgba(255, 255, 255, 0.8); }
        select option { background: #1a1a1a; color: #fff; }
      `}</style>

      <div style={{position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
        <NachosPokerNavBar />
        
        <div className="card-hover spark-border" style={{ marginBottom: '30px', padding: '28px 32px', animation: 'fadeInUp 0.6s ease-out', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0, animation: 'bounce 2s ease-in-out infinite' }}><CartoonNacho /></div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{fontSize: '12px', color: '#FFB347', fontWeight: '600', marginBottom: '6px', letterSpacing: '0.1em', textTransform: 'uppercase'}}>Crafted by FreeNachos</div>
            <h2 style={{fontSize: '22px', fontWeight: '700', color: '#ffffff', marginBottom: '8px', lineHeight: 1.2}}>
              {view === 'library' && 'Knowledge Hub'}
              {view === 'reader' && selectedArticle?.title}
              {view === 'editor' && (isEditing ? 'Edit Article' : 'New Article')}
            </h2>
            <p style={{fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '0', lineHeight: 1.5}}>
              {view === 'library' && 'Deep dives into poker strategy, analysis, and edge optimization.'}
              {view === 'reader' && selectedArticle?.excerpt}
              {view === 'editor' && 'Construct data-driven articles with precision.'}
            </p>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0}}>
            <a href="https://www.nachospoker.com/" target="_blank" rel="noopener noreferrer" className="btn-hover" style={{ background: '#FFB347', color: '#0a0a0a', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>Join Our CFP <ExternalLink size={14} /></a>
            <a href="https://www.freenachoscoaching.com/" target="_blank" rel="noopener noreferrer" className="btn-hover" style={{ background: 'transparent', border: '1px solid rgba(255, 179, 71, 0.5)', color: '#FFB347', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>Private Coaching <ExternalLink size={14} /></a>
          </div>
        </div>

        <div className="glass-card" style={{ borderRadius: '12px', padding: '16px 24px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {view !== 'library' && (<button onClick={() => { setView('library'); setSelectedArticle(null); setEditorArticle(null); }} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '10px 16px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}><ChevronLeft size={16} />Back to Library</button>)}
            {view === 'library' && (<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={18} color="#FFB347" /><span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500' }}>{loading ? 'Loading...' : `${filteredArticles.length} Article${filteredArticles.length !== 1 ? 's' : ''}`}</span></div>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user ? (<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{user.email}</span><button onClick={handleLogout} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px 12px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', cursor: 'pointer' }}><LogOut size={14} /></button></div>) : (<button onClick={() => setShowLogin(true)} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '10px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}><LogIn size={14} />Admin</button>)}
            {view === 'editor' && user && (<>
              <button onClick={() => { setView('library'); setEditorArticle(null); }} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 16px', color: '#ef4444', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}><X size={14} />Cancel</button>
              <button onClick={() => saveArticle(false)} disabled={!editorArticle?.title || saving} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '10px 16px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '500', cursor: !editorArticle?.title || saving ? 'not-allowed' : 'pointer', opacity: !editorArticle?.title ? 0.5 : 1 }}><EyeOff size={14} />Save Draft</button>
              <button onClick={() => saveArticle(true)} disabled={!editorArticle?.title || saving} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: !editorArticle?.title || saving ? 'rgba(34, 197, 94, 0.3)' : '#22c55e', border: 'none', borderRadius: '8px', padding: '10px 20px', color: !editorArticle?.title || saving ? 'rgba(255,255,255,0.4)' : '#0a0a0a', fontSize: '13px', fontWeight: '600', cursor: !editorArticle?.title || saving ? 'not-allowed' : 'pointer' }}>{saving ? (<><Loader size={14} className="spin" />Saving...</>) : (<><Globe size={14} />Publish</>)}</button>
            </>)}
            {view !== 'editor' && user && (<button onClick={() => openEditor()} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg, #FFB347 0%, #E09A30 100%)', border: 'none', borderRadius: '8px', padding: '10px 20px', color: '#0a0a0a', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 20px rgba(255, 179, 71, 0.3)' }}><Edit3 size={14} />New Article</button>)}
          </div>
        </div>

        {error && (<div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><AlertTriangle size={20} color="#ef4444" /><span style={{ color: '#ef4444', fontSize: '14px', flex: 1 }}>{error}</span><button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={16} color="#ef4444" /></button></div>)}

        {view === 'library' && (<>
          <div className="glass-card" style={{ borderRadius: '12px', padding: '20px 24px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Tag size={16} color="#FFB347" />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Categories:</span>
              {CATEGORIES.map(cat => (<button key={cat} className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`} onClick={() => setSelectedCategory(cat)}>{cat}</button>))}
            </div>
          </div>
          {loading ? (<div className="glass-card" style={{ borderRadius: '16px', padding: '60px 40px', textAlign: 'center' }}><Loader size={32} color="#FFB347" className="spin" style={{ marginBottom: '16px' }} /><p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Loading articles...</p></div>) : (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>{filteredArticles.map((article) => (<ArticleCard key={article.id} article={article} onClick={openArticle} />))}</div>)}
          {!loading && filteredArticles.length === 0 && (<div className="glass-card" style={{ borderRadius: '16px', padding: '60px 40px', textAlign: 'center' }}><BookOpen size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '16px' }} /><h3 style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>No Articles Found</h3><p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>{selectedCategory === 'All' ? 'No articles yet. Create your first one!' : `No articles in "${selectedCategory}" yet.`}</p></div>)}
        </>)}

        {view === 'reader' && selectedArticle && (
          <div className="glass-card" style={{ borderRadius: '16px', padding: '48px' }}>
            <ArticleRenderer article={selectedArticle} />
            <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 179, 71, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Fish size={20} color="#FFB347" /></div><div><div style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>FreeNachos</div><div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Poker Strategy & Coaching</div></div></div>
              {user && (<div style={{ display: 'flex', gap: '10px' }}><button onClick={() => setShowDeleteConfirm(selectedArticle)} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 16px', color: '#ef4444', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}><Trash2 size={14} />Delete</button><button onClick={() => openEditor(selectedArticle)} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '10px 16px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}><Edit3 size={14} />Edit Article</button></div>)}
            </div>
          </div>
        )}

        {view === 'editor' && (<ArticleEditor />)}
      </div>
    </div>
  );
}
