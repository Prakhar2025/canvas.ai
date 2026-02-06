'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Code2, Copy, Check, Download, Play, Terminal } from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod';

/* ============================================
   CODE SNIPPET COMPONENT
   
   A professional code display component with:
   - Syntax highlighting simulation
   - Copy to clipboard
   - Language badge
   - Line numbers
   - Run code (simulated)
   - Download file
   ============================================ */

/** Zod schema for type validation */
export const CodeSnippetSchema = z.object({
    title: z.string().default('Code Snippet').describe('Title of the code snippet'),
    language: z.enum([
        'javascript', 'typescript', 'python', 'html', 'css',
        'json', 'bash', 'sql', 'react', 'java', 'go', 'rust'
    ]).default('javascript').describe('Programming language'),
    code: z.string().default('// Your code here').describe('The code content - GENERATE ACTUAL WORKING CODE'),
    showLineNumbers: z.boolean().default(true).describe('Show line numbers'),
    executable: z.boolean().default(false).describe('Show run button for executable code'),
    description: z.string().optional().describe('Optional description of what the code does'),
});

/** Props type inferred from Zod schema */
export type CodeSnippetProps = z.infer<typeof CodeSnippetSchema>;

/** Language color mapping */
const languageColors: Record<string, { bg: string; text: string; border: string }> = {
    javascript: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    typescript: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    python: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    html: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    css: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    json: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
    bash: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    sql: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    react: { bg: 'bg-sky-500/20', text: 'text-sky-400', border: 'border-sky-500/30' },
    java: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    go: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
    rust: { bg: 'bg-orange-600/20', text: 'text-orange-400', border: 'border-orange-600/30' },
};

/**
 * CodeSnippet - A professional code display component
 */
export function CodeSnippet({
    title = 'Code Snippet',
    language = 'javascript',
    code = '',
    showLineNumbers = true,
    executable = false,
    description,
}: CodeSnippetProps) {
    const [copied, setCopied] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState<string | null>(null);

    const colors = languageColors[language] || languageColors.javascript;
    const lines = code.split('\n');

    /** Copy code to clipboard */
    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }, [code]);

    /** Simulate running code */
    const handleRun = useCallback(async () => {
        setIsRunning(true);
        setOutput(null);

        // Simulate execution delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock output based on language
        const mockOutputs: Record<string, string> = {
            javascript: '> Output: Hello, World!\n> Execution completed in 0.003s',
            typescript: '> Compiled successfully\n> Output: TypeScript rocks!\n> Done.',
            python: '>>> Running script...\n>>> Hello from Python!\n>>> Process finished with exit code 0',
            bash: '$ Command executed\n$ Success!',
        };

        setOutput(mockOutputs[language] || '> Execution complete');
        setIsRunning(false);
    }, [language]);

    /** Download code as file */
    const handleDownload = useCallback(() => {
        const extensions: Record<string, string> = {
            javascript: 'js', typescript: 'ts', python: 'py', html: 'html',
            css: 'css', json: 'json', bash: 'sh', sql: 'sql',
            react: 'tsx', java: 'java', go: 'go', rust: 'rs',
        };

        const ext = extensions[language] || 'txt';
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_').toLowerCase()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [code, title, language]);

    return (
        <GlassCard
            className="w-full max-w-2xl mx-auto overflow-hidden"
            padding="none"
            role="region"
            aria-label={`Code: ${title}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border", colors.bg, colors.border)}>
                        <Code2 className={cn("w-4 h-4", colors.text)} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">{title}</h3>
                        <span className={cn("text-xs font-medium uppercase", colors.text)}>{language}</span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {executable && (
                        <button
                            onClick={handleRun}
                            disabled={isRunning}
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                "hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400",
                                isRunning && "animate-pulse"
                            )}
                            aria-label="Run code"
                        >
                            {isRunning ? <Terminal className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                    )}
                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-gray-400 hover:text-white transition-all"
                        aria-label="Download code"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "p-2 rounded-lg transition-all",
                            copied
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "hover:bg-[rgba(255,255,255,0.05)] text-gray-400 hover:text-white"
                        )}
                        aria-label={copied ? "Copied!" : "Copy code"}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Description */}
            {description && (
                <div className="px-4 py-2 bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.06)]">
                    <p className="text-xs text-gray-400">{description}</p>
                </div>
            )}

            {/* Code Block */}
            <div className="overflow-x-auto">
                <pre className="p-4 text-sm font-mono">
                    <code>
                        {lines.map((line, i) => (
                            <div key={i} className="flex">
                                {showLineNumbers && (
                                    <span className="select-none w-8 pr-4 text-right text-gray-600 shrink-0">
                                        {i + 1}
                                    </span>
                                )}
                                <span className="text-gray-200 whitespace-pre">{line || ' '}</span>
                            </div>
                        ))}
                    </code>
                </pre>
            </div>

            {/* Output Panel */}
            {output && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-[rgba(255,255,255,0.06)]"
                >
                    <div className="p-3 bg-[rgba(0,0,0,0.3)]">
                        <div className="flex items-center gap-2 mb-2">
                            <Terminal className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs font-medium text-emerald-400">Output</span>
                        </div>
                        <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap">{output}</pre>
                    </div>
                </motion.div>
            )}
        </GlassCard>
    );
}

export default CodeSnippet;
