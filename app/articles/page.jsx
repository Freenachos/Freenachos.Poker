import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// ARTICLES API
// ============================================

export const articlesApi = {
  // Fetch all published articles (public)
  // Only shows articles where scheduled_for is null OR in the past
  async getPublished() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .or('scheduled_for.is.null,scheduled_for.lte.now()')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Fetch ALL articles including drafts and scheduled (authenticated only)
  async getAll() {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Fetch single article by slug (respects scheduling for public)
  async getBySlug(slug, isAuthenticated = false) {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // If not authenticated, check if article should be visible
    if (!isAuthenticated && data) {
      const isScheduledForFuture = data.scheduled_for && new Date(data.scheduled_for) > new Date();
      if (!data.published || isScheduledForFuture) {
        throw new Error('Article not found');
      }
    }
    
    return data;
  },

  // Create new article
  async create(article) {
    const { data, error } = await supabase
      .from('articles')
      .insert([{
        title: article.title,
        slug: article.slug,
        category: article.category,
        excerpt: article.excerpt,
        read_time: article.readTime,
        thumbnail: article.thumbnail,
        thumbnail_url: article.thumbnailUrl || null,
        blocks: article.blocks,
        published: article.published || false,
        scheduled_for: article.scheduledFor || null
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update existing article
  async update(id, article) {
    const { data, error } = await supabase
      .from('articles')
      .update({
        title: article.title,
        slug: article.slug,
        category: article.category,
        excerpt: article.excerpt,
        read_time: article.readTime,
        thumbnail: article.thumbnail,
        thumbnail_url: article.thumbnailUrl || null,
        blocks: article.blocks,
        published: article.published,
        scheduled_for: article.scheduledFor || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete article
  async delete(id) {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// ============================================
// STORAGE API
// ============================================

export const storageApi = {
  // Upload image to Supabase Storage
  async uploadImage(file) {
    const fileExt = file.name?.split('.').pop() || 'png';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `articles/${fileName}`;

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  }
};

// ============================================
// AUTH API
// ============================================

export const authApi = {
  // Sign in with email/password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  // Listen for auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
