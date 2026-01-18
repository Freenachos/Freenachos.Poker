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
  Calendar,
  Mail
} from 'lucide-react';
import { articlesApi, authApi, storageApi } from '@/lib/supabaseClient';

/**
 * Freenachos Articles Page
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
// IMAGE URL DETECTION HELPERS
// ============================================

// Check if URL is a standard image URL (ends with image extension)
const isStandardImageUrl = (url) => {
  return /^https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?[^\s]*)?$/i.test(url);
};

// Check if URL is a Supabase storage URL
const isSupabaseStorageUrl = (url) => {
  return /^https?:\/\/[^\/]+\.supabase\.co\/storage\/v1\/object\//.test(url);
};

// Check if a URL should be treated as an image
const isImageUrl = (url) => {
  const trimmed = url.trim();
  return isStandardImageUrl(trimmed) || isSupabaseStorageUrl(trimmed);
};

// Extract image URL from a line (returns the URL or null)
const extractImageUrl = (line) => {
  const trimmed = line.trim();
  // Check for standard image URL
  const standardMatch = trimmed.match(/^(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?[^\s]*)?)$/i);
  if (standardMatch) return standardMatch[1];
  
  // Check for Supabase storage URL
  const supabaseMatch = trimmed.match(/^(https?:\/\/[^\/]+\.supabase\.co\/storage\/v1\/object\/[^\s]+)$/);
  if (supabaseMatch) return supabaseMatch[1];
  
  return null;
};

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
      // Check for attribution (,  or --)
      const attrMatch = quoteContent.match(/(.+?)(?:\s*[, , -]{1,2}\s*)([^, , -]+)$/);
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
    
    // Check for image URL (standalone URL that looks like an image OR Supabase storage URL)
    const imageUrl = extractImageUrl(trimmedLine);
    if (imageUrl) {
      blocks.push({
        type: 'image',
        src: imageUrl,
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
          isImageUrl(pLine)) {  // FIX: Use the helper function to detect all image URLs
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
        // Check if it's just an image URL (standard OR Supabase storage)
        const imageUrl = extractImageUrl(content);
        if (imageUrl) {
          return [{
            type: 'image',
            src: imageUrl,
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
          background: 'rgba(168, 139, 70, 0.15)',
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
          style={{ color: '#a88b46', textDecoration: 'underline' }}
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

export default function FreenachosArticles() {
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
  
  // Newsletter
  const [sendNewsletter, setSendNewsletter] = useState(true);
  
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
      const articleData = { 
        ...editorArticle, 
        slug, 
        published: publish !== null ? publish : editorArticle.published,
        sendNewsletter: publish === true ? sendNewsletter : false
      };
      
      let savedArticle;
      if (isEditing && editorArticle.id) { 
        savedArticle = await articlesApi.update(editorArticle.id, articleData); 
      } else { 
        savedArticle = await articlesApi.create(articleData); 
      }
      
      // Send newsletter if publishing and checkbox is ticked
      if (publish === true && sendNewsletter && savedArticle) {
        try {
          const session = await authApi.getSession();
          const response = await fetch('/api/newsletter/send', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token || ''}`
            },
            body: JSON.stringify({
              articleId: savedArticle.id,
              articleTitle: savedArticle.title,
              articleExcerpt: savedArticle.excerpt,
              articleSlug: savedArticle.slug
            })
          });
          
          if (!response.ok) {
            const data = await response.json();
            console.warn('Newsletter send warning:', data.error);
            // Don't fail the whole save if newsletter fails
          }
        } catch (newsletterErr) {
          console.error('Newsletter error:', newsletterErr);
          // Continue anyway - article is saved
        }
      }
      
      await fetchArticles();
      setView('library');
      setEditorArticle(null);
      setSendNewsletter(true); // Reset for next article
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
        scheduledFor,
        sendNewsletter: sendNewsletter
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
      setSendNewsletter(true); // Reset for next article
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
      <path d="M20 2L38 38H2L20 2Z" fill="#a88b46" />
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
          <stop offset="1" stopColor="#a88b46" />
        </linearGradient>
      </defs>
    </svg>
  );

  // DeleteConfirmModal is now rendered inline in return statement

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
          const calloutStyles = { insight: { bg: 'rgba(168, 139, 70, 0.15)', border: 'rgba(168, 139, 70, 0.3)', icon: Lightbulb, iconColor: '#a88b46' }, warning: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', icon: Zap, iconColor: '#ef4444' }, stat: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', icon: TrendingUp, iconColor: '#22c55e' }, tip: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', icon: BookOpen, iconColor: '#60a5fa' } };
          const style = calloutStyles[block.variant] || calloutStyles.insight;
          const IconComponent = style.icon;
          return (<div key={index} style={{ background: style.bg, border: `1px solid ${style.border}`, borderRadius: '12px', padding: '24px', marginBottom: '24px', marginTop: '24px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}><IconComponent size={20} color={style.iconColor} /><span style={{ color: style.iconColor, fontWeight: '600', fontSize: '14px' }}>{block.title}</span></div><p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>{renderInlineMarkdown(block.content)}</p></div>);
        case 'list':
          return (<ul key={index} style={{ marginBottom: '24px', paddingLeft: '8px', listStyle: 'none' }}>{block.items.map((item, i) => (<li key={i} style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', lineHeight: 1.8, marginBottom: '8px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}><span style={{ color: '#a88b46', fontSize: '18px', lineHeight: 1.4 }}>▸</span><span>{renderInlineMarkdown(item)}</span></li>))}</ul>);
        case 'code':
          return (<div key={index} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', marginTop: '24px', border: '1px solid rgba(255,255,255,0.1)' }}><div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}><Code size={14} color="#a88b46" /><span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '500' }}>{block.title || block.language}</span></div><pre style={{ margin: 0, padding: '20px', overflow: 'auto', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}><code>{block.content}</code></pre></div>);
        case 'data-viz':
          return (<div key={index} className="glass-card" style={{ borderRadius: '12px', padding: '24px', marginBottom: '24px', marginTop: '24px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><BarChart3 size={18} color="#a88b46" /><span style={{ color: '#a88b46', fontWeight: '600', fontSize: '14px' }}>{block.title}</span></div><div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{block.data.labels.map((label, i) => { const value = block.data.values[i]; const maxValue = Math.max(...block.data.values.map(Math.abs)); const percentage = (Math.abs(value) / maxValue) * 100; const isPositive = value >= 0; return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ width: '70px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '500' }}>{label}</span><div style={{ flex: 1, height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${percentage}%`, height: '100%', background: isPositive ? 'linear-gradient(90deg, rgba(34, 197, 94, 0.6), rgba(34, 197, 94, 0.9))' : 'linear-gradient(90deg, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.9))', borderRadius: '6px', transition: 'width 0.5s ease-out' }} /></div><span style={{ width: '70px', textAlign: 'right', color: isPositive ? '#22c55e' : '#ef4444', fontSize: '14px', fontWeight: '600' }}>{isPositive ? '+' : ''}{value.toFixed(1)}</span></div>); })}</div></div>);
        case 'quote':
          return (<blockquote key={index} style={{ borderLeft: '4px solid #a88b46', margin: '32px 0', padding: '20px 24px', background: 'rgba(168, 139, 70, 0.08)', borderRadius: '0 12px 12px 0' }}><Quote size={24} color="#a88b46" style={{ marginBottom: '12px', opacity: 0.6 }} /><p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>{renderInlineMarkdown(block.content)}</p>{block.attribution && (<cite style={{ display: 'block', marginTop: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '14px', fontStyle: 'normal' }}>,  {block.attribution}</cite>)}</blockquote>);
        case 'image':
          return (<figure key={index} style={{ margin: '32px 0', textAlign: 'center' }}>{block.src ? (<img src={block.src} alt={block.alt || ''} style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }} />) : (<div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}><FileImage size={48} color="rgba(255,255,255,0.3)" /><span style={{ marginLeft: '12px', color: 'rgba(255,255,255,0.4)' }}>[Image: {block.alt || 'Image'}]</span></div>)}{block.caption && <figcaption style={{ marginTop: '12px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{block.caption}</figcaption>}</figure>);
        default: return null;
      }
    };
    const isScheduled = article.scheduledFor && new Date(article.scheduledFor) > new Date();
    const scheduledDate = isScheduled ? new Date(article.scheduledFor).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : null;
    const thumbnailIcons = { 'poker-table': Fish, 'chart': BarChart3, 'stats': TrendingUp, 'default': FileText };
    const ThumbnailIcon = thumbnailIcons[article.thumbnail] || thumbnailIcons['default'];
    
    return (
      <article style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Full-width Thumbnail */}
        {article.thumbnailUrl ? (
          <div style={{ 
            width: '100%', 
            height: '320px', 
            borderRadius: '16px', 
            overflow: 'hidden', 
            marginBottom: '32px',
            border: '1px solid rgba(168, 139, 70, 0.2)'
          }}>
            <img 
              src={article.thumbnailUrl} 
              alt={article.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        ) : (
          <div style={{ 
            width: '100%', 
            height: '200px', 
            borderRadius: '16px', 
            background: 'linear-gradient(135deg, rgba(168, 139, 70, 0.1) 0%, rgba(168, 139, 70, 0.03) 100%)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '32px',
            border: '1px solid rgba(168, 139, 70, 0.15)'
          }}>
            <ThumbnailIcon size={64} color="#a88b46" style={{ opacity: 0.3 }} />
          </div>
        )}

        {/* Article Title */}
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 40px)',
          fontWeight: '800',
          color: '#FFFFFF',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          marginBottom: '24px',
          fontFamily: 'Manrope, Inter, sans-serif'
        }}>
          {article.title}
        </h1>

        {/* Meta Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
          <span style={{ background: 'rgba(168, 139, 70, 0.2)', color: '#a88b46', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{article.category}</span>
          {!article.published && (<span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Draft</span>)}
          {isScheduled && (<span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} />{scheduledDate}</span>)}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}><User size={14} /><span>Freenachos</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}><Clock size={14} /><span>{article.readTime}</span></div>
        </div>

        {/* Article Content */}
        {article.blocks.map((block, index) => renderBlock(block, index))}
      </article>
    );
  };

  const ArticleCard = ({ article, onClick }) => {
    const thumbnailIcons = { 'poker-table': Fish, 'chart': BarChart3, 'stats': TrendingUp, 'default': FileText };
    const IconComponent = thumbnailIcons[article.thumbnail] || thumbnailIcons['default'];
    const isScheduled = article.scheduledFor && new Date(article.scheduledFor) > new Date();
    
    return (
      <div 
        onClick={() => onClick(article)} 
        className="glass-card-gold" 
        style={{ 
          borderRadius: '20px', 
          overflow: 'hidden', 
          cursor: 'pointer', 
          animation: 'fadeInUp 0.5s ease-out'
        }}
      >
        {article.thumbnailUrl ? (
          <div style={{ height: '180px', background: 'rgba(168, 139, 70, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={article.thumbnailUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={{ height: '180px', background: 'linear-gradient(135deg, rgba(168, 139, 70, 0.08) 0%, rgba(168, 139, 70, 0.03) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComponent size={48} color="#a88b46" style={{ opacity: 0.4 }} />
          </div>
        )}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{ 
              color: '#a88b46', 
              fontSize: '10px', 
              fontWeight: '600', 
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>{article.category}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>•</span>
            <span style={{ 
              color: '#a88b46', 
              fontSize: '10px', 
              fontWeight: '500', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}><Clock size={10} />{article.readTime}</span>
            {!article.published && (
              <span style={{ 
                background: 'rgba(239, 68, 68, 0.15)', 
                color: '#ef4444', 
                padding: '3px 8px', 
                borderRadius: '4px', 
                fontSize: '9px', 
                fontWeight: '600', 
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Draft</span>
            )}
            {isScheduled && (
              <span style={{ 
                background: 'rgba(59, 130, 246, 0.15)', 
                color: '#60a5fa', 
                padding: '3px 8px', 
                borderRadius: '4px', 
                fontSize: '9px', 
                fontWeight: '600', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                letterSpacing: '0.05em'
              }}><Calendar size={9} />Scheduled</span>
            )}
          </div>
          <h3 style={{ 
            color: '#FFFFFF', 
            fontSize: '17px', 
            fontWeight: '600', 
            marginBottom: '10px', 
            lineHeight: 1.35,
            letterSpacing: '-0.01em'
          }}>{article.title}</h3>
          <p style={{ 
            color: 'rgba(255,255,255,0.5)', 
            fontSize: '13px', 
            lineHeight: 1.6, 
            marginBottom: '0' 
          }}>{article.excerpt?.slice(0, 100)}{article.excerpt?.length > 100 ? '...' : ''}</p>
        </div>
      </div>
    );
  };

  const ArticleEditor = () => {
    const addBlock = (type) => {
      const newBlock = { type };
      switch (type) {
        case 'header': Object.assign(newBlock, { level: 2, content: '' }); break;
        case 'paragraph': Object.assign(newBlock, { content: '' }); break;
        case 'callout': Object.assign(newBlock, { variant: 'insight', title: 'Quick Note', content: '' }); break;
        case 'list': Object.assign(newBlock, { items: [''] }); break;
        case 'code': Object.assign(newBlock, { language: 'javascript', title: 'Code', content: '' }); break;
        case 'data-viz': Object.assign(newBlock, { title: 'Chart', data: { labels: ['A', 'B', 'C'], values: [10, 20, 15] } }); break;
        case 'quote': Object.assign(newBlock, { content: '', attribution: '' }); break;
        case 'image': Object.assign(newBlock, { src: '', alt: '', caption: '' }); break;
      }
      setEditorArticle({ ...editorArticle, blocks: [...editorArticle.blocks, newBlock] });
    };

    const updateBlock = (index, updates) => {
      const newBlocks = [...editorArticle.blocks];
      newBlocks[index] = { ...newBlocks[index], ...updates };
      setEditorArticle({ ...editorArticle, blocks: newBlocks });
    };

    const removeBlock = (index) => {
      setEditorArticle({ ...editorArticle, blocks: editorArticle.blocks.filter((_, i) => i !== index) });
    };

    const moveBlock = (index, direction) => {
      const newBlocks = [...editorArticle.blocks];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= newBlocks.length) return;
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      setEditorArticle({ ...editorArticle, blocks: newBlocks });
    };

    const BlockEditor = ({ block, index }) => {
      const [collapsed, setCollapsed] = useState(false);
      
      return (
        <div className="glass-card" style={{ borderRadius: '12px', marginBottom: '12px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: collapsed ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <GripVertical size={16} color="rgba(255,255,255,0.3)" />
              <span style={{ color: '#a88b46', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{block.type}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button onClick={() => moveBlock(index, -1)} disabled={index === 0} style={{ background: 'none', border: 'none', padding: '6px', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}><ChevronUp size={14} color="rgba(255,255,255,0.5)" /></button>
              <button onClick={() => moveBlock(index, 1)} disabled={index === editorArticle.blocks.length - 1} style={{ background: 'none', border: 'none', padding: '6px', cursor: index === editorArticle.blocks.length - 1 ? 'not-allowed' : 'pointer', opacity: index === editorArticle.blocks.length - 1 ? 0.3 : 1 }}><ChevronDown size={14} color="rgba(255,255,255,0.5)" /></button>
              <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer' }}>{collapsed ? <Eye size={14} color="rgba(255,255,255,0.5)" /> : <EyeOff size={14} color="rgba(255,255,255,0.5)" />}</button>
              <button onClick={() => removeBlock(index)} style={{ background: 'none', border: 'none', padding: '6px', cursor: 'pointer' }}><X size={14} color="#ef4444" /></button>
            </div>
          </div>
          {!collapsed && (
            <div style={{ padding: '16px' }}>
              {block.type === 'header' && (<>
                <select value={block.level} onChange={(e) => updateBlock(index, { level: parseInt(e.target.value) })} style={{ marginBottom: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '12px' }}>
                  <option value={1}>H1 - Main Title</option>
                  <option value={2}>H2 - Section</option>
                  <option value={3}>H3 - Subsection</option>
                </select>
                <input type="text" value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })} placeholder="Header text..." style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '16px', fontWeight: '600' }} />
              </>)}
              {block.type === 'paragraph' && (<textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })} placeholder="Paragraph text... (supports **bold**, *italic*, `code`)" rows={4} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', resize: 'vertical' }} />)}
              {block.type === 'callout' && (<>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <select value={block.variant} onChange={(e) => updateBlock(index, { variant: e.target.value })} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '12px' }}>
                    <option value="insight">💡 Insight</option>
                    <option value="warning">⚡ Warning</option>
                    <option value="stat">📈 Stat</option>
                    <option value="tip">📖 Tip</option>
                  </select>
                  <input type="text" value={block.title} onChange={(e) => updateBlock(index, { title: e.target.value })} placeholder="Title" style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px' }} />
                </div>
                <textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })} placeholder="Callout content..." rows={3} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', resize: 'vertical' }} />
              </>)}
              {block.type === 'list' && (<div>
                {block.items.map((item, itemIndex) => (<div key={itemIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: '#a88b46', padding: '8px 0' }}>▸</span>
                  <input type="text" value={item} onChange={(e) => { const newItems = [...block.items]; newItems[itemIndex] = e.target.value; updateBlock(index, { items: newItems }); }} style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px' }} />
                  <button onClick={() => { const newItems = block.items.filter((_, i) => i !== itemIndex); updateBlock(index, { items: newItems.length ? newItems : [''] }); }} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}><X size={14} color="#ef4444" /></button>
                </div>))}
                <button onClick={() => updateBlock(index, { items: [...block.items, ''] })} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(168, 139, 70, 0.1)', border: '1px solid rgba(168, 139, 70, 0.3)', borderRadius: '6px', padding: '8px 12px', color: '#a88b46', fontSize: '12px', cursor: 'pointer' }}><Plus size={12} />Add Item</button>
              </div>)}
              {block.type === 'code' && (<>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input type="text" value={block.language} onChange={(e) => updateBlock(index, { language: e.target.value })} placeholder="Language" style={{ width: '120px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '12px' }} />
                  <input type="text" value={block.title} onChange={(e) => updateBlock(index, { title: e.target.value })} placeholder="Title" style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px' }} />
                </div>
                <textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })} placeholder="Code..." rows={6} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '13px', fontFamily: 'monospace', resize: 'vertical' }} />
              </>)}
              {block.type === 'quote' && (<>
                <textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })} placeholder="Quote text..." rows={3} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', fontStyle: 'italic', resize: 'vertical', marginBottom: '8px' }} />
                <input type="text" value={block.attribution || ''} onChange={(e) => updateBlock(index, { attribution: e.target.value })} placeholder="Attribution (optional)" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px' }} />
              </>)}
              {block.type === 'image' && (<>
                <input type="text" value={block.src || ''} onChange={(e) => updateBlock(index, { src: e.target.value })} placeholder="Image URL..." style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '13px', marginBottom: '8px' }} />
                <input type="text" value={block.alt || ''} onChange={(e) => updateBlock(index, { alt: e.target.value })} placeholder="Alt text..." style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px', marginBottom: '8px' }} />
                <input type="text" value={block.caption || ''} onChange={(e) => updateBlock(index, { caption: e.target.value })} placeholder="Caption (optional)..." style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '13px' }} />
                {block.src && <img src={block.src} alt={block.alt || ''} style={{ marginTop: '12px', maxWidth: '100%', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />}
              </>)}
              {block.type === 'data-viz' && (<>
                <input type="text" value={block.title} onChange={(e) => updateBlock(index, { title: e.target.value })} placeholder="Chart title..." style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', marginBottom: '12px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {block.data.labels.map((label, labelIndex) => (<div key={labelIndex} style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={label} onChange={(e) => { const newLabels = [...block.data.labels]; newLabels[labelIndex] = e.target.value; updateBlock(index, { data: { ...block.data, labels: newLabels } }); }} placeholder="Label" style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px', color: '#fff', fontSize: '12px' }} />
                    <input type="number" value={block.data.values[labelIndex]} onChange={(e) => { const newValues = [...block.data.values]; newValues[labelIndex] = parseFloat(e.target.value) || 0; updateBlock(index, { data: { ...block.data, values: newValues } }); }} style={{ width: '80px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px', color: '#fff', fontSize: '12px' }} />
                    <button onClick={() => { const newLabels = block.data.labels.filter((_, i) => i !== labelIndex); const newValues = block.data.values.filter((_, i) => i !== labelIndex); updateBlock(index, { data: { labels: newLabels.length ? newLabels : ['A'], values: newValues.length ? newValues : [0] } }); }} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}><X size={12} color="#ef4444" /></button>
                  </div>))}
                </div>
                <button onClick={() => updateBlock(index, { data: { labels: [...block.data.labels, 'New'], values: [...block.data.values, 0] } })} style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(168, 139, 70, 0.1)', border: '1px solid rgba(168, 139, 70, 0.3)', borderRadius: '6px', padding: '8px 12px', color: '#a88b46', fontSize: '12px', cursor: 'pointer' }}><Plus size={12} />Add Data Point</button>
              </>)}
            </div>
          )}
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
                background: 'linear-gradient(135deg, rgba(168, 139, 70, 0.2) 0%, rgba(168, 139, 70, 0.1) 100%)', 
                border: '1px solid rgba(168, 139, 70, 0.3)', 
                borderRadius: '8px', 
                padding: '10px 16px', 
                color: '#a88b46', 
                fontSize: '13px', 
                fontWeight: '600', 
                cursor: 'pointer' 
              }}
            >
              <ClipboardPaste size={14} />
              Paste from Notion
            </button>
          </div>

          {editorArticle.blocks.length === 0 ? (
            <div className="glass-card" style={{ borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
              <FileText size={32} color="rgba(255,255,255,0.2)" style={{ marginBottom: '12px' }} />
              <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>No content blocks yet. Add blocks from the sidebar or paste from Notion.</p>
            </div>
          ) : (
            editorArticle.blocks.map((block, index) => (<BlockEditor key={index} block={block} index={index} />))
          )}
        </div>

        <div>
          <div className="glass-card" style={{ borderRadius: '12px', padding: '20px', position: 'sticky', top: '20px' }}>
            <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={14} color="#a88b46" />Add Block</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {blockTypes.map(({ type, icon: Icon, label }) => (
                <button key={type} onClick={() => addBlock(type)} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '12px', cursor: 'pointer', textAlign: 'left' }}>
                  <Icon size={14} color="#a88b46" />{label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modals are now rendered inline in the return statement to prevent focus loss

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', position: 'relative', overflow: 'hidden' }}>
      {/* Login Modal - Inline JSX to prevent focus loss */}
      {showLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', margin: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}><Fish size={40} color="#a88b46" style={{ marginBottom: '12px' }} /><h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0 }}>Admin Login</h2><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '8px' }}>Sign in to manage articles</p></div>
            {loginError && (<div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#ef4444', fontSize: '13px' }}>{loginError}</div>)}
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Email</label><input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} /></div>
              <div style={{ marginBottom: '24px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Password</label><input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} /></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => { setShowLogin(false); setLoginError(''); }} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loginLoading} style={{ flex: 1, background: loginLoading ? 'rgba(168, 139, 70, 0.5)' : 'linear-gradient(135deg, #a88b46 0%, #E09A30 100%)', border: 'none', borderRadius: '8px', padding: '12px', color: '#0a0a0a', fontSize: '14px', fontWeight: '600', cursor: loginLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>{loginLoading ? (<><Loader size={14} className="spin" />Signing in...</>) : 'Sign In'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirm Modal - Inline JSX */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', margin: '20px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><Trash2 size={28} color="#ef4444" /></div>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Delete Article?</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.5 }}>This will permanently delete "<strong style={{ color: '#fff' }}>{showDeleteConfirm.title}</strong>". This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => deleteArticle(showDeleteConfirm.id)} disabled={deleting} style={{ flex: 1, background: deleting ? 'rgba(239, 68, 68, 0.3)' : '#ef4444', border: 'none', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: deleting ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>{deleting ? (<><Loader size={14} className="spin" />Deleting...</>) : (<><Trash2 size={14} />Delete</>)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notion Paste Modal - Inline JSX */}
      {showNotionPaste && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '600px', margin: '20px', border: '1px solid rgba(168, 139, 70, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 139, 70, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ClipboardPaste size={24} color="#a88b46" /></div>
              <div><h2 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Paste from Notion</h2><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '4px 0 0' }}>Copy content from Notion and paste it here. Images can be pasted directly!</p></div>
            </div>
            
            {uploadingImages && (
              <div style={{ background: 'rgba(168, 139, 70, 0.1)', border: '1px solid rgba(168, 139, 70, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Loader size={16} color="#a88b46" className="spin" />
                <span style={{ color: '#a88b46', fontSize: '13px' }}>Uploading images...</span>
              </div>
            )}
            
            {uploadedImages.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase' }}>Uploaded Images ({uploadedImages.length})</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {uploadedImages.map((url, i) => (
                    <img key={i} src={url} alt={`Uploaded ${i + 1}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                  ))}
                </div>
              </div>
            )}
            
            <textarea 
              ref={notionTextareaRef}
              onPaste={handlePasteWithImages}
              onChange={(e) => {
                textareaContentRef.current = e.target.value;
              }}
              placeholder="Paste your Notion content here...

Supported formats:
• Headers (# ## ###)
• Paragraphs
• Bullet and numbered lists
• Code blocks (\`\`\`)
• Blockquotes (>)
• Images (paste directly or include URLs)
• Callouts (:::tip, :::warning, etc.)"
              rows={12}
              style={{ 
                width: '100%', 
                background: 'rgba(0,0,0,0.3)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px', 
                padding: '16px', 
                color: '#fff', 
                fontSize: '14px', 
                resize: 'vertical',
                fontFamily: 'monospace',
                lineHeight: 1.6,
                marginBottom: '24px'
              }} 
            />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => { 
                  setShowNotionPaste(false); 
                  if (notionTextareaRef.current) notionTextareaRef.current.value = '';
                  textareaContentRef.current = '';
                  setUploadedImages([]);
                }} 
                style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleNotionPaste}
                disabled={uploadingImages}
                style={{ 
                  flex: 1, 
                  background: uploadingImages ? 'rgba(168, 139, 70, 0.3)' : 'linear-gradient(135deg, #a88b46 0%, #E09A30 100%)', 
                  border: 'none', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  color: uploadingImages ? 'rgba(255,255,255,0.5)' : '#0a0a0a', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: uploadingImages ? 'not-allowed' : 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px' 
                }}
              >
                <ClipboardPaste size={14} />
                Import Content
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Schedule Modal - Inline JSX */}
      {showScheduleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', margin: '20px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}><Calendar size={32} color="#60a5fa" style={{ marginBottom: '12px' }} /><h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>Schedule Article</h3><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '8px' }}>Set when this article should go live</p></div>
            <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Date</label><input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} /></div>
            <div style={{ marginBottom: '24px' }}><label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginBottom: '6px', textTransform: 'uppercase' }}>Time</label><input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px 16px', color: '#fff', fontSize: '14px' }} /></div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setShowScheduleModal(false); setScheduleDate(''); setScheduleTime(''); }} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '12px', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => scheduleArticle()} disabled={!scheduleDate || !scheduleTime || saving} style={{ flex: 1, background: (!scheduleDate || !scheduleTime || saving) ? 'rgba(59, 130, 246, 0.3)' : '#3b82f6', border: 'none', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: (!scheduleDate || !scheduleTime || saving) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>{saving ? (<><Loader size={14} className="spin" />Scheduling...</>) : (<><Calendar size={14} />Schedule</>)}</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Noise/Grain Texture Overlay */}
      <div 
        className="noise-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0.03
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        
        html, body { scroll-behavior: smooth; overflow-x: hidden; }
        
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        
        /* Gold Sparkborder Effect */
        @keyframes traceBorder { 0% { offset-distance: 0%; } 100% { offset-distance: 100%; } }
        
        .spark-border-gold { 
          position: relative; 
          overflow: hidden; 
          border-radius: 24px; 
          background: rgba(18, 18, 18, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .spark-border-gold::before { 
          content: ""; 
          position: absolute; 
          inset: 0; 
          border-radius: inherit; 
          padding: 1px; 
          background: linear-gradient(135deg, rgba(168, 139, 70, 0.5), rgba(168, 139, 70, 0.15)); 
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); 
          -webkit-mask-composite: xor; 
          mask-composite: exclude; 
          z-index: 1; 
          pointer-events: none; 
        }
        .spark-border-gold::after { 
          content: ""; 
          position: absolute; 
          top: 0; 
          left: 0; 
          width: 80px; 
          height: 2px; 
          background: linear-gradient(90deg, transparent 0%, #a88b46 50%, #a88b46 100%); 
          box-shadow: 0 0 15px 2px rgba(168, 139, 70, 0.6); 
          offset-path: rect(0 100% 100% 0 round 24px); 
          animation: traceBorder 6s linear infinite; 
          z-index: 2; 
          pointer-events: none; 
        }
        
        /* Glassmorphism Card with Gold Border */
        .glass-card-gold { 
          background: rgba(18, 18, 18, 0.5); 
          backdrop-filter: blur(16px); 
          -webkit-backdrop-filter: blur(16px); 
          border: 1px solid rgba(168, 139, 70, 0.2);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .glass-card-gold::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 0%, rgba(168, 139, 70, 0.08) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          border-radius: inherit;
        }
        .glass-card-gold:hover { 
          transform: translateY(-6px); 
          border-color: rgba(168, 139, 70, 0.4); 
          box-shadow: 0 24px 64px rgba(0,0,0,0.4), 0 0 40px rgba(168, 139, 70, 0.08); 
        }
        .glass-card-gold:hover::before {
          opacity: 1;
        }
        
        /* Legacy glass-card for modals */
        .glass-card { background: rgba(20, 20, 20, 0.6); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(168, 139, 70, 0.15); }
        
        .btn-hover { transition: all 0.3s ease; }
        .btn-hover:hover:not(:disabled) { transform: translateY(-2px); }
        
        /* Minimalist Category Filters */
        .filter-text { 
          padding: 10px 18px; 
          font-size: 13px; 
          font-weight: 500; 
          cursor: pointer; 
          transition: all 0.3s ease; 
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          position: relative;
          border-radius: 8px;
        }
        .filter-text::after {
          content: '';
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: #a88b46;
          transition: width 0.3s ease;
          border-radius: 1px;
        }
        .filter-text.active { 
          color: #a88b46;
          text-shadow: 0 0 20px rgba(168, 139, 70, 0.5);
        }
        .filter-text.active::after {
          width: 50%;
        }
        .filter-text:not(.active):hover { 
          color: rgba(255, 255, 255, 0.8);
          background: rgba(168, 139, 70, 0.05);
        }
        
        select option { background: #1a1a1a; color: #fff; }

        /* === DEPTH-OF-FIELD BOKEH ANIMATIONS === */
        @keyframes peripheralWobble1 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          15% { transform: translate(3px, -5px) rotate(2deg) scale(1.01); }
          30% { transform: translate(6px, -3px) rotate(4deg) scale(0.99); }
          45% { transform: translate(4px, -8px) rotate(6deg) scale(1.02); }
          60% { transform: translate(2px, -4px) rotate(3deg) scale(0.98); }
          75% { transform: translate(5px, -6px) rotate(5deg) scale(1.01); }
          90% { transform: translate(1px, -2px) rotate(1deg) scale(1); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        @keyframes peripheralWobble2 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          20% { transform: translate(-4px, -6px) rotate(-3deg) scale(1.02); }
          40% { transform: translate(-2px, -10px) rotate(-5deg) scale(0.98); }
          60% { transform: translate(-6px, -4px) rotate(-2deg) scale(1.01); }
          80% { transform: translate(-3px, -7px) rotate(-4deg) scale(0.99); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        @keyframes foregroundDrift1 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          20% { transform: translate(8px, -12px) rotate(8deg) scale(1.02); }
          40% { transform: translate(15px, -8px) rotate(15deg) scale(0.98); }
          60% { transform: translate(10px, -18px) rotate(22deg) scale(1.01); }
          80% { transform: translate(5px, -5px) rotate(12deg) scale(0.99); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        @keyframes foregroundDrift2 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(-10px, -15px) rotate(-12deg) scale(1.03); }
          50% { transform: translate(-5px, -25px) rotate(-20deg) scale(0.97); }
          75% { transform: translate(-12px, -10px) rotate(-8deg) scale(1.02); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        @keyframes foregroundDrift3 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          30% { transform: translate(12px, -20px) rotate(18deg) scale(0.98); }
          60% { transform: translate(6px, -10px) rotate(10deg) scale(1.02); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        @keyframes midgroundDrift1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(20px, -30px) rotate(25deg); }
          40% { transform: translate(35px, -20px) rotate(50deg); }
          60% { transform: translate(25px, -40px) rotate(75deg); }
          80% { transform: translate(10px, -15px) rotate(55deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes midgroundDrift2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-25px, -35px) rotate(-40deg); }
          50% { transform: translate(-15px, -50px) rotate(-80deg); }
          75% { transform: translate(-30px, -25px) rotate(-50deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes midgroundDrift3 {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -25px) rotate(60deg); }
          66% { transform: translate(15px, -45px) rotate(120deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes backgroundDart1 {
          0% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(25px, -40px) rotate(45deg); }
          25% { transform: translate(50px, -25px) rotate(90deg); }
          40% { transform: translate(35px, -60px) rotate(150deg); }
          55% { transform: translate(60px, -35px) rotate(200deg); }
          70% { transform: translate(40px, -55px) rotate(270deg); }
          85% { transform: translate(20px, -30px) rotate(320deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes backgroundDart2 {
          0% { transform: translate(0, 0) rotate(0deg); }
          15% { transform: translate(-35px, -50px) rotate(-60deg); }
          30% { transform: translate(-20px, -30px) rotate(-120deg); }
          50% { transform: translate(-50px, -45px) rotate(-180deg); }
          70% { transform: translate(-30px, -60px) rotate(-250deg); }
          85% { transform: translate(-15px, -25px) rotate(-310deg); }
          100% { transform: translate(0, 0) rotate(-360deg); }
        }
      `}</style>

      {/* ==================== BACKGROUND GLOWS ==================== */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-8%', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 139, 70, 0.08) 0%, transparent 60%)', filter: 'blur(80px)', opacity: 0.6 }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-12%', width: '1000px', height: '1000px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 139, 70, 0.06) 0%, transparent 55%)', filter: 'blur(100px)', opacity: 0.5 }} />
        <div style={{ position: 'absolute', top: '40%', right: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 139, 70, 0.05) 0%, transparent 50%)', filter: 'blur(60px)', opacity: 0.4 }} />
      </div>

      {/* ==================== PERIPHERAL BOKEH NACHOS ==================== */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '5%', left: '-8%', width: '180px', height: '180px', opacity: 0.06, filter: 'blur(18px)', animation: 'peripheralWobble1 120s ease-in-out infinite' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '40%', left: '-12%', width: '220px', height: '220px', opacity: 0.05, filter: 'blur(22px)', animation: 'peripheralWobble2 140s ease-in-out infinite', animationDelay: '-40s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '10%', left: '-6%', width: '160px', height: '160px', opacity: 0.07, filter: 'blur(16px)', animation: 'peripheralWobble1 100s ease-in-out infinite', animationDelay: '-70s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '8%', right: '-10%', width: '200px', height: '200px', opacity: 0.05, filter: 'blur(20px)', animation: 'peripheralWobble2 130s ease-in-out infinite', animationDelay: '-20s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '50%', right: '-14%', width: '240px', height: '240px', opacity: 0.04, filter: 'blur(24px)', animation: 'peripheralWobble1 150s ease-in-out infinite', animationDelay: '-60s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '15%', right: '-8%', width: '170px', height: '170px', opacity: 0.06, filter: 'blur(17px)', animation: 'peripheralWobble2 110s ease-in-out infinite', animationDelay: '-90s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
      </div>

      {/* ==================== FOREGROUND BOKEH NACHOS ==================== */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '5%', left: '3%', width: '90px', height: '90px', opacity: 0.12, filter: 'blur(12px)', animation: 'foregroundDrift1 80s ease-in-out infinite' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '110px', height: '110px', opacity: 0.10, filter: 'blur(14px)', animation: 'foregroundDrift2 90s ease-in-out infinite', animationDelay: '-30s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '45%', left: '-2%', width: '80px', height: '80px', opacity: 0.08, filter: 'blur(10px)', animation: 'foregroundDrift3 70s ease-in-out infinite', animationDelay: '-45s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '15%', right: '8%', width: '70px', height: '70px', opacity: 0.09, filter: 'blur(11px)', animation: 'foregroundDrift1 85s ease-in-out infinite', animationDelay: '-60s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
      </div>

      {/* ==================== MIDGROUND BOKEH NACHOS ==================== */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: '40px', height: '40px', opacity: 0.18, filter: 'blur(4px)', animation: 'midgroundDrift1 45s ease-in-out infinite' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '60%', right: '20%', width: '35px', height: '35px', opacity: 0.16, filter: 'blur(5px)', animation: 'midgroundDrift2 50s ease-in-out infinite', animationDelay: '-15s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '30%', left: '8%', width: '45px', height: '45px', opacity: 0.15, filter: 'blur(4px)', animation: 'midgroundDrift3 55s ease-in-out infinite', animationDelay: '-25s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '35%', right: '12%', width: '38px', height: '38px', opacity: 0.14, filter: 'blur(3px)', animation: 'midgroundDrift1 48s ease-in-out infinite', animationDelay: '-35s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '75%', left: '25%', width: '32px', height: '32px', opacity: 0.17, filter: 'blur(4px)', animation: 'midgroundDrift2 42s ease-in-out infinite', animationDelay: '-40s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '10%', left: '55%', width: '42px', height: '42px', opacity: 0.13, filter: 'blur(4px)', animation: 'midgroundDrift3 52s ease-in-out infinite', animationDelay: '-50s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
      </div>

      {/* ==================== BACKGROUND (FOCAL) BOKEH NACHOS ==================== */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 3, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '25%', left: '20%', width: '18px', height: '18px', opacity: 0.35, filter: 'blur(0.5px)', animation: 'backgroundDart1 25s linear infinite' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '55%', right: '25%', width: '15px', height: '15px', opacity: 0.30, filter: 'blur(0.5px)', animation: 'backgroundDart2 28s linear infinite', animationDelay: '-8s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '35%', left: '35%', width: '20px', height: '20px', opacity: 0.28, filter: 'blur(0.5px)', animation: 'backgroundDart1 22s linear infinite', animationDelay: '-12s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '40%', right: '35%', width: '16px', height: '16px', opacity: 0.32, filter: 'blur(0.5px)', animation: 'backgroundDart2 30s linear infinite', animationDelay: '-18s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', top: '15%', left: '45%', width: '14px', height: '14px', opacity: 0.25, filter: 'blur(0.5px)', animation: 'backgroundDart1 26s linear infinite', animationDelay: '-5s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
        <div style={{ position: 'absolute', bottom: '20%', right: '40%', width: '17px', height: '17px', opacity: 0.27, filter: 'blur(0.5px)', animation: 'backgroundDart2 24s linear infinite', animationDelay: '-15s' }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}><polygon points="50,5 95,95 5,95" fill="#a88b46" /></svg>
        </div>
      </div>

      <div style={{position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '20px'}}>
        <NachosPokerNavBar />
        
        {/* ==================== HERO CTA BAR WITH SPARKBORDER ==================== */}
        <div className="spark-border-gold" style={{ marginBottom: '30px', padding: '32px 40px', animation: 'fadeInUp 0.6s ease-out', display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 36px)', 
              fontWeight: '800', 
              color: '#FFFFFF', 
              marginBottom: '12px', 
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              fontFamily: 'Manrope, Inter, sans-serif'
            }}>
              {view === 'editor' ? (isEditing ? 'Edit Article' : 'New Article') : (<>Knowledge <span style={{ color: '#a88b46' }}>Hub</span></>)}
            </h2>
            <p style={{fontSize: '15px', color: 'rgba(255,255,255,0.55)', marginBottom: '0', lineHeight: 1.6}}>
              {view === 'editor' ? 'Construct data driven articles with precision.' : 'Technical deep dives into poker strategy, solver analysis, and population exploits.'}
            </p>
          </div>
          <div style={{display: 'flex', gap: '12px', flexShrink: 0, flexWrap: 'wrap'}}>
            <a href="https://www.nachospoker.com/" target="_blank" rel="noopener noreferrer" className="btn-hover" style={{ 
              background: '#a88b46', 
              color: '#0a0a0a', 
              padding: '14px 24px', 
              borderRadius: '12px', 
              fontWeight: '600', 
              fontSize: '14px', 
              textDecoration: 'none', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              boxShadow: '0 4px 20px rgba(168, 139, 70, 0.3)'
            }}>Join Our CFP <ExternalLink size={14} /></a>
            <a href="https://calendly.com/patrickgerritsen90/30min" target="_blank" rel="noopener noreferrer" className="btn-hover" style={{ 
              background: 'transparent', 
              border: '1.5px solid #a88b46', 
              color: '#a88b46', 
              padding: '14px 24px', 
              borderRadius: '12px', 
              fontWeight: '600', 
              fontSize: '14px', 
              textDecoration: 'none', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>Private Coaching <ExternalLink size={14} /></a>
          </div>
        </div>

        {/* ==================== TOOLBAR BAR ==================== */}
        <div className="glass-card" style={{ borderRadius: '16px', padding: '16px 24px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {view !== 'library' && (<button onClick={() => { setView('library'); setSelectedArticle(null); setEditorArticle(null); }} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '10px', padding: '10px 16px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}><ChevronLeft size={16} />Back to Library</button>)}
            {view === 'library' && (<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BookOpen size={18} color="#a88b46" /><span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500' }}>{loading ? 'Loading...' : `${filteredArticles.length} Article${filteredArticles.length !== 1 ? 's' : ''}`}</span></div>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user ? (<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{user.email}</span><button onClick={handleLogout} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', padding: '8px 12px', color: 'rgba(255,255,255,0.6)', fontSize: '12px', cursor: 'pointer' }}><LogOut size={14} /></button></div>) : (<button onClick={() => setShowLogin(true)} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '10px', padding: '10px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}><LogIn size={14} />Admin</button>)}
            {view === 'editor' && user && (<>
              <button onClick={() => { setView('library'); setEditorArticle(null); }} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '10px 16px', color: '#ef4444', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}><X size={14} />Cancel</button>
              
              {/* Newsletter Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '10px 16px', background: sendNewsletter ? 'rgba(168, 139, 70, 0.15)' : 'rgba(255,255,255,0.05)', border: sendNewsletter ? '1px solid rgba(168, 139, 70, 0.4)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', transition: 'all 0.2s ease' }}>
                <input 
                  type="checkbox" 
                  checked={sendNewsletter} 
                  onChange={(e) => setSendNewsletter(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#a88b46', cursor: 'pointer' }}
                />
                <Mail size={14} color={sendNewsletter ? '#a88b46' : 'rgba(255,255,255,0.5)'} />
                <span style={{ color: sendNewsletter ? '#a88b46' : 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: '500' }}>Newsletter</span>
              </label>
              
              <button onClick={() => saveArticle(false)} disabled={!editorArticle?.title || saving} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 16px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '500', cursor: !editorArticle?.title || saving ? 'not-allowed' : 'pointer', opacity: !editorArticle?.title ? 0.5 : 1 }}><EyeOff size={14} />Save Draft</button>
              <button onClick={() => setShowScheduleModal(true)} disabled={!editorArticle?.title || saving} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', padding: '10px 16px', color: '#60a5fa', fontSize: '13px', fontWeight: '500', cursor: !editorArticle?.title || saving ? 'not-allowed' : 'pointer', opacity: !editorArticle?.title ? 0.5 : 1 }}><Calendar size={14} />Schedule</button>
              <button onClick={() => saveArticle(true)} disabled={!editorArticle?.title || saving} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: !editorArticle?.title || saving ? 'rgba(34, 197, 94, 0.3)' : '#22c55e', border: 'none', borderRadius: '10px', padding: '10px 20px', color: !editorArticle?.title || saving ? 'rgba(255,255,255,0.4)' : '#0a0a0a', fontSize: '13px', fontWeight: '600', cursor: !editorArticle?.title || saving ? 'not-allowed' : 'pointer' }}>{saving ? (<><Loader size={14} className="spin" />Saving...</>) : (<><Globe size={14} />Publish</>)}</button>
            </>)}
            {view !== 'editor' && user && (<button onClick={() => openEditor()} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#a88b46', border: 'none', borderRadius: '10px', padding: '10px 20px', color: '#0a0a0a', fontSize: '13px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 20px rgba(168, 139, 70, 0.3)' }}><Edit3 size={14} />New Article</button>)}
          </div>
        </div>

        {error && (<div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}><AlertTriangle size={20} color="#ef4444" /><span style={{ color: '#ef4444', fontSize: '14px', flex: 1 }}>{error}</span><button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={16} color="#ef4444" /></button></div>)}

        {view === 'library' && (<>
          {/* ==================== MINIMALIST CATEGORY FILTERS ==================== */}
          <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className={`filter-text ${selectedCategory === cat ? 'active' : ''}`} 
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div className="glass-card" style={{ borderRadius: '20px', padding: '60px 40px', textAlign: 'center' }}>
              <Loader size={32} color="#a88b46" className="spin" style={{ marginBottom: '16px' }} />
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Loading articles...</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredArticles.map((article) => (<ArticleCard key={article.id} article={article} onClick={openArticle} />))}
            </div>
          )}
          {!loading && filteredArticles.length === 0 && (
            <div className="glass-card" style={{ borderRadius: '20px', padding: '60px 40px', textAlign: 'center' }}>
              <BookOpen size={48} color="rgba(168, 139, 70, 0.3)" style={{ marginBottom: '16px' }} />
              <h3 style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>No Articles Found</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>{selectedCategory === 'All' ? 'No articles yet. Create your first one.' : `No articles in "${selectedCategory}" yet.`}</p>
            </div>
          )}
        </>)}

        {view === 'reader' && selectedArticle && (
          <div className="glass-card" style={{ borderRadius: '20px', padding: '48px' }}>
            <ArticleRenderer article={selectedArticle} />
            <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(168, 139, 70, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(168, 139, 70, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Fish size={20} color="#a88b46" />
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>Freenachos</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Poker Strategy and Coaching</div>
                </div>
              </div>
              {user && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowDeleteConfirm(selectedArticle)} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '10px 16px', color: '#ef4444', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}><Trash2 size={14} />Delete</button>
                  <button onClick={() => openEditor(selectedArticle)} className="btn-hover" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 16px', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}><Edit3 size={14} />Edit Article</button>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'editor' && (<ArticleEditor />)}
      </div>
    </div>
  );
}
