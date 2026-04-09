'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Zap, Shield, RefreshCw, AlertCircle, Globe } from 'lucide-react';

interface BackendStatus {
  message: string;
  serverID: string;
  timestamp: string;
  environment: string;
  rateLimit: string;
}

export default function Home() {
  const [status, setStatus] = useState<BackendStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/status');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch status');
      }

      setStatus(data);
      setRequestCount(prev => prev + 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <main className="min-h-screen mesh-gradient flex flex-col items-center justify-center p-6 sm:p-24">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-4xl"
      >
        <div className="text-center mb-12">
          <motion.h1
            className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            Rate Limiting Demo
          </motion.h1>
          <p className="text-gray-400 text-lg">Real-time local connection monitoring with built-in Rate Limiting</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Server Info Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass rounded-3xl p-8 flex flex-col relative overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                <Server size={24} />
              </div>
              <h2 className="text-2xl font-semibold">Active Backend</h2>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="h-6 w-3/4 bg-white/5 rounded animate-pulse" />
                  <div className="h-6 w-1/2 bg-white/5 rounded animate-pulse" />
                </motion.div>
              ) : status ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-gray-400">Server ID</span>
                    <span className="font-mono text-blue-400 font-medium">{status.serverID}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="text-gray-400">Environment</span>
                    <span className="text-purple-400">{status.environment}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status</span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Healthy
                    </span>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div className="flex flex-col items-center justify-center py-4 text-red-400">
                  <AlertCircle size={32} className="mb-2" />
                  <p>{error}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>

          {/* Rate Limiter Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass rounded-3xl p-8 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                <Shield size={24} />
              </div>
              <h2 className="text-2xl font-semibold">Security Shield</h2>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Rate Limit</span>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-medium">
                  {status?.rateLimit || '10 req/min'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Request Counter</span>
                  <span className="text-blue-400 font-mono">{requestCount} / 10</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((requestCount / 10) * 100, 100)}%` }}
                    className={`h-full ${requestCount >= 10 ? 'bg-red-500' : 'bg-blue-500'}`}
                  />
                </div>
              </div>

              {requestCount >= 10 && !error && (
                <p className="text-red-400 text-xs italic">
                  Next request may be throttled.
                </p>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchStatus}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            REFRESH CONNECTION
          </motion.button>
        </div>

        <div className="mt-16 text-center text-gray-500 text-sm">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              Frontend: Local
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              Backend: Local Node.js
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
