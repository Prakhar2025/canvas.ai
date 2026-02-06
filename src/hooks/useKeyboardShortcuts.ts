'use client';

import { useEffect, useCallback } from 'react';

/* ============================================
   KEYBOARD SHORTCUTS HOOK
   
   Professional keyboard shortcuts for Canvas AI:
   - Ctrl+K: Command palette (focus input)
   - Ctrl+/: Voice toggle
   - Escape: Clear/close
   - Ctrl+Enter: Submit
   ============================================ */

interface KeyboardShortcutsOptions {
    /** Callback for Ctrl+K (Command palette) */
    onCommandPalette?: () => void;
    /** Callback for Ctrl+/ (Voice toggle) */
    onVoiceToggle?: () => void;
    /** Callback for Escape key */
    onEscape?: () => void;
    /** Callback for Ctrl+Enter (Submit) */
    onSubmit?: () => void;
    /** Callback for Ctrl+N (New) */
    onNew?: () => void;
    /** Callback for Ctrl+S (Save) */
    onSave?: () => void;
    /** Whether shortcuts are enabled */
    enabled?: boolean;
}

/**
 * useKeyboardShortcuts - Global keyboard shortcuts hook
 * 
 * Provides FAANG-level keyboard navigation for power users.
 * 
 * @example
 * useKeyboardShortcuts({
 *   onCommandPalette: () => inputRef.current?.focus(),
 *   onVoiceToggle: () => setVoiceEnabled(v => !v),
 *   onEscape: () => setIsOpen(false)
 * });
 */
export function useKeyboardShortcuts({
    onCommandPalette,
    onVoiceToggle,
    onEscape,
    onSubmit,
    onNew,
    onSave,
    enabled = true,
}: KeyboardShortcutsOptions) {

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return;

        const { key, ctrlKey, metaKey, shiftKey } = event;
        const isMod = ctrlKey || metaKey; // Ctrl on Windows/Linux, Cmd on Mac

        // Don't trigger shortcuts when typing in inputs (except for Escape)
        const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
            (event.target as HTMLElement)?.tagName
        );

        // Ctrl+K / Cmd+K - Command palette
        if (isMod && key === 'k') {
            event.preventDefault();
            onCommandPalette?.();
            return;
        }

        // Ctrl+/ or Cmd+/ - Voice toggle
        if (isMod && key === '/') {
            event.preventDefault();
            onVoiceToggle?.();
            return;
        }

        // Ctrl+Enter / Cmd+Enter - Submit
        if (isMod && key === 'Enter' && !shiftKey) {
            event.preventDefault();
            onSubmit?.();
            return;
        }

        // Ctrl+N / Cmd+N - New (only when not typing)
        if (isMod && key === 'n' && !isTyping) {
            event.preventDefault();
            onNew?.();
            return;
        }

        // Ctrl+S / Cmd+S - Save
        if (isMod && key === 's') {
            event.preventDefault();
            onSave?.();
            return;
        }

        // Escape - Close/clear
        if (key === 'Escape') {
            onEscape?.();
            return;
        }
    }, [enabled, onCommandPalette, onVoiceToggle, onEscape, onSubmit, onNew, onSave]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * Keyboard shortcuts display data for UI hints
 */
export const keyboardShortcutsMap = [
    { keys: ['Ctrl', 'K'], action: 'Command palette', description: 'Focus the command input' },
    { keys: ['Ctrl', '/'], action: 'Voice toggle', description: 'Toggle voice input' },
    { keys: ['Ctrl', 'Enter'], action: 'Submit', description: 'Submit current input' },
    { keys: ['Ctrl', 'N'], action: 'New', description: 'Create new item' },
    { keys: ['Ctrl', 'S'], action: 'Save', description: 'Save current work' },
    { keys: ['Escape'], action: 'Close', description: 'Close dialogs or clear' },
];

export default useKeyboardShortcuts;
