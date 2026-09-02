import { createClient, SupabaseClient, Session, User as SupabaseUser, AuthChangeEvent } from '@supabase/supabase-js';

// Resolve Supabase environment variables defined in .env.example
const getEnvVar = (name: string, viteName?: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const metaEnv = (import.meta as any).env;
    if (viteName && metaEnv[viteName]) return metaEnv[viteName];
    if (metaEnv[name]) return metaEnv[name];
  }
  if (typeof process !== 'undefined' && process.env) {
    if (viteName && process.env[viteName]) return process.env[viteName];
    if (process.env[name]) return process.env[name];
  }
  if (typeof window !== 'undefined') {
    if ((window as any)[name]) return (window as any)[name];
    if (viteName && (window as any)[viteName]) return (window as any)[viteName];
  }
  return '';
};

export const SUPABASE_URL = getEnvVar('SUPABASE_URL', 'VITE_SUPABASE_URL');
export const SUPABASE_ANON_KEY = getEnvVar('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');

export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
};

// Singleton Supabase Client instance
let clientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (clientInstance) return clientInstance;
  if (!isSupabaseConfigured()) {
    return null;
  }
  clientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
  return clientInstance;
}

// Export pre-initialized client instance or fallback instance
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// =========================================================================
// SUPABASE AUTHENTICATION METHODS
// =========================================================================

/**
 * Sign up a new user with Email and Password in Supabase Auth
 */
export async function supabaseSignUp(
  email: string,
  password: string,
  metadata?: {
    fullName?: string;
    role?: string;
    memberId?: string;
    contactNumber?: string;
    barangay?: string;
    [key: string]: any;
  }
) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
  }

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: metadata || {},
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in existing user with Email and Password via Supabase Auth
 */
export async function supabaseSignIn(email: string, password: string) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in with third-party OAuth provider (e.g. Google, GitHub) via Supabase Auth
 */
export async function supabaseSignInWithOAuth(
  provider: 'google' | 'github' | 'facebook' | 'azure' | 'discord' = 'google',
  redirectTo?: string
) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY.');
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const targetRedirect = redirectTo || origin;

  const { data, error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: targetRedirect,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out current authenticated user from Supabase Auth
 */
export async function supabaseSignOut() {
  const client = getSupabase();
  if (!client) return;

  const { error } = await client.auth.signOut();
  if (error) throw error;
}

/**
 * Send password reset email via Supabase Auth
 */
export async function supabaseResetPassword(email: string, redirectTo?: string) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Supabase is not configured.');
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const { data, error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: redirectTo || `${origin}/reset-password`,
  });

  if (error) throw error;
  return data;
}

/**
 * Get the current Supabase session
 */
export async function supabaseGetSession(): Promise<Session | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client.auth.getSession();
  if (error) {
    console.error('Supabase getSession error:', error);
    return null;
  }
  return data.session;
}

/**
 * Get current Supabase user
 */
export async function supabaseGetUser(): Promise<SupabaseUser | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client.auth.getUser();
  if (error) {
    return null;
  }
  return data.user;
}

/**
 * Subscribe to Supabase Auth state changes
 */
export function supabaseOnAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const client = getSupabase();
  if (!client) {
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  }

  return client.auth.onAuthStateChange(callback);
}

// =========================================================================
// SUPABASE DATABASE TABLES OPERATIONS
// =========================================================================

/**
 * Fetch all records from a Supabase table
 */
export async function supabaseFetchAll<T = any>(table: string): Promise<T[]> {
  const client = getSupabase();
  if (!client) return [];
  try {
    const { data, error } = await client.from(table).select('*');
    if (error) {
      console.warn(`Supabase select from ${table} error:`, error.message);
      return [];
    }
    return (data as T[]) || [];
  } catch (err) {
    console.warn(`Supabase fetch failed for ${table}:`, err);
    return [];
  }
}

/**
 * Upsert a record in a Supabase table
 */
export async function supabaseUpsert<T = any>(table: string, record: any): Promise<T | null> {
  const client = getSupabase();
  if (!client) return null;
  try {
    const { data, error } = await client.from(table).upsert(record).select().single();
    if (error) {
      console.warn(`Supabase upsert into ${table} error:`, error.message);
      return null;
    }
    return data as T;
  } catch (err) {
    console.warn(`Supabase upsert failed for ${table}:`, err);
    return null;
  }
}

/**
 * Delete a record from a Supabase table by ID
 */
export async function supabaseDelete(table: string, id: string): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;
  try {
    const { error } = await client.from(table).delete().eq('id', id);
    if (error) {
      console.warn(`Supabase delete from ${table} error:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`Supabase delete failed for ${table}:`, err);
    return false;
  }
}
