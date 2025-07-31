import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';
import { useState, useEffect } from 'react';

const supabase = createClientComponentClient<Database>();

export class AuthMiddleware {
  // Check if user is authenticated and has admin/editor role
  static async requireAuth(redirectPath?: string): Promise<{
    isAuthenticated: boolean;
    isAdmin: boolean;
    profile: any;
    redirectTo?: string;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          isAuthenticated: false,
          isAdmin: false,
          profile: null,
          redirectTo: redirectPath || '/admin/signin'
        };
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) {
        return {
          isAuthenticated: false,
          isAdmin: false,
          profile: null,
          redirectTo: redirectPath || '/admin/signin'
        };
      }

      const isAdmin = profile.role === 'admin' || profile.role === 'editor';

      return {
        isAuthenticated: true,
        isAdmin,
        profile,
        redirectTo: !isAdmin ? '/admin/signin' : undefined
      };
    } catch (error) {
      console.error('Auth middleware error:', error);
      return {
        isAuthenticated: false,
        isAdmin: false,
        profile: null,
        redirectTo: redirectPath || '/admin/signin'
      };
    }
  }

}
