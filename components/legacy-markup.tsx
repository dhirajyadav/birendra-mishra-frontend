'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    SITE_CONFIG?: Record<string, any>;
    DemoAPI?: { manage: (input: Record<string, string>) => Promise<any> };
  }
}

type Props = { html: string; consultations?: unknown[]; scripts?: string[] };

export function LegacyMarkup({ html, consultations = [], scripts = [] }: Props) {
  useEffect(() => {
    let cancelled = false;
    const addScript = (src: string) => new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `/js/${src}`;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Could not load ${src}`));
      document.body.appendChild(script);
    });
    void (async () => {
      try {
        await addScript('config.js');
        if (cancelled) return;
        window.SITE_CONFIG = { ...(window.SITE_CONFIG || {}), consultations };
        for (const src of scripts) await addScript(src);
      } catch (error) {
        console.error('Page scripts failed to load', error);
      }
    })();
    return () => { cancelled = true; };
  }, [consultations, scripts]);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
