import React, { useState, useEffect } from 'react';

const Loader = () => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0); // Keep track of active requests

  useEffect(() => {
    const show = () => setCount(c => c + 1);
    const hide = () => setCount(c => Math.max(0, c - 1));

    window.addEventListener('loading-start', show);
    window.addEventListener('loading-end', hide);

    return () => {
      window.removeEventListener('loading-start', show);
      window.removeEventListener('loading-end', hide);
    };
  }, []);

  useEffect(() => {
    if (count > 0) setLoading(true);
    else {
      // Small delay to prevent flickering
      const timer = setTimeout(() => setLoading(false), 200);
      return () => clearTimeout(timer);
    }
  }, [count]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-2xl shadow-lg flex flex-col items-center animate-bounce-slight">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-slate-700 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
