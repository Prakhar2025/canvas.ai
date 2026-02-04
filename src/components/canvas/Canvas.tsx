'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTamboThread, useTamboStreamStatus } from '@tambo-ai/react';
import { MessageSquare, Sparkles, User } from 'lucide-react';
import { CanvasHeader } from './CanvasHeader';
import { AnimatedBackground } from './AnimatedBackground';
import { CommandInput } from './CommandInput';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';

/* ============================================
   CANVAS WORKSPACE
   
   The main AI-powered workspace where users
   interact with Tambo to generate components.
   This is the core of Canvas AI.
   ============================================ */

/**
 * Helper function to extract text content from a message
 * Handles both string content and array content types
 */
function getMessageContent(content: unknown): string {
    if (typeof content === 'string') {
        return content;
    }
    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === 'string') return part;
                if (part && typeof part === 'object' && 'text' in part) {
                    return (part as { text: string }).text;
                }
                return '';
            })
            .join('');
    }
    return String(content || '');
}

export function Canvas() {
    const [projectName] = useState('Canvas AI');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Tambo thread hook for conversation
    const {
        thread,
        sendThreadMessage,
    } = useTamboThread();

    // Use stream status for real-time feedback
    const { streamStatus } = useTamboStreamStatus();

    // isLoading is true when AI is thinking or generating
    const isLoading = streamStatus.isPending || streamStatus.isStreaming;

    // Status message based on stream state
    const getStatusMessage = () => {
        if (streamStatus.isPending) return 'Thinking...';
        if (streamStatus.isStreaming) return 'Designing interface...';
        if (streamStatus.isSuccess) return 'Done';
        if (streamStatus.isError) return 'Error generating';
        return 'Idle';
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [thread?.messages, streamStatus]);

    // Send a message
    const handleSendMessage = useCallback(async (message: string) => {
        try {
            await sendThreadMessage(message);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }, [sendThreadMessage]);

    const messages = thread?.messages || [];

    return (
        <>
            <AnimatedBackground />
            <CanvasHeader projectName={projectName} />

            <main className="relative min-h-screen pt-20 pb-32">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    {/* Messages Area */}
                    <div className="space-y-4 min-h-[400px] mb-6">
                        <AnimatePresence mode="popLayout">
                            {messages.length > 0 ? (
                                messages.map((message, index) => {
                                    const isUser = message.role === 'user';
                                    const content = getMessageContent(message.content);

                                    return (
                                        <motion.div
                                            key={message.id || index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className={cn(
                                                'flex gap-3',
                                                isUser ? 'justify-end' : 'justify-start'
                                            )}
                                        >
                                            {/* Avatar for AI */}
                                            {!isUser && (
                                                <div className="shrink-0 w-8 h-8 rounded-lg bg-linear-to-br from-[#6366F1] via-[#8B5CF6] to-[#A855F7] flex items-center justify-center">
                                                    <Sparkles className="w-4 h-4 text-white" />
                                                </div>
                                            )}

                                            <GlassCard
                                                variant={isUser ? 'glow' : 'default'}
                                                padding="md"
                                                className={cn(
                                                    'max-w-[80%]',
                                                    isUser && 'bg-[rgba(99,102,241,0.1)]'
                                                )}
                                                animate={false}
                                            >
                                                <p className="text-sm text-[#F8FAFC] whitespace-pre-wrap">
                                                    {content}
                                                </p>

                                                {/* Render generated components */}
                                                {message.renderedComponent && (
                                                    <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                                                        {message.renderedComponent}
                                                    </div>
                                                )}
                                            </GlassCard>

                                            {/* Avatar for User */}
                                            {isUser && (
                                                <div className="shrink-0 w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                                                    <User className="w-4 h-4 text-[#94A3B8]" />
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-20"
                                >
                                    <div className="w-20 h-20 mb-6 rounded-2xl bg-linear-to-br from-[#6366F1]/20 via-[#8B5CF6]/20 to-[#A855F7]/20 border border-[rgba(99,102,241,0.2)] flex items-center justify-center">
                                        <MessageSquare className="w-10 h-10 text-[#6366F1]" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">
                                        Start a conversation
                                    </h3>
                                    <p className="text-sm text-[#94A3B8] text-center max-w-md mb-6">
                                        Describe what you want to create and watch the interface build itself.
                                    </p>

                                    {/* Example prompts */}
                                    <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                                        {[
                                            'Create a task board',
                                            'Track my budget',
                                            'Build a timeline',
                                            'Make a checklist',
                                        ].map((prompt) => (
                                            <button
                                                key={prompt}
                                                onClick={() => handleSendMessage(prompt)}
                                                disabled={isLoading}
                                                className={cn(
                                                    'px-3 py-1.5 rounded-full text-xs font-medium',
                                                    'bg-[rgba(255,255,255,0.03)] text-[#94A3B8]',
                                                    'border border-[rgba(255,255,255,0.06)]',
                                                    'hover:bg-[rgba(99,102,241,0.1)] hover:text-[#A5B4FC] hover:border-[rgba(99,102,241,0.2)]',
                                                    'transition-all duration-200',
                                                    'disabled:opacity-50 disabled:cursor-not-allowed'
                                                )}
                                            >
                                                {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Loading indicator - only show when AI is actually working */}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex gap-3"
                            >
                                <div className="shrink-0 w-8 h-8 rounded-lg bg-linear-to-br from-[#6366F1] via-[#8B5CF6] to-[#A855F7] flex items-center justify-center animate-pulse">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <GlassCard variant="default" padding="md" animate={false}>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span className="text-sm text-[#94A3B8]">
                                            {getStatusMessage()}
                                        </span>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Fixed Command Input */}
                <div className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 bg-linear-to-t from-[#0A0A0F] via-[#0A0A0F]/95 to-transparent">
                    <div className="max-w-3xl mx-auto">
                        <CommandInput
                            onSubmit={handleSendMessage}
                            isLoading={isLoading}
                            placeholder="Describe what you want to create..."
                        />
                    </div>
                </div>
            </main>
        </>
    );
}

export default Canvas;
