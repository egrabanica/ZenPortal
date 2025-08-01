import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database, Profile } from './database.types';

export class AuthServerService {
  // Get server-side Supabase client
  static async getSupabaseClient() {
    const cookieStore = await cookies();
    return createRouteHandlerClient<Database>({ cookies: () => cookieStore });
  }

  // Check if user is admin (server-side)
  static async isAdmin(): Promise<boolean> {
    try {
      const supabase = await this.getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      return profile?.role === 'admin' || profile?.role === 'editor';
    } catch (error) {
      console.error('AuthServerService.isAdmin error:', error);
      return false;
    }
  }

  // Get current user profile (server-side)
  static async getCurrentProfile(): Promise<Profile | null> {
    try {
      const supabase = await this.getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile;
    } catch (error) {
      console.error('AuthServerService.getCurrentProfile error:', error);
      return null;
    }
  }

  // Check authentication and admin status (server-side)
  static async requireAdmin(): Promise<Profile> {
    const profile = await this.getCurrentProfile();
    
    if (!profile) {
      throw new Error('Admin access required - not authenticated');
    }

    if (profile.role !== 'admin' && profile.role !== 'editor') {
      throw new Error('Admin access required - insufficient permissions');
    }

    return profile;
  }

  // Get current user (server-side)
  static async getCurrentUser() {
    try {
      const supabase = await this.getSupabaseClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('AuthServerService.getCurrentUser error:', error);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('AuthServerService.getCurrentUser catch error:', error);
      return null;
    }
  }
}
