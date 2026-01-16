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
  Image,
  ClipboardPaste,
  Calendar
} from 'lucide-react';
import { articlesApi, authApi, storageApi } from '@/lib/supabaseClient';

/**
 * FreeNachos Articles Page
 * Full Supabase integration with authentication and CRUD
 * + Notion paste support
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
  scheduledFor: dbArticle.scheduled_for,
  createdAt: dbArticle.created_at,
  updatedAt: dbArticle.updated_at
});

// ============================================
// NOTION PARSER
// ============================================

const parseNotionContent = (content) => {
  const blocks = [];
  
  // Normalize line endings
  let text = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Check if content is HTML (from rich paste)
  const isHTML = /<[a-z][\s\S]*>/i.test(text);
  
  if (isHTML) {
    return parseHTMLContent(text);
  }
  
  // Parse as markdown/plain text
  const lines = text.split('\n');
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      i++;
      continue;
    }
    
    // Check for code blocks (```)
    if (trimmedLine.startsWith('```')) {
      const language = trimmedLine.slice(3).trim() || 'text';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: 'code',
        language,
        title: language.charAt(0).toUpperCase() + language.slice(1),
        content: codeLines.join('\n')
      });
      i++;
      continue;
    }
    
    // Check for callout syntax (:::type Title)
    if (trimmedLine.startsWith(':::')) {
      const calloutMatch = trimmedLine.match(/^:::(\w+)?\s*(.*?)(?:::)?$/);
      if (calloutMatch) {
        const variant = calloutMatch[1] || 'insight';
        const titleOrContent = calloutMatch[2] || '';
        
        // Check if it's a single-line callout (ends with :::)
        if (trimmedLine.endsWith(':::') && !trimmedLine.match(/^:::\w+\s*:::$/)) {
          blocks.push({
            type: 'callout',
            variant: ['insight', 'warning', 'stat', 'tip'].includes(variant) ? variant : 'insight',
            title: variant.charAt(0).toUpperCase() + variant.slice(1),
            content: titleOrContent.replace(/:::$/, '').trim()
          });
          i++;
          continue;
        }
        
        // Multi-line callout
        const calloutLines = [];
        const title = titleOrContent;
        i++;
        while (i < lines.length && !lines[i].trim().startsWith(':::')) {
          calloutLines.push(lines[i]);
          i++;
        }
        blocks.push({
          type: 'callout',
          variant: ['insight', 'warning', 'stat', 'tip'].includes(variant) ? variant : 'insight',
          title: title || variant.charAt(0).toUpperCase() + variant.slice(1),
          content: calloutLines.join('\n').trim()
        });
        i++;
        continue;
      }
    }
    
    // Check for headers
    const headerMatch = trimmedLine.match(/^(#{1,3})\s+(.+)$/);
    if (headerMatch) {
      blocks.push({
        type: 'header',
        level: headerMatch[1].length,
        content: headerMatch[2].trim()
      });
      i++;
      continue;
    }
    
    // Check for blockquotes
    if (trimmedLine.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }
      const quoteContent = quoteLines.join(' ').trim();
      // Check for attribution (— or --)
      const attrMatch = quoteContent.match(/(.+?)(?:\s*[—–-]{1,2}\s*)([^—–-]+)$/);
      if (attrMatch) {
        blocks.push({
          type: 'quote',
          content: attrMatch[1].trim(),
          attribution: attrMatch[2].trim()
        });
      } else {
        blocks.push({
          type: 'quote',
          content: quoteContent,
          attribution: ''
        });
      }
      continue;
    }
    
    // Check for list items
    if (trimmedLine.match(/^[-*•]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
      const listItems = [];
      while (i < lines.length) {
        const listLine = lines[i].trim();
        const bulletMatch = listLine.match(/^[-*•]\s+(.+)$/);
        const numberMatch = listLine.match(/^\d+\.\s+(.+)$/);
        if (bulletMatch) {
          listItems.push(bulletMatch[1]);
          i++;
        } else if (numberMatch) {
          listItems.push(numberMatch[1]);
          i++;
        } else if (listLine === '') {
          i++;
          break;
        } else {
          break;
        }
      }
      if (listItems.length > 0) {
        blocks.push({
          type: 'list',
          items: listItems
        });
      }
      continue;
    }
    
    // Check for image URL (standalone URL that looks like an image)
    const imageUrlMatch = trimmedLine.match(/^(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?[^\s]*)?)$/i);
    if (imageUrlMatch) {
      blocks.push({
        type: 'image',
        src: imageUrlMatch[1],
        alt: '',
        caption: ''
      });
      i++;
      continue;
    }
    
    // Check for markdown image syntax ![alt](url)
    const mdImageMatch = trimmedLine.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (mdImageMatch) {
      const src = mdImageMatch[2];
      // Check if it's a Notion attachment (won't work externally)
      if (src.startsWith('attachment:')) {
        blocks.push({
          type: 'image',
          src: '',
          alt: mdImageMatch[1] || 'Image placeholder - add URL',
          caption: '⚠️ Notion attachment detected - please add image URL'
        });
      } else {
        blocks.push({
          type: 'image',
          src: src,
          alt: mdImageMatch[1] || '',
          caption: ''
        });
      }
      i++;
      continue;
    }
    
    // Default: paragraph
    // Collect consecutive non-special lines as one paragraph
    const paragraphLines = [];
    while (i < lines.length) {
      const pLine = lines[i].trim();
      if (pLine === '' || 
          pLine.startsWith('#') || 
          pLine.startsWith('>') || 
          pLine.startsWith('```') ||
          pLine.startsWith(':::') ||
          pLine.match(/^[-*•]\s+/) ||
          pLine.match(/^\d+\.\s+/) ||
          pLine.match(/^!\[/) ||
          pLine.match(/^https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)/i)) {
        break;
      }
      paragraphLines.push(pLine);
      i++;
    }
    
    if (paragraphLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        content: paragraphLines.join(' ')
      });
    }
  }
  
  return blocks;
};

const parseHTMLContent = (html) => {
  const blocks = [];
  
  // Create a temporary div to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const body = doc.body;
  
  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        return [{ type: 'paragraph', content: text }];
      }
      return [];
    }
    
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return [];
    }
    
    const tag = node.tagName.toLowerCase();
    
    // Headers
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
      const level = Math.min(parseInt(tag[1]), 3);
      return [{
        type: 'header',
        level,
        content: getTextWithFormatting(node)
      }];
    }
    
    // Paragraphs
    if (tag === 'p') {
      const content = getTextWithFormatting(node);
      if (content.trim()) {
        // Check if it's just an image URL
        const imageUrlMatch = content.trim().match(/^(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?[^\s]*)?)$/i);
        if (imageUrlMatch) {
          return [{
            type: 'image',
            src: imageUrlMatch[1],
            alt: '',
            caption: ''
          }];
        }
        return [{ type: 'paragraph', content }];
      }
      return [];
    }
    
    // Callouts (Notion uses <aside>)
    if (tag === 'aside') {
      const content = getTextWithFormatting(node);
      // Remove leading emoji if present
      const cleanContent = content.replace(/^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u, '').trim();
      return [{
        type: 'callout',
        variant: 'insight',
        title: 'Quick Note',
        content: cleanContent
      }];
    }
    
    // Lists
    if (tag === 'ul' || tag === 'ol') {
      const items = [];
      node.querySelectorAll(':scope > li').forEach(li => {
        items.push(getTextWithFormatting(li));
      });
      if (items.length > 0) {
        return [{ type: 'list', items }];
      }
      return [];
    }
    
    // Code blocks
    if (tag === 'pre') {
      const code = node.querySelector('code');
      const content = code ? code.textContent : node.textContent;
      const langClass = code?.className.match(/language-(\w+)/);
      return [{
        type: 'code',
        language: langClass ? langClass[1] : 'text',
        title: 'Code',
        content: content.trim()
      }];
    }
    
    // Blockquotes
    if (tag === 'blockquote') {
      const content = getTextWithFormatting(node);
      return [{
        type: 'quote',
        content,
        attribution: ''
      }];
    }
    
    // Images
    if (tag === 'img') {
      return [{
        type: 'image',
        src: node.src || '',
        alt: node.alt || '',
        caption: ''
      }];
    }
    
    // Divs and other containers - process children
    if (['div', 'article', 'section', 'main', 'span'].includes(tag)) {
      const childBlocks = [];
      node.childNodes.forEach(child => {
        childBlocks.push(...processNode(child));
      });
      return childBlocks;
    }
    
    // Fallback: get text content
    const text = getTextWithFormatting(node);
    if (text.trim()) {
      return [{ type: 'paragraph', content: text }];
    }
    
    return [];
  };
  
  // Helper to convert HTML formatting to markdown-style
  const getTextWithFormatting = (element) => {
    let result = '';
    
    element.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        result += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        const innerText = getTextWithFormatting(node);
        
        if (tag === 'strong' || tag === 'b') {
          result += `**${innerText}**`;
        } else if (tag === 'em' || tag === 'i') {
          result += `*${innerText}*`;
        } else if (tag === 'code') {
          result += `\`${innerText}\``;
        } else if (tag === 'a') {
          const href = node.getAttribute('href');
          if (href) {
            result += `[${innerText}](${href})`;
          } else {
            result += innerText;
          }
        } else if (tag === 'br') {
          result += ' ';
        } else {
          result += innerText;
        }
      }
    });
    
    return result;
  };
  
  body.childNodes.forEach(node => {
    blocks.push(...processNode(node));
  });
  
  return blocks;
};

// ============================================
// INLINE MARKDOWN RENDERER
// ============================================

const renderInlineMarkdown = (text) => {
  if (!text) return null;
  
  const parts = [];
  let remaining = text;
  let key = 0;
  
  // Pattern for **bold**, *italic*, `code`, and [links](url)
  const pattern = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[([^\]]+)\]\(([^)]+)\))/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    
    const fullMatch = match[0];
    
    if (match[2]) {
      // ***bold italic***
      parts.push(<strong key={key++}><em>{match[2]}</em></strong>);
    } else if (match[3]) {
      // **bold**
      parts.push(<strong key={key++}>{match[3]}</strong>);
    } else if (match[4]) {
      // *italic*
      parts.push(<em key={key++}>{match[4]}</em>);
    } else if (match[5]) {
      // `code`
      parts.push(
        <code key={key++} style={{
          background: 'rgba(255, 179, 71, 0.15)',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.9em',
          fontFamily: 'monospace'
        }}>
          {match[5]}
        </code>
      );
    } else if (match[6] && match[7]) {
      // [link](url)
      parts.push(
        <a 
          key={key++} 
          href={match[7]} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#FFB347', textDecoration: 'underline' }}
        >
          {match[6]}
        </a>
      );
    }
    
    lastIndex = match.index + fullMatch.length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
};

// ============================================
// MAIN COMPONENT
// ============================================

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
  
  // Notion paste modal
  const [showNotionPaste, setShowNotionPaste] = useState(false);
  const [notionContent, setNotionContent] = useState('');
  
  // Schedule modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  
  // Image upload
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const notionTextareaRef = useRef(null);
  const textareaContentRef = useRef('');
  
  // Restore textarea content after re-renders caused by uploadingImages state change
  useEffect(() => {
    if (showNotionPaste && notionTextareaRef.current && textareaContentRef.current) {
      const currentValue = notionTextareaRef.current.value;
      // Only restore if textarea was cleared but we have saved content
      if (!currentValue && textareaContentRef.current) {
        notionTextareaRef.current.value = textareaContentRef.current;
      }
    }
  }, [uploadingImages, showNotionPaste]);
  
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
      setEditorArticle({ id: null, title: '', slug: '', category: 'Strategy', excerpt: '', readTime: '5 min', thumbnail: 'default', thumbnailUrl: '', blocks: [], published: false, scheduledFor: null });
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

  const scheduleArticle = async (dateOverride, timeOverride) => {
    const finalDate = dateOverride || scheduleDate;
    const finalTime = timeOverride || scheduleTime;
    
    if (!editorArticle.title || !finalDate || !finalTime) return;
    setSaving(true);
    setError(null);
    try {
      const slug = editorArticle.slug || generateSlug(editorArticle.title);
      const scheduledFor = new Date(`${finalDate}T${finalTime}`).toISOString();
      const articleData = { 
        ...editorArticle, 
        slug, 
        published: true, 
        scheduledFor 
      };
      if (isEditing && editorArticle.id) { 
        await articlesApi.update(editorArticle.id, articleData); 
      } else { 
        await articlesApi.create(articleData); 
      }
      await fetchArticles();
      setView('library');
      setEditorArticle(null);
      setShowScheduleModal(false);
      setScheduleDate('');
      setScheduleTime('');
    } catch (err) {
      console.error('Error scheduling article:', err);
      setError(err.message || 'Failed to schedule article');
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
  
  // Handle pasted images in the Notion modal
  const handlePasteWithImages = async (e) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;
    
    const items = Array.from(clipboardData.items);
    const imageItems = items.filter(item => item.type.startsWith('image/'));
    
    if (imageItems.length === 0) {
      // No images - let normal paste happen, but track content
      setTimeout(() => {
        if (notionTextareaRef.current) {
          textareaContentRef.current = notionTextareaRef.current.value;
        }
      }, 0);
      return;
    }
    
    // Image paste detected
    e.preventDefault();
    
    const textarea = notionTextareaRef.current;
    if (!textarea) return;
    
    // CRITICAL: Capture content SYNCHRONOUSLY before ANY state changes
    const savedContent = textarea.value || textareaContentRef.current || '';
    const savedCursor = textarea.selectionStart || savedContent.length;
    
    // Store in ref as backup
    const contentBackup = savedContent;
    const cursorBackup = savedCursor;
    
    setUploadingImages(true);
    
    try {
      const newUrls = [];
      for (const item of imageItems) {
        const file = item.getAsFile();
        if (file) {
          const url = await storageApi.uploadImage(file);
          newUrls.push(url);
        }
      }
      
      setUploadedImages(prev => [...prev, ...newUrls]);
      
      // Build new content using SAVED values (not current textarea which may have been reset)
      const imageText = newUrls.map(url => `\n${url}\n`).join('');
      const before = contentBackup.slice(0, cursorBackup);
      const after = contentBackup.slice(cursorBackup);
      const newContent = before + imageText + after;
      
      // Apply to textarea
      requestAnimationFrame(() => {
        const ta = notionTextareaRef.current;
        if (ta) {
          ta.value = newContent;
          textareaContentRef.current = newContent;
          const newCursorPos = cursorBackup + imageText.length;
          ta.focus();
          ta.setSelectionRange(newCursorPos, newCursorPos);
        }
      });
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image: ' + err.message);
      // Restore original content on error
      requestAnimationFrame(() => {
        const ta = notionTextareaRef.current;
        if (ta) {
          ta.value = contentBackup;
          textareaContentRef.current = contentBackup;
        }
      });
    } finally {
      setUploadingImages(false);
    }
  };
  
  // Notion paste handler
  const handleNotionPaste = () => {
    const content = notionTextareaRef.current?.value || textareaContentRef.current || '';
    if (!content.trim()) return;
    
    const parsedBlocks = parseNotionContent(content);
    
    // Try to extract title from first H1
    let title = editorArticle.title;
    let excerpt = editorArticle.excerpt;
    let finalBlocks = parsedBlocks;
    
    if (parsedBlocks.length > 0 && parsedBlocks[0].type === 'header' && parsedBlocks[0].level === 1) {
      title = parsedBlocks[0].content;
      finalBlocks = parsedBlocks.slice(1);
    }
    
    // Try to extract excerpt from first paragraph
    if (!excerpt && finalBlocks.length > 0 && finalBlocks[0].type === 'paragraph') {
      excerpt = finalBlocks[0].content.slice(0, 200);
      if (finalBlocks[0].content.length > 200) excerpt += '...';
    }
    
    setEditorArticle({
      ...editorArticle,
      title: title || editorArticle.title,
      excerpt: excerpt || editorArticle.excerpt,
      blocks: [...editorArticle.blocks, ...finalBlocks]
    });
    
    if (notionTextareaRef.current) notionTextareaRef.current.value = '';
    textareaContentRef.current = '';
    setNotionContent('');
    setUploadedImages([]);
    setShowNotionPaste(false);
  };

  // Background nachos
  useEffect(() => {
    const generated = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 20 + Math.random() * 30,
      opacity: 0.03 + Math.random() * 0.05,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      moveX: (Math.random() - 0.5) * 100,
      moveY: (Math.random() - 0.5) * 100
    }));
    setNachos(generated);
  }, []);

  const filteredArticles = selectedCategory === 'All' ? articles : articles.filter(a => a.category === selectedCategory);

  const NachoTriangle = ({ size = 40, opacity = 0.1 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }}>
      <path d="M20 2L38 38H2L20 2Z" fill="#FFB347" />
      <circle cx="12" cy="28" r="2" fill="#4A2C0A" />
      <circle cx="22" cy="22" r="1.5" fill="#4A2C0A" />
      <circle cx="28" cy="30" r="2" fill="#4A2C0A" />
      <circle cx="18" cy="32" r="1" fill="#2D5A27" />
      <circle cx="25" cy="26" r="1.5" fill="#2D5A27" />
    </svg>
  );

  const CartoonNacho = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <path d="M32 4L60 56H4L32 4Z" fill="url(#nachoGrad)" stroke="#E09030" strokeWidth="2" />
      <circle cx="20" cy="42" r="4" fill="#5D3A1A" />
      <circle cx="38" cy="36" r="3" fill="#5D3A1A" />
      <circle cx="44" cy="46" r="4" fill="#5D3A1A" />
      <circle cx="28" cy="48" r="3" fill="#5D3A1A" />
      <ellipse cx="24" cy="38" r="3" ry="2" fill="#4A7C3F" />
      <ellipse cx="40" cy="44" r="2.5" ry="1.5" fill="#4A7C3F" />
      <ellipse cx="32" cy="50" r="2" ry="1.5" fill="#C41E3A" />
      <circle cx="24" cy="24" r="3" fill="#1a1a1a" />
      <circle cx="40" cy="24" r="3" fill="#1a1a1a" />
      <circle cx="25" cy="23" r="1" fill="white" />
      <circle cx="41" cy="23" r="1" fill="white" />
      <path d="M28 32 Q32 36 36 32" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" />
      <defs>
        <linearGradient id="nachoGrad" x1="32" y1="4" x2="32" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD485" />
          <stop offset="1" stopColor="#FFB347" />
        </linearGradient>
      </defs>
    </svg>
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
          return <HeaderTag key={index} style={{ color: '#ffffff', lineHeight: 1.2, ...headerStyles[block.level] }}>{renderInlineMarkdown(block.content)}</HeaderTag>;
        case 'paragraph':
          return <p key={index} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', lineHeight: 1.8, marginBottom: '20px' }}>{renderInlineMarkdown(block.content)}</p>;
        case 'callout':
          const calloutStyles = { insight: { bg: 'rgba(255, 179, 71, 0.15)', border: 'rgba(255, 179, 71, 0.3)', icon: Lightbulb, iconColor: '#FFB347' }, warning: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', icon: Zap, iconColor: '#ef4444' }, stat: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', icon: TrendingUp, iconColor: '#22c55e' }, tip: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', icon: BookOpen, iconColor: '#60a5fa' } };
          const style = calloutStyles[block.variant] || calloutStyles.insight;
          const IconComponent = style.icon;
          return (<div key={index} style={{ background: style.bg, border: `1px solid ${style.border}`, borderRadius: '12px', padding: '24px', marginBottom: '24px', marginTop: '24px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><IconComponent size={20} color={style.iconColor} /><span style={{ color: style.iconColor, fontWeight: '600', fontSize: '14px' }}>{block.title}</span></div><p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>{renderInlineMarkdown(block.content)}</p></div>);
        case 'list':
          return (<ul key={index} style={{ marginBottom: '24px', paddingLeft: '8px', listStyle: 'none' }}>{block.items.map((item, i) => (<li key={i} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.8, marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}><span style={{ color: '#FFB347', fontSize: '18px', lineHeight: 1.4 }}>▸</span><span>{renderInlineMarkdown(item)}</span></li>))}</ul>);
        case 'code':
          return (<div key={index} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', marginTop: '24px', border: '1px solid rgba(255,255,255,0.1)' }}><div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}><Code size={14} color="#FFB347" /><span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '500' }}>{block.title || block.language}</span></div><pre style={{ margin: 0, padding: '20px', overflow: 'auto', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}><code>{block.content}</code></pre></div>);
        case 'data-viz':
          return (<div key={index} className="glass-card" style={{ borderRadius: '12px', padding: '24px', marginBottom: '24px', marginTop: '24px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><BarChart3 size={18} color="#FFB347" /><span style={{ color: '#FFB347', fontWeight: '600', fontSize: '14px' }}>{block.title}</span></div><div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{block.data.labels.map((label, i) => { const value = block.data.values[i]; const maxValue = Math.max(...block.data.values.map(Math.abs)); const percentage = (Math.abs(value) / maxValue) * 100; const isPositive = value >= 0; return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ width: '70px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '500' }}>{label}</span><div style={{ flex: 1, height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${percentage}%`, height: '100%', background: isPositive ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.6), rgba(34, 197, 94, 0.9))' : 'linear-gradient(90deg, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.9))', borderRadius: '6px', transition: 'width 0.5s ease-out' }} /></div><span style={{ width: '70px', textAlign: 'right', color: isPositive ? '#22c55e' : '#ef4444', fontSize: '14px', fontWeight: '600' }}>{isPositive ? '+' : ''}{value.toFixed(1)}</span></div>); })}</div></div>);
        case 'quote':
          return (<blockquote key={index} style={{ borderLeft: '4px solid #FFB347', margin: '32px 0', padding: '20px 24px', background: 'rgba(255, 179, 71, 0.08)', borderRadius: '0 12px 12px 0' }}><Quote size={24} color="#FFB347" style={{ marginBottom: '12px', opacity: 0.6 }} /><p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>{renderInlineMarkdown(block.content)}</p>{block.attribution && (<cite style={{ display: 'block', marginTop: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontStyle: 'normal' }}>— {block.attribution}</cite>)}</blockquote>);
        case 'image':
          return (<figure key={index} style={{ margin: '32px 0', textAlign: 'center' }}>{block.src ? (<img src={block.src} alt={block.alt || ''} style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />) : (<div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}><FileImage size={48} color="rgba(255,255,255,0.3)" /><span style={{ marginLeft: '12px', color: 'rgba(255,255,255,0.4)' }}>[Image: {block.alt || 'Image'}]</span></div>)}{block.caption && <figcaption style={{ marginTop: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{block.caption}</figcaption>}</figure>);
        default: return null;
      }
    };
    const isScheduled = article.scheduledFor && new Date(article.scheduledFor) > new Date();
    const scheduledDate = isScheduled ? new Date(article.scheduledFor).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : null;
    
    return (
      <article style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(255, 179, 71, 0.2)', color: '#FFB347', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{article.category}</span>
          {!article.published && (<span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Draft</span>)}
          {isScheduled && (<span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} />{scheduledDate}</span>)}
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
    
    const isScheduled = article.scheduledFor && new Date(article.scheduledFor) > new Date();
    const scheduledDate = isScheduled ? new Date(article.scheduledFor).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : null;
    
    return (
      <div className="card-hover glass-card article-card" onClick={() => onClick(article)} style={{ borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
        {!article.published && (<div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(239, 68, 68, 0.9)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', zIndex: 2 }}>Draft</div>)}
        {isScheduled && (<div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(59, 130, 246, 0.9)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', zIndex: 2, display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={10} />Scheduled</div>)}
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

    const blockTypes = [
      { type: 'header', icon: Type, label: 'Header' },
      { type: 'paragraph', icon: FileText, label: 'Text' },
      { type: 'callout', icon: Lightbulb, label: 'Callout' },
      { type: 'list', icon: List, label: 'List' },
      { type: 'code', icon: Code, label: 'Code' },
      { type: 'data-viz', icon: BarChart3, label: 'Chart' },
      { type: 'quote', icon: Quote, label: 'Quote' },
      { type: 'image', icon: FileImage, label: 'Image' }
    ];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        <div>
          <div className="glass-card" style={{ borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</label>
              <input type="text" value={editorArticle.title} onChange={(e) => setEditorArticle({ ...editorArticle, title: e.target.value })} placeholder="Article title..." style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '14px 16px', color: '#fff', fontSize: '18px', fontWeight: '600', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</label>
                <select value={editorArticle.category} onChange={(e) => setEditorArticle({ ...editorArticle, category: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px' }}>
                  {CATEGORIES.filter(c => c !== 'All').map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Read Time</label>
                <input type="text" value={editorArticle.readTime} onChange={(e) => setEditorArticle({ ...editorArticle, readTime: e.target.value })} placeholder="5 min" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Excerpt</label>
              <textarea value={editorArticle.excerpt} onChange={(e) => setEditorArticle({ ...editorArticle, excerpt: e.target.value })} placeholder="Brief description..." rows={2} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', resize: 'vertical', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thumbnail URL (optional)</label>
              <input type="text" value={editorArticle.thumbnailUrl || ''} onChange={(e) => setEditorArticle({ ...editorArticle, thumbnailUrl: e.target.value })} placeholder="https://..." style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '600', margin: 0 }}>Content Blocks</h3>
            <button 
              onClick={() => setShowNotionPaste(true)} 
              className="btn-hover"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'linear-gradient(135deg, rgba(255, 179, 71, 0.2) 0%, rgba(255, 179, 71, 0.1) 100%)', 
                border: '1px solid rgba(255, 179, 71, 0.3)', 
                borderRadius: '8px', 
                padding: '10px 16px', 
                color: '#FFB347', 
                fontSize: '13px', 
                fontWeight: '600', 
                cursor: 'pointer' 
              }}
            >
              <ClipboardPaste size={16} />
              Paste from Notion
            </button>
          </div>

          {editorArticle.blocks.length === 0 ? (
            <div className="glass-card" style={{ borderRadius: '12px', padding: '48px', textAlign: 'center', border: '2px dashed rgba(255, 179, 71, 0.2)' }}>
              <ClipboardPaste size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '16px' }} />
              <h4 style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>No content yet</h4>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '20px' }}>Paste from Notion or add blocks manually</p>
              <button 
                onClick={() => setShowNotionPaste(true)} 
                className="btn-hover"
                style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  background: '#FFB347', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '12px 20px', 
                  color: '#0a0a0a', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer' 
                }}
              >
                <ClipboardPaste size={16} />
                Paste from Notion
              </button>
            </div>
          ) : (
            editorArticle.blocks.map((block, index) => (
              <BlockEditor key={index} block={block} index={index} />
            ))
          )}
        </div>

        <div>
          <div className="glass-card" style={{ borderRadius: '12px', padding: '20px', position: 'sticky', top: '20px' }}>
            <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16} color="#FFB347" />Add Block</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {blockTypes.map(({ type, icon: Icon, label }) => (
                <button key={type} onClick={() => addBlock(type)} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}>
                  <Icon size={16} color="#FFB347" />
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '500' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Schedule Modal
  const ScheduleModal = () => {
    // Set default to tomorrow at 9:00 AM if not already set
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];
    const defaultTime = '09:00';
    
    const currentDate = scheduleDate || defaultDate;
    const currentTime = scheduleTime || defaultTime;
    
    const scheduledDateTime = new Date(`${currentDate}T${currentTime}`);
    const isValidSchedule = scheduledDateTime > new Date();
    
    const formatPreview = () => {
      if (!currentDate || !currentTime) return '';
      return scheduledDateTime.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
        <div className="glass-card" style={{ borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '450px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={22} color="#60a5fa" />
              </div>
              <div>
                <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Schedule Article</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '4px 0 0' }}>Set when this article goes live</p>
              </div>
            </div>
            <button onClick={() => { setShowScheduleModal(false); setScheduleDate(''); setScheduleTime(''); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
              <X size={18} color="rgba(255,255,255,0.6)" />
            </button>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                colorScheme: 'dark'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time</label>
            <input
              type="time"
              value={currentTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                colorScheme: 'dark'
              }}
            />
          </div>
          
          {currentDate && currentTime && (
            <div style={{ 
              background: isValidSchedule ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
              borderRadius: '8px', 
              padding: '12px 16px', 
              marginBottom: '24px', 
              border: `1px solid ${isValidSchedule ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` 
            }}>
              <p style={{ color: isValidSchedule ? '#60a5fa' : '#ef4444', fontSize: '13px', margin: 0 }}>
                {isValidSchedule ? `📅 ${formatPreview()}` : '⚠️ Please select a future date and time'}
              </p>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => { setShowScheduleModal(false); setScheduleDate(''); setScheduleTime(''); }} 
              style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '14px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              onClick={() => scheduleArticle(currentDate, currentTime)}
              disabled={!isValidSchedule || saving}
              style={{ 
                flex: 2, 
                background: isValidSchedule && !saving ? '#60a5fa' : 'rgba(59, 130, 246, 0.3)', 
                border: 'none', 
                borderRadius: '8px', 
                padding: '14px', 
                color: isValidSchedule && !saving ? '#0a0a0a' : 'rgba(255,255,255,0.4)', 
                fontSize: '14px', 
                fontWeight: '600', 
                cursor: isValidSchedule && !saving ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {saving ? (<><Loader size={16} className="spin" />Scheduling...</>) : (<><Calendar size={16} />Schedule</>)}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={nachoRef} style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {showLogin && (
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
      )}
      {showDeleteConfirm && <DeleteConfirmModal article={showDeleteConfirm} />}
      {showNotionPaste && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-card" style={{ borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '1100px', height: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255, 179, 71, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(255, 179, 71, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ClipboardPaste size={22} color="#FFB347" />
                </div>
                <div>
                  <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Paste from Notion</h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '4px 0 0' }}>Copy your Notion content and paste it here</p>
                </div>
              </div>
              <button onClick={() => { 
                setShowNotionPaste(false); 
                setNotionContent(''); 
                setUploadedImages([]); 
                if (notionTextareaRef.current) notionTextareaRef.current.value = '';
                textareaContentRef.current = '';
              }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
                <X size={18} color="rgba(255,255,255,0.6)" />
              </button>
            </div>
            
            <div style={{ background: 'rgba(255, 179, 71, 0.1)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', border: '1px solid rgba(255, 179, 71, 0.2)' }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: '#FFB347' }}>Supported:</strong> Headings, paragraphs, lists, code blocks, quotes, callouts, <strong>**bold**</strong>, <em>*italic*</em>
                <br />
                <strong style={{ color: '#FFB347' }}>Images:</strong> Paste images directly (auto-uploads) or paste image URLs on their own line
              </p>
            </div>
            
            <div style={{ 
              background: 'rgba(59, 130, 246, 0.1)', 
              borderRadius: '8px', 
              padding: '12px 16px', 
              marginBottom: '16px', 
              border: '1px solid rgba(59, 130, 246, 0.2)', 
              display: uploadingImages ? 'flex' : 'none', 
              alignItems: 'center', 
              gap: '10px' 
            }}>
              <Loader size={16} className="spin" color="#60a5fa" />
              <p style={{ color: '#60a5fa', fontSize: '13px', margin: 0 }}>Uploading image...</p>
            </div>
            
            <div style={{ 
              background: 'rgba(34, 197, 94, 0.1)', 
              borderRadius: '8px', 
              padding: '12px 16px', 
              marginBottom: '16px', 
              border: '1px solid rgba(34, 197, 94, 0.2)',
              display: (uploadedImages.length > 0 && !uploadingImages) ? 'block' : 'none'
            }}>
              <p style={{ color: '#22c55e', fontSize: '13px', margin: 0 }}>✓ {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''} uploaded</p>
            </div>
            
            <textarea
              key="notion-textarea"
              ref={notionTextareaRef}
              defaultValue=""
              onInput={(e) => { textareaContentRef.current = e.target.value; }}
              onChange={(e) => { textareaContentRef.current = e.target.value; }}
              onPaste={handlePasteWithImages}
              placeholder="Paste your Notion content here (Ctrl+V / Cmd+V)... You can also paste images directly!"
              style={{
                flex: 1,
                minHeight: '200px',
                width: '100%',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '16px',
                color: '#fff',
                fontSize: '14px',
                lineHeight: 1.6,
                resize: 'none',
                outline: 'none',
                fontFamily: 'monospace'
              }}
              autoFocus
            />
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                onClick={() => { 
                  setShowNotionPaste(false); 
                  setNotionContent(''); 
                  setUploadedImages([]); 
                  if (notionTextareaRef.current) notionTextareaRef.current.value = '';
                  textareaContentRef.current = '';
                }} 
                style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '14px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleNotionPaste} 
                disabled={uploadingImages}
                style={{ 
                  flex: 2, 
                  background: !uploadingImages ? '#FFB347' : 'rgba(255, 179, 71, 0.3)', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '14px', 
                  color: !uploadingImages ? '#0a0a0a' : 'rgba(255,255,255,0.4)', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: !uploadingImages ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Zap size={16} />
                Parse & Import
              </button>
            </div>
          </div>
        </div>
      )}
      {showScheduleModal && <ScheduleModal />}

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
              <button onClick={() => setShowScheduleModal(true)} disabled={!editorArticle?.title || saving} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '10px 16px', color: '#60a5fa', fontSize: '13px', fontWeight: '500', cursor: !editorArticle?.title || saving ? 'not-allowed' : 'pointer', opacity: !editorArticle?.title ? 0.5 : 1 }}><Calendar size={14} />Schedule</button>
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
