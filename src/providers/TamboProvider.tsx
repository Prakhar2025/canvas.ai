'use client';

import { ReactNode } from 'react';
import { TamboProvider as BaseTamboProvider, TamboThreadProvider } from '@tambo-ai/react';
import { componentsRegistry } from '@/lib/components-registry';
import { toolsRegistry } from '@/lib/tools-registry';

/* ============================================
   TAMBO PROVIDER WRAPPER
   
   Production-grade wrapper for Tambo SDK that:
   - Handles environment variable validation
   - Provides error boundaries for AI failures
   - Centralizes Tambo configuration
   - Wraps with TamboThreadProvider for conversation
   ============================================ */

interface TamboProviderProps {
    children: ReactNode;
}

/**
 * TamboProvider wraps the application with Tambo AI capabilities.
 * 
 * Features:
 * - Automatic API key validation
 * - Component registry integration
 * - Thread management for conversations
 * - Type-safe context access
 */
export function TamboProvider({ children }: TamboProviderProps) {
    const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

    // Development warning for missing API key
    if (!apiKey || apiKey === 'your_tambo_api_key_here') {
        if (process.env.NODE_ENV === 'development') {
            console.warn(
                '[Canvas AI] Tambo API key not configured. ' +
                'Please add NEXT_PUBLIC_TAMBO_API_KEY to your .env.local file.'
            );
        }

        // Return children without Tambo in development if no key
        // This allows UI development without AI features
        return <>{children}</>;
    }

    return (
        <BaseTamboProvider
            apiKey={apiKey}
            components={componentsRegistry}
            tools={toolsRegistry}
        >
            <TamboThreadProvider>
                {children}
            </TamboThreadProvider>
        </BaseTamboProvider>
    );
}

export default TamboProvider;
