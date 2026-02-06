'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Pencil, Square, Circle, ArrowRight, Type, Trash2,
    Download, Undo, Redo, Palette, MousePointer
} from 'lucide-react';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod';

/* ============================================
   WHITEBOARD COMPONENT
   
   An interactive drawing/diagramming canvas with:
   - Drawing tools (pen, shapes, arrows, text)
   - Color palette
   - Undo/Redo
   - Export as image
   - Touch support
   ============================================ */

/** Zod schema for type validation */
export const WhiteboardSchema = z.object({
    title: z.string().default('Whiteboard').describe('Title of the whiteboard'),
    width: z.number().default(600).describe('Canvas width in pixels'),
    height: z.number().default(400).describe('Canvas height in pixels'),
    backgroundColor: z.string().default('#1a1a2e').describe('Background color'),
    initialTool: z.enum(['select', 'pen', 'rectangle', 'circle', 'arrow', 'text']).default('pen').describe('Initial drawing tool'),
});

/** Props type inferred from Zod schema */
export type WhiteboardProps = z.infer<typeof WhiteboardSchema>;

type Tool = 'select' | 'pen' | 'rectangle' | 'circle' | 'arrow' | 'text';
type DrawingElement = {
    id: string;
    type: Tool;
    points?: { x: number; y: number }[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
    text?: string;
    color: string;
};

const tools: { id: Tool; icon: typeof Pencil; label: string }[] = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'pen', icon: Pencil, label: 'Pen' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'text', icon: Type, label: 'Text' },
];

const colors = [
    '#ffffff', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'
];

/**
 * Whiteboard - An interactive drawing/diagramming component
 */
export function Whiteboard({
    title = 'Whiteboard',
    width = 600,
    height = 400,
    backgroundColor = '#1a1a2e',
    initialTool = 'pen',
}: WhiteboardProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeTool, setActiveTool] = useState<Tool>(initialTool);
    const [activeColor, setActiveColor] = useState('#ffffff');
    const [isDrawing, setIsDrawing] = useState(false);
    const [elements, setElements] = useState<DrawingElement[]>([]);
    const [history, setHistory] = useState<DrawingElement[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);

    /** Get mouse position relative to canvas */
    const getMousePos = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }, []);

    /** Start drawing */
    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (activeTool === 'select') return;

        const pos = getMousePos(e);
        setIsDrawing(true);

        const newElement: DrawingElement = {
            id: `element-${Date.now()}`,
            type: activeTool,
            color: activeColor,
            ...(activeTool === 'pen' ? { points: [pos] } : { start: pos, end: pos })
        };

        if (activeTool === 'text') {
            const text = prompt('Enter text:');
            if (text) {
                newElement.text = text;
                newElement.start = pos;
                setElements(prev => [...prev, newElement]);
                saveToHistory([...elements, newElement]);
            }
            setIsDrawing(false);
            return;
        }

        setCurrentElement(newElement);
    }, [activeTool, activeColor, getMousePos, elements]);

    /** Continue drawing */
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !currentElement) return;

        const pos = getMousePos(e);

        if (currentElement.type === 'pen' && currentElement.points) {
            setCurrentElement({
                ...currentElement,
                points: [...currentElement.points, pos]
            });
        } else {
            setCurrentElement({
                ...currentElement,
                end: pos
            });
        }
    }, [isDrawing, currentElement, getMousePos]);

    /** End drawing */
    const handleMouseUp = useCallback(() => {
        if (!isDrawing || !currentElement) return;

        setIsDrawing(false);
        const newElements = [...elements, currentElement];
        setElements(newElements);
        saveToHistory(newElements);
        setCurrentElement(null);
    }, [isDrawing, currentElement, elements]);

    /** Save to history for undo/redo */
    const saveToHistory = useCallback((newElements: DrawingElement[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newElements);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex]);

    /** Undo */
    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1);
            setElements(history[historyIndex - 1]);
        }
    }, [history, historyIndex]);

    /** Redo */
    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1);
            setElements(history[historyIndex + 1]);
        }
    }, [history, historyIndex]);

    /** Clear canvas */
    const handleClear = useCallback(() => {
        setElements([]);
        saveToHistory([]);
    }, [saveToHistory]);

    /** Export as image */
    const handleExport = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }, [title]);

    /** Render canvas */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear and set background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Draw all elements
        const allElements = currentElement ? [...elements, currentElement] : elements;

        allElements.forEach(element => {
            ctx.strokeStyle = element.color;
            ctx.fillStyle = element.color;
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            switch (element.type) {
                case 'pen':
                    if (element.points && element.points.length > 0) {
                        ctx.beginPath();
                        ctx.moveTo(element.points[0].x, element.points[0].y);
                        element.points.forEach(point => ctx.lineTo(point.x, point.y));
                        ctx.stroke();
                    }
                    break;

                case 'rectangle':
                    if (element.start && element.end) {
                        ctx.strokeRect(
                            element.start.x, element.start.y,
                            element.end.x - element.start.x,
                            element.end.y - element.start.y
                        );
                    }
                    break;

                case 'circle':
                    if (element.start && element.end) {
                        const radius = Math.sqrt(
                            Math.pow(element.end.x - element.start.x, 2) +
                            Math.pow(element.end.y - element.start.y, 2)
                        );
                        ctx.beginPath();
                        ctx.arc(element.start.x, element.start.y, radius, 0, Math.PI * 2);
                        ctx.stroke();
                    }
                    break;

                case 'arrow':
                    if (element.start && element.end) {
                        const headLength = 15;
                        const dx = element.end.x - element.start.x;
                        const dy = element.end.y - element.start.y;
                        const angle = Math.atan2(dy, dx);

                        ctx.beginPath();
                        ctx.moveTo(element.start.x, element.start.y);
                        ctx.lineTo(element.end.x, element.end.y);
                        ctx.lineTo(
                            element.end.x - headLength * Math.cos(angle - Math.PI / 6),
                            element.end.y - headLength * Math.sin(angle - Math.PI / 6)
                        );
                        ctx.moveTo(element.end.x, element.end.y);
                        ctx.lineTo(
                            element.end.x - headLength * Math.cos(angle + Math.PI / 6),
                            element.end.y - headLength * Math.sin(angle + Math.PI / 6)
                        );
                        ctx.stroke();
                    }
                    break;

                case 'text':
                    if (element.start && element.text) {
                        ctx.font = '16px Inter, sans-serif';
                        ctx.fillText(element.text, element.start.x, element.start.y);
                    }
                    break;
            }
        });
    }, [elements, currentElement, width, height, backgroundColor]);

    return (
        <GlassCard
            className="w-full max-w-3xl mx-auto overflow-hidden"
            padding="none"
            role="region"
            aria-label={`Whiteboard: ${title}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                        <Pencil className="w-4 h-4 text-violet-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{title}</h3>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleUndo}
                        disabled={historyIndex === 0}
                        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                        aria-label="Undo"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleRedo}
                        disabled={historyIndex === history.length - 1}
                        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-gray-400 hover:text-white disabled:opacity-30 transition-all"
                        aria-label="Redo"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleClear}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                        aria-label="Clear"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleExport}
                        className="p-2 rounded-lg hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400 transition-all"
                        aria-label="Export"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.2)]">
                {/* Tools */}
                <div className="flex items-center gap-1">
                    {tools.map(tool => {
                        const Icon = tool.icon;
                        return (
                            <button
                                key={tool.id}
                                onClick={() => setActiveTool(tool.id)}
                                className={cn(
                                    "p-2 rounded-lg transition-all",
                                    activeTool === tool.id
                                        ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                                        : "text-gray-400 hover:bg-[rgba(255,255,255,0.05)] hover:text-white"
                                )}
                                aria-label={tool.label}
                                title={tool.label}
                            >
                                <Icon className="w-4 h-4" />
                            </button>
                        );
                    })}
                </div>

                {/* Colors */}
                <div className="flex items-center gap-1">
                    <Palette className="w-4 h-4 text-gray-500 mr-1" />
                    {colors.map(color => (
                        <button
                            key={color}
                            onClick={() => setActiveColor(color)}
                            className={cn(
                                "w-6 h-6 rounded-full border-2 transition-all",
                                activeColor === color ? "border-white scale-110" : "border-transparent"
                            )}
                            style={{ backgroundColor: color }}
                            aria-label={`Color ${color}`}
                        />
                    ))}
                </div>
            </div>

            {/* Canvas */}
            <div className="relative overflow-auto">
                <canvas
                    ref={canvasRef}
                    width={width}
                    height={height}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="cursor-crosshair"
                    style={{ display: 'block' }}
                />
            </div>

            {/* Status Bar */}
            <div className="px-3 py-2 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Tool: {tools.find(t => t.id === activeTool)?.label}</span>
                    <span>{elements.length} element{elements.length !== 1 ? 's' : ''}</span>
                </div>
            </div>
        </GlassCard>
    );
}

export default Whiteboard;
