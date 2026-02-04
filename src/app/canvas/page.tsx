'use client';

import dynamic from 'next/dynamic';

const Canvas = dynamic(() => import('@/components/canvas/Canvas'), { ssr: false });

/* ============================================
   CANVAS PAGE
   
   The main workspace route for Canvas AI.
   This page renders the AI-powered generative
   workspace where users create components.
   ============================================ */

export default function CanvasPage() {
    return <Canvas />;
}
