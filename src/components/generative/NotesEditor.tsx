'use client';

import { useState, useCallback, useId, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link,
    Image,
    Code,
    Heading1,
    Heading2,
    Quote,
    Minus,
    Save,
    Copy,
    Check,
    Type
} from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod';

/* ============================================
   NOTES EDITOR COMPONENT
   
   A professional rich text notes editor with:
   - Formatting toolbar (bold, italic, underline)
   - Headings and lists
   - Auto-save indicator
   - Word/character count
   - Keyboard shortcuts
   - Markdown-like experience
   ============================================ */

/** Zod schema for type validation */
export const NotesEditorSchema = z.object({
    title: z.string().default('Notes'),
    initialContent: z.string().default(''),
    placeholder: z.string().default('Start writing...'),
    showToolbar: z.boolean().default(true),
    showWordCount: z.boolean().default(true),
    autoSave: z.boolean().default(true),
});

/** Props type inferred from Zod schema */
export type NotesEditorProps = z.infer<typeof NotesEditorSchema>;

/** Toolbar button config */
interface ToolbarButton {
    icon: typeof Bold;
    command: string;
    tooltip: string;
    shortcut?: string;
}

const formattingButtons: ToolbarButton[] = [
    { icon: Bold, command: 'bold', tooltip: 'Bold', shortcut: 'Ctrl+B' },
    { icon: Italic, command: 'italic', tooltip: 'Italic', shortcut: 'Ctrl+I' },
    { icon: UnderlineIcon, command: 'underline', tooltip: 'Underline', shortcut: 'Ctrl+U' },
    { icon: Code, command: 'code', tooltip: 'Inline Code' },
];

const structureButtons: ToolbarButton[] = [
    { icon: Heading1, command: 'h1', tooltip: 'Heading 1' },
    { icon: Heading2, command: 'h2', tooltip: 'Heading 2' },
    { icon: Quote, command: 'quote', tooltip: 'Quote' },
    { icon: Minus, command: 'hr', tooltip: 'Divider' },
];

const listButtons: ToolbarButton[] = [
    { icon: List, command: 'ul', tooltip: 'Bullet List' },
    { icon: ListOrdered, command: 'ol', tooltip: 'Numbered List' },
];

const alignButtons: ToolbarButton[] = [
    { icon: AlignLeft, command: 'left', tooltip: 'Align Left' },
    { icon: AlignCenter, command: 'center', tooltip: 'Center' },
    { icon: AlignRight, command: 'right', tooltip: 'Align Right' },
];

/**
 * NotesEditor - A professional rich text notes editor
 * 
 * @description Renders an interactive notes editor with formatting toolbar,
 * auto-save, word count, and keyboard shortcuts.
 * 
 * @param {string} title - The notes title
 * @param {string} initialContent - Initial content
 * @param {string} placeholder - Placeholder text
 * @param {boolean} showToolbar - Whether to show toolbar
 * @param {boolean} showWordCount - Whether to show word count
 * @param {boolean} autoSave - Whether to auto-save
 * 
 * @example
 * <NotesEditor
 *   title="Meeting Notes"
 *   placeholder="Start typing..."
 * />
 */
export function NotesEditor({
    title = 'Notes',
    initialContent = '',
    placeholder = 'Start writing...',
    showToolbar = true,
    showWordCount = true,
    autoSave = true,
}: NotesEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isSaved, setIsSaved] = useState(true);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [copied, setCopied] = useState(false);
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
    const editorRef = useRef<HTMLDivElement>(null);
    const instanceId = useId();

    // Calculate word and character count
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const charCount = content.length;

    /** Auto-save effect */
    useEffect(() => {
        if (!autoSave || isSaved) return;

        const timer = setTimeout(() => {
            setIsSaved(true);
            setLastSaved(new Date());
        }, 1000);

        return () => clearTimeout(timer);
    }, [content, autoSave, isSaved]);

    /** Handle content change */
    const handleContentChange = useCallback((e: React.FormEvent<HTMLDivElement>) => {
        const newContent = (e.target as HTMLDivElement).innerHTML;
        setContent(newContent);
        setIsSaved(false);
    }, []);

    /** Apply formatting command */
    const applyFormat = useCallback((command: string) => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        switch (command) {
            case 'bold':
                document.execCommand('bold', false);
                break;
            case 'italic':
                document.execCommand('italic', false);
                break;
            case 'underline':
                document.execCommand('underline', false);
                break;
            case 'code':
                const range = selection.getRangeAt(0);
                const code = document.createElement('code');
                code.className = 'px-1.5 py-0.5 bg-[rgba(255,255,255,0.1)] rounded text-indigo-300 font-mono text-sm';
                range.surroundContents(code);
                break;
            case 'h1':
                document.execCommand('formatBlock', false, 'h1');
                break;
            case 'h2':
                document.execCommand('formatBlock', false, 'h2');
                break;
            case 'quote':
                document.execCommand('formatBlock', false, 'blockquote');
                break;
            case 'hr':
                document.execCommand('insertHorizontalRule', false);
                break;
            case 'ul':
                document.execCommand('insertUnorderedList', false);
                break;
            case 'ol':
                document.execCommand('insertOrderedList', false);
                break;
            case 'left':
                document.execCommand('justifyLeft', false);
                break;
            case 'center':
                document.execCommand('justifyCenter', false);
                break;
            case 'right':
                document.execCommand('justifyRight', false);
                break;
        }

        // Update active formats
        setActiveFormats(new Set([
            document.queryCommandState('bold') ? 'bold' : '',
            document.queryCommandState('italic') ? 'italic' : '',
            document.queryCommandState('underline') ? 'underline' : '',
        ].filter(Boolean)));

        editorRef.current?.focus();
    }, []);

    /** Copy content to clipboard */
    const copyContent = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(editorRef.current?.innerText || '');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard not available
        }
    }, []);

    /** Handle keyboard shortcuts */
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    applyFormat('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    applyFormat('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    applyFormat('underline');
                    break;
            }
        }
    }, [applyFormat]);

    /** Update active formats on selection change */
    useEffect(() => {
        const handleSelectionChange = () => {
            setActiveFormats(new Set([
                document.queryCommandState('bold') ? 'bold' : '',
                document.queryCommandState('italic') ? 'italic' : '',
                document.queryCommandState('underline') ? 'underline' : '',
            ].filter(Boolean)));
        };

        document.addEventListener('selectionchange', handleSelectionChange);
        return () => document.removeEventListener('selectionchange', handleSelectionChange);
    }, []);

    /** Render toolbar button group */
    const renderButtonGroup = (buttons: ToolbarButton[], groupKey: string) => (
        <div className="flex items-center gap-0.5" key={groupKey}>
            {buttons.map((btn) => {
                const Icon = btn.icon;
                const isActive = activeFormats.has(btn.command);
                return (
                    <button
                        key={btn.command}
                        onClick={() => applyFormat(btn.command)}
                        className={cn(
                            "p-1.5 rounded transition-colors",
                            isActive
                                ? "bg-indigo-500/30 text-indigo-300"
                                : "text-gray-400 hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
                        )}
                        title={`${btn.tooltip}${btn.shortcut ? ` (${btn.shortcut})` : ''}`}
                        aria-label={btn.tooltip}
                    >
                        <Icon className="w-4 h-4" />
                    </button>
                );
            })}
        </div>
    );

    return (
        <GlassCard
            className="w-full"
            padding="none"
            role="region"
            aria-label={`Notes editor: ${title}`}
        >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                            <FileText className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-white">{title}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                {autoSave && (
                                    <span className="flex items-center gap-1">
                                        {isSaved ? (
                                            <>
                                                <Check className="w-3 h-3 text-emerald-400" />
                                                <span className="text-emerald-400">Saved</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-3 h-3 animate-pulse" />
                                                <span>Saving...</span>
                                            </>
                                        )}
                                    </span>
                                )}
                                {lastSaved && (
                                    <span className="text-gray-600">
                                        {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={copyContent}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
                        aria-label="Copy content"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            {showToolbar && (
                <div className="px-4 py-2 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.2)] overflow-x-auto">
                    <div className="flex items-center gap-2 min-w-max">
                        {renderButtonGroup(formattingButtons, 'formatting')}
                        <div className="w-px h-5 bg-[rgba(255,255,255,0.1)]" />
                        {renderButtonGroup(structureButtons, 'structure')}
                        <div className="w-px h-5 bg-[rgba(255,255,255,0.1)]" />
                        {renderButtonGroup(listButtons, 'lists')}
                        <div className="w-px h-5 bg-[rgba(255,255,255,0.1)]" />
                        {renderButtonGroup(alignButtons, 'align')}
                    </div>
                </div>
            )}

            {/* Editor Area */}
            <div className="relative">
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleContentChange}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "min-h-[300px] max-h-[500px] overflow-y-auto p-4 sm:p-6",
                        "text-gray-200 text-base leading-relaxed",
                        "focus:outline-none",
                        "prose prose-invert prose-sm max-w-none",
                        // Custom prose styles
                        "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-4 [&_h1]:mt-6",
                        "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mb-3 [&_h2]:mt-5",
                        "[&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-400",
                        "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
                        "[&_li]:my-1",
                        "[&_hr]:border-[rgba(255,255,255,0.1)] [&_hr]:my-6",
                        "[&_a]:text-indigo-400 [&_a]:underline",
                        "[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:bg-[rgba(255,255,255,0.1)] [&_code]:rounded [&_code]:text-indigo-300 [&_code]:font-mono [&_code]:text-sm"
                    )}
                    dangerouslySetInnerHTML={{ __html: content || '' }}
                    data-placeholder={placeholder}
                    role="textbox"
                    aria-multiline="true"
                    aria-label="Notes content"
                    suppressContentEditableWarning
                />

                {/* Placeholder */}
                {!content && (
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-gray-500 pointer-events-none">
                        {placeholder}
                    </div>
                )}
            </div>

            {/* Footer with word count */}
            {showWordCount && (
                <div className="px-4 py-2 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.2)]">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
                            <span>{charCount} {charCount === 1 ? 'character' : 'characters'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Type className="w-3 h-3" />
                            <span>Rich Text</span>
                        </div>
                    </div>
                </div>
            )}
        </GlassCard>
    );
}

export default NotesEditor;
