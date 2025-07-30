'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StorageTestUtils } from '@/lib/storage-test';

export default function StorageTestPage() {
  const [connectionResult, setConnectionResult] = useState<any>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    setConnectionResult(null);
    setUploadResult(null);

    const connectionRes = await StorageTestUtils.testStorageConnection();
    setConnectionResult(connectionRes);

    if (connectionRes.success) {
      const uploadRes = await StorageTestUtils.testFileUpload();
      setUploadResult(uploadRes);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Storage Diagnostics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button onClick={runTests} disabled={loading}>
              {loading ? 'Running Tests...' : 'Run Storage Tests'}
            </Button>

            {connectionResult && (
              <div className="p-4 rounded-md bg-gray-100 dark:bg-gray-800">
                <h3 className="font-semibold">Connection Test</h3>
                <p className={connectionResult.success ? 'text-green-500' : 'text-red-500'}>
                  {connectionResult.message}
                </p>
                {connectionResult.details && (
                  <pre className="mt-2 text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded">
                    {JSON.stringify(connectionResult.details, null, 2)}
                  </pre>
                )}
              </div>
            )}

            {uploadResult && (
              <div className="p-4 rounded-md bg-gray-100 dark:bg-gray-800">
                <h3 className="font-semibold">Upload Test</h3>
                <p className={uploadResult.success ? 'text-green-500' : 'text-red-500'}>
                  {uploadResult.message}
                </p>
                {uploadResult.url && (
                  <div className="mt-2">
                    <p>Uploaded to:</p>
                    <a href={uploadResult.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      {uploadResult.url}
                    </a>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
