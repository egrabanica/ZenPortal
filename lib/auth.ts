import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database, Profile } from './database.types';

const supabase = createClientComponentClient<Database>();

export class AuthService {
  // Check if user is admin
  static async isAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      return profile?.role === 'admin' || profile?.role === 'editor';
    } catch (error) {
      return false;
    }
  }

  // Get current user profile
  static async getCurrentProfile(): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile;
    } catch (error) {
      return null;
    }
  }

  // Create admin profile after signup
  static async createAdminProfile(userId: string, email: string, fullName?: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: fullName || null,
        role: 'admin', // Set as admin by default for now
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Sign up admin user
  static async signUpAdmin(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    // Create admin profile
    if (data.user) {
      await this.createAdminProfile(data.user.id, email, fullName);
    }

    return data;
  }

  // Sign in user
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  // Sign out user
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Check authentication and admin status
  static async requireAdmin(): Promise<Profile> {
    const profile = await this.getCurrentProfile();
    
    if (!profile) {
      throw new Error('Not authenticated');
    }

    if (profile.role !== 'admin' && profile.role !== 'editor') {
      throw new Error('Insufficient permissions');
    }

    return profile;
  }

  // Update user profile
  static async updateProfile(updates: { full_name?: string; avatar_url?: string }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
