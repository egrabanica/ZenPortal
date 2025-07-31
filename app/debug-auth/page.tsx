'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService } from '@/lib/auth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

export default function DebugAuth() {
  const [authState, setAuthState] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  const checkAuthState = async () => {
    setLoading(true);
    try {
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Check user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Check profile
      let profile = null;
      let profileError = null;
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        profile = data;
        profileError = error;
      }
      
      // Check admin status
      let isAdmin = false;
      try {
        isAdmin = await AuthService.isAdmin();
      } catch (error) {
        console.error('Admin check failed:', error);
      }
      
      setAuthState({
        session: session ? {
          user: session.user,
          expires_at: session.expires_at,
          access_token: session.access_token ? 'Present' : 'Missing'
        } : null,
        sessionError,
        user: user ? {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        } : null,
        userError,
        profile,
        profileError,
        isAdmin
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      await checkAuthState();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking authentication state...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Debug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Button onClick={checkAuthState}>Refresh Auth State</Button>
              <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
              <Button onClick={clearStorage} variant="destructive">Clear Storage & Reload</Button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Current Authentication State:</h3>
              <pre className="text-sm overflow-auto max-h-96">
                {JSON.stringify(authState, null, 2)}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-2">Session Status</h4>
                  <p className={`text-sm ${authState?.session ? 'text-green-600' : 'text-red-600'}`}>
                    {authState?.session ? '✅ Active Session' : '❌ No Session'}
                  </p>
                  {authState?.sessionError && (
                    <p className="text-sm text-red-600 mt-1">
                      Error: {authState.sessionError.message}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-2">Admin Status</h4>
                  <p className={`text-sm ${authState?.isAdmin ? 'text-green-600' : 'text-red-600'}`}>
                    {authState?.isAdmin ? '✅ Admin Access' : '❌ No Admin Access'}
                  </p>
                  {authState?.profile && (
                    <p className="text-sm text-gray-600 mt-1">
                      Role: {authState.profile.role}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                If you're having login issues, try the following steps:
              </p>
              <ol className="text-sm text-left max-w-md mx-auto space-y-2">
                <li>1. Clear browser storage (button above)</li>
                <li>2. Check if you have an admin account created</li>
                <li>3. Verify your email and password</li>
                <li>4. Check the browser console for errors</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
