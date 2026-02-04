'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useTamboVoice } from '@tambo-ai/react';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
    onTranscript: (text: string) => void;
    disabled?: boolean;
}

export function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
    const {
        isRecording,
        startRecording,
        stopRecording,
        transcript,
        mediaAccessError
    } = useTamboVoice();

    // Effect to handle completed transcript
    useEffect(() => {
        if (transcript && !isRecording) {
            onTranscript(transcript);
        }
    }, [transcript, isRecording, onTranscript]);

    const toggleListening = useCallback(() => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);

    return (
        <div className="relative">
            <motion.button
                type="button"
                onClick={toggleListening}
                disabled={disabled}
                className={cn(
                    "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                    isRecording
                        ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                        : "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#94A3B8] hover:bg-[#6366F1] hover:text-white hover:border-[#6366F1]",
                    disabled && "opacity-50 cursor-not-allowed hover:bg-[rgba(255,255,255,0.05)] hover:text-[#94A3B8]"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isRecording ? "Stop listening" : "Start voice input"}
            >
                {isRecording ? (
                    <MicOff className="w-5 h-5" />
                ) : (
                    <Mic className="w-5 h-5" />
                )}
            </motion.button>

            {/* Ripple effect when listening */}
            {isRecording && (
                <span className="absolute inset-0 rounded-xl bg-rose-500 animate-ping opacity-20 pointer-events-none" />
            )}

            {/* Error state */}
            {mediaAccessError && (
                <span className="absolute top-12 left-0 w-max text-xs text-rose-400 bg-rose-950/90 px-2 py-1 rounded border border-rose-800">
                    Microphone blocked
                </span>
            )}
        </div>
    );
}
