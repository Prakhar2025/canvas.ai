import { defineTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * TOOLS REGISTRY - FAANG-Level AI Capabilities
 * 
 * Tools return pre-formatted strings for clean UI display.
 * The AI receives structured data internally but the display shows natural text.
 * 
 * Tools Available:
 * 1. getCurrentTime - Time and date awareness
 * 2. webSearch - Web search simulation
 * 3. calculator - Mathematical operations
 * 4. getWeather - Weather information
 * 5. quoteOfDay - Inspirational quotes
 * 6. aiMemory - Context persistence
 * 7. exportCanvas - Generate shareable content
 */

// ============================================
// 1. GET CURRENT TIME TOOL
// ============================================
const getCurrentTimeTool = defineTool({
    name: "getCurrentTime",
    description: "Get the current user's local time and date. Use when user asks about current time or date.",
    inputSchema: z.object({}),
    tool: async () => {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Return formatted string for clean display
        return `🕐 It's ${time} on ${date} (${timezone} timezone)`;
    }
});

// ============================================
// 2. WEB SEARCH TOOL
// ============================================
const webSearchTool = defineTool({
    name: "webSearch",
    description: "Search the web for real-time information about any topic.",
    inputSchema: z.object({
        query: z.string().describe("The search query keywords")
    }),
    tool: async ({ query }) => {
        await new Promise(resolve => setTimeout(resolve, 800));

        // Return formatted search results
        const results = [
            `📄 "${query} - Complete Guide 2026" - Comprehensive guide and API reference for ${query}`,
            `📘 "${query} Tutorial" - Step-by-step tutorial with code examples`,
            `📊 "${query} vs Alternatives" - Detailed comparison with pros, cons, and benchmarks`
        ];

        return `🔍 Found 3 results for "${query}":\n\n${results.join('\n\n')}`;
    }
});

// ============================================
// 3. CALCULATOR TOOL
// ============================================
const calculatorTool = defineTool({
    name: "calculator",
    description: "Perform mathematical calculations including percentages, arithmetic, and unit conversions.",
    inputSchema: z.object({
        expression: z.string().describe("The mathematical expression (e.g., '2 + 2', '15% of 5000', 'sqrt(144)')")
    }),
    tool: async ({ expression }) => {
        await new Promise(resolve => setTimeout(resolve, 200));

        try {
            let result: number;
            let formatted: string;

            // Handle percentage calculations
            if (expression.toLowerCase().includes('% of')) {
                const match = expression.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*\$?(\d+(?:,?\d+)*(?:\.\d+)?)/i);
                if (match) {
                    const percent = parseFloat(match[1]);
                    const base = parseFloat(match[2].replace(/,/g, ''));
                    result = (percent / 100) * base;
                    formatted = `💰 ${percent}% of $${base.toLocaleString()} = **$${result.toLocaleString()}**`;
                    return formatted;
                }
            }

            // Handle square root
            if (expression.toLowerCase().includes('sqrt') || expression.toLowerCase().includes('square root')) {
                const match = expression.match(/(?:sqrt|square root)[^\d]*(\d+(?:\.\d+)?)/i);
                if (match) {
                    const num = parseFloat(match[1]);
                    result = Math.sqrt(num);
                    return `🔢 √${num} = **${result}**`;
                }
            }

            // Handle power/exponent
            if (expression.includes('^') || expression.includes('**')) {
                const sanitized = expression.replace(/\^/g, '**');
                result = Function(`"use strict"; return (${sanitized})`)();
                return `🔢 ${expression} = **${result.toLocaleString()}**`;
            }

            // Standard arithmetic
            const sanitized = expression.replace(/[^0-9+\-*/().% ]/g, '');
            result = Function(`"use strict"; return (${sanitized})`)();
            return `🔢 ${expression} = **${result.toLocaleString()}**`;

        } catch {
            return `❌ Could not evaluate "${expression}". Please use standard math notation.`;
        }
    }
});

// ============================================
// 4. WEATHER TOOL
// ============================================
const getWeatherTool = defineTool({
    name: "getWeather",
    description: "Get current weather information for any location.",
    inputSchema: z.object({
        location: z.string().describe("City name (e.g., 'New York', 'London', 'Tokyo')")
    }),
    tool: async ({ location }) => {
        await new Promise(resolve => setTimeout(resolve, 600));

        // Simulated weather data
        const conditions = [
            { condition: 'Partly Cloudy', icon: '⛅', temp: { min: 18, max: 28 } },
            { condition: 'Sunny', icon: '☀️', temp: { min: 22, max: 35 } },
            { condition: 'Cloudy', icon: '☁️', temp: { min: 15, max: 22 } },
            { condition: 'Clear', icon: '🌤️', temp: { min: 20, max: 30 } },
        ];

        const selected = conditions[Math.floor(Math.random() * conditions.length)];
        const tempC = Math.floor(Math.random() * (selected.temp.max - selected.temp.min) + selected.temp.min);
        const tempF = Math.round(tempC * 9 / 5 + 32);
        const humidity = Math.floor(Math.random() * 40 + 40);
        const wind = Math.floor(Math.random() * 20 + 5);
        const cityName = location.charAt(0).toUpperCase() + location.slice(1);

        return `${selected.icon} **${cityName}**: ${tempC}°C (${tempF}°F), ${selected.condition}\n💧 Humidity: ${humidity}% | 💨 Wind: ${wind} km/h`;
    }
});

// ============================================
// 5. QUOTE OF THE DAY TOOL
// ============================================
const quoteOfDayTool = defineTool({
    name: "quoteOfDay",
    description: "Get an inspirational quote. Categories: motivation, success, creativity, technology, life.",
    inputSchema: z.object({
        category: z.enum(['motivation', 'success', 'creativity', 'technology', 'life', 'random']).optional().describe("Quote category")
    }),
    tool: async ({ category = 'random' }) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const quotes: Record<string, Array<{ quote: string; author: string }>> = {
            motivation: [
                { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
                { quote: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
            ],
            success: [
                { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
                { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            ],
            creativity: [
                { quote: "Creativity is intelligence having fun.", author: "Albert Einstein" },
                { quote: "The chief enemy of creativity is good sense.", author: "Pablo Picasso" },
            ],
            technology: [
                { quote: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
                { quote: "The best way to predict the future is to create it.", author: "Alan Kay" },
            ],
            life: [
                { quote: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
                { quote: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
            ],
        };

        const allQuotes = category === 'random'
            ? Object.values(quotes).flat()
            : quotes[category] || Object.values(quotes).flat();

        const selected = allQuotes[Math.floor(Math.random() * allQuotes.length)];

        return `✨ *"${selected.quote}"*\n\n— **${selected.author}**`;
    }
});

// ============================================
// 6. AI MEMORY TOOL
// ============================================
const memoryStore: Map<string, { value: unknown; timestamp: string }> = new Map();

const aiMemoryTool = defineTool({
    name: "aiMemory",
    description: "Store and retrieve information for context persistence. Actions: save, get, list, delete.",
    inputSchema: z.object({
        action: z.enum(['save', 'get', 'list', 'delete']).describe("Memory action"),
        key: z.string().optional().describe("Memory key/identifier"),
        value: z.string().optional().describe("Value to store (for save action)")
    }),
    tool: async ({ action, key, value }) => {
        await new Promise(resolve => setTimeout(resolve, 150));

        switch (action) {
            case 'save':
                if (!key) return "❌ Key required to save memory";
                memoryStore.set(key, { value, timestamp: new Date().toISOString() });
                return `✅ Saved: **${key}** = "${value}"`;

            case 'get':
                if (!key) return "❌ Key required to retrieve memory";
                const item = memoryStore.get(key);
                return item
                    ? `📝 **${key}**: ${item.value}`
                    : `❌ No memory found for "${key}"`;

            case 'list':
                if (memoryStore.size === 0) return "📭 No memories stored yet";
                const memories = Array.from(memoryStore.entries())
                    .map(([k, v]) => `• **${k}**: ${v.value}`)
                    .join('\n');
                return `📋 **Stored Memories (${memoryStore.size}):**\n${memories}`;

            case 'delete':
                if (!key) return "❌ Key required to delete memory";
                const deleted = memoryStore.delete(key);
                return deleted ? `🗑️ Deleted: "${key}"` : `❌ "${key}" not found`;

            default:
                return "❌ Invalid action";
        }
    }
});

// ============================================
// 7. EXPORT CANVAS TOOL
// ============================================
const exportCanvasTool = defineTool({
    name: "exportCanvas",
    description: "Generate shareable content from canvas. Formats: summary, markdown, json, link.",
    inputSchema: z.object({
        format: z.enum(['summary', 'json', 'markdown', 'link']).describe("Export format"),
        title: z.string().optional().describe("Export title"),
        content: z.string().optional().describe("Content to export")
    }),
    tool: async ({ format, title = "Canvas Export", content }) => {
        await new Promise(resolve => setTimeout(resolve, 400));

        const exportId = `canvas-${Date.now().toString(36)}`;
        const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        switch (format) {
            case 'summary':
                return `📋 **${title}**\n\n${content || 'Your canvas workspace summary.'}\n\n_Exported on ${date}_`;

            case 'markdown':
                return `📄 **Markdown Export**\n\n\`\`\`markdown\n# ${title}\n\n${content || 'Canvas content here'}\n\n---\n*Exported from Canvas AI*\n\`\`\``;

            case 'json':
                return `📦 **JSON Export** (ID: ${exportId})\n\n\`\`\`json\n{\n  "title": "${title}",\n  "content": "${content || 'Canvas data'}",\n  "exportedAt": "${new Date().toISOString()}"\n}\n\`\`\``;

            case 'link':
                return `🔗 **Share Link Generated**\n\nhttps://canvas-ai.app/share/${exportId}\n\n_Link expires in 7 days_`;

            default:
                return "❌ Invalid export format";
        }
    }
});

// ============================================
// REGISTRY EXPORT
// ============================================
export const toolsRegistry = [
    getCurrentTimeTool,
    webSearchTool,
    calculatorTool,
    getWeatherTool,
    quoteOfDayTool,
    aiMemoryTool,
    exportCanvasTool
];
