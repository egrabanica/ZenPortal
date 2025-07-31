'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { StorageService } from '@/lib/storage';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';

export default function StorageTest() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const { toast } = useToast();
  const supabase = createClientComponentClient<Database>();

  const addResult = (message: string) => {
    console.log(message);
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    addResult('Testing Supabase connection...');
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        addResult(`❌ Auth error: ${error.message}`);
      } else {
        addResult(`✅ Connected as: ${data.user?.email || 'Anonymous'}`);
      }
    } catch (error: any) {
      addResult(`❌ Connection failed: ${error.message}`);
    }
  };

  const testBucket = async () => {
    addResult('Testing media bucket...');
    try {
      const bucketExists = await StorageService.checkBucketExists('media');
      if (bucketExists) {
        addResult('✅ Media bucket exists and is accessible');
        
        // Test listing files
        const { data, error } = await supabase.storage.from('media').list('', { limit: 1 });
        if (error) {
          addResult(`❌ Cannot list files in bucket: ${error.message}`);
        } else {
          addResult(`✅ Can list files in bucket (${data?.length || 0} items)`);
        }
      } else {
        addResult('❌ Media bucket does not exist or is not accessible');
      }
    } catch (error: any) {
      addResult(`❌ Bucket test failed: ${error.message}`);
    }
  };

  const testPermissions = async () => {
    addResult('Testing storage permissions...');
    try {
      const { data, error } = await supabase.storage.from('media').list('test/', { limit: 1 });
      if (error) {
        addResult(`❌ Storage permissions error: ${error.message}`);
        if (error.message.includes('new row violates row-level security')) {
          addResult('💡 This might be a Row Level Security (RLS) policy issue');
        }
      } else {
        addResult('✅ Storage permissions OK');
      }
    } catch (error: any) {
      addResult(`❌ Permission test failed: ${error.message}`);
    }
  };

  const testUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to test upload',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    addResult(`Starting upload test for: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    try {
      // Test direct Supabase upload first
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      const testFileName = `test-${Date.now()}.${fileExt}`;
      const testPath = `test/${testFileName}`;
      
      addResult('Testing direct Supabase upload...');
      const { data, error } = await supabase.storage
        .from('media')
        .upload(testPath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        addResult(`❌ Direct upload failed: ${error.message}`);
        if (error.message.includes('The resource already exists')) {
          addResult('💡 File already exists, trying with upsert...');
          const { data: data2, error: error2 } = await supabase.storage
            .from('media')
            .upload(testPath, file, {
              cacheControl: '3600',
              upsert: true
            });
          
          if (error2) {
            addResult(`❌ Upsert upload failed: ${error2.message}`);
          } else {
            addResult('✅ Direct upload successful with upsert');
            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data2.path);
            setUploadUrl(publicUrl);
            addResult(`📎 Public URL: ${publicUrl}`);
          }
        }
      } else {
        addResult('✅ Direct upload successful');
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path);
        setUploadUrl(publicUrl);
        addResult(`📎 Public URL: ${publicUrl}`);
      }

      // Now test via StorageService
      addResult('Testing via StorageService...');
      try {
        const serviceUrl = await StorageService.uploadFile(file);
        addResult(`✅ StorageService upload successful: ${serviceUrl}`);
        setUploadUrl(serviceUrl);
      } catch (serviceError: any) {
        addResult(`❌ StorageService upload failed: ${serviceError.message}`);
      }

    } catch (error: any) {
      addResult(`❌ Upload test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    await testConnection();
    await testBucket();
    await testPermissions();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Storage Upload Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button onClick={runAllTests} className="w-full">
                Run Connection & Permission Tests
              </Button>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Select a video file to test:</label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
              
              <Button 
                onClick={testUpload} 
                disabled={!file || loading}
                className="w-full"
              >
                {loading ? 'Testing Upload...' : 'Test File Upload'}
              </Button>
            </div>

            {uploadUrl && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Result:</label>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Upload successful! URL: 
                    <a href={uploadUrl} target="_blank" rel="noopener noreferrer" className="underline ml-1">
                      {uploadUrl}
                    </a>
                  </p>
                  {file?.type.startsWith('video/') && (
                    <video src={uploadUrl} controls className="mt-2 max-w-full max-h-64" />
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Test Results:</label>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-sm text-gray-500">No tests run yet</p>
                ) : (
                  <div className="space-y-1">
                    {testResults.map((result, index) => (
                      <p key={index} className="text-sm font-mono">
                        {result}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
