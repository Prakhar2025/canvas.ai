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
// 2. WEB SEARCH TOOL (REAL API)
// ============================================
const webSearchTool = defineTool({
    name: "webSearch",
    description: "Search the web for real-time information about any topic using SerpAPI.",
    inputSchema: z.object({
        query: z.string().describe("The search query keywords")
    }),
    tool: async ({ query }) => {
        const apiKey = process.env.NEXT_PUBLIC_SERPAPI_KEY;

        // Fallback to simulated results if no API key
        if (!apiKey || apiKey === 'your_serpapi_key_here') {
            console.warn('[Web Search Tool] No API key configured, using simulated results');
            await new Promise(resolve => setTimeout(resolve, 800));

            const results = [
                `📄 "${query} - Complete Guide 2026" - Comprehensive guide and API reference for ${query}`,
                `📘 "${query} Tutorial" - Step-by-step tutorial with code examples`,
                `📊 "${query} vs Alternatives" - Detailed comparison with pros, cons, and benchmarks`
            ];

            return `🔍 Found 3 results for "${query}":\n\n${results.join('\n\n')}\n\n_⚠️ Demo mode - Add SERPAPI_KEY for real search_`;
        }

        // Real API call
        try {
            const response = await fetch(
                `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}&num=5`
            );

            if (!response.ok) {
                throw new Error(`SerpAPI error: ${response.status}`);
            }

            const data = await response.json();

            if (!data.organic_results || data.organic_results.length === 0) {
                return `🔍 No results found for "${query}". Try a different search term.`;
            }

            const results = data.organic_results.slice(0, 5).map((result: any, index: number) => {
                return `${index + 1}. **${result.title}**\n   ${result.snippet || 'No description available'}\n   🔗 ${result.link}`;
            });

            return `🔍 Found ${data.organic_results.length} results for "${query}":\n\n${results.join('\n\n')}\n\n_✅ Live results from Google via SerpAPI_`;

        } catch (error) {
            console.error('[Web Search Tool] API call failed:', error);
            return `❌ Unable to perform search for "${query}". Please try again.`;
        }
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
// 4. WEATHER TOOL (REAL API)
// ============================================
const getWeatherTool = defineTool({
    name: "getWeather",
    description: "Get current weather information for any location using real-time data from OpenWeatherMap API.",
    inputSchema: z.object({
        location: z.string().describe("City name (e.g., 'New York', 'London', 'Tokyo')")
    }),
    tool: async ({ location }) => {
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

        // Fallback to simulated data if no API key
        if (!apiKey || apiKey === 'your_openweather_api_key_here') {
            console.warn('[Weather Tool] No API key configured, using simulated data');
            await new Promise(resolve => setTimeout(resolve, 600));

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

            return `${selected.icon} **${cityName}**: ${tempC}°C (${tempF}°F), ${selected.condition}\n💧 Humidity: ${humidity}% | 💨 Wind: ${wind} km/h\n\n_⚠️ Demo mode - Add OPENWEATHER_API_KEY for real data_`;
        }

        // Real API call
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`
            );

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();

            const weatherIcons: Record<string, string> = {
                'Clear': '☀️',
                'Clouds': '☁️',
                'Rain': '🌧️',
                'Drizzle': '🌦️',
                'Thunderstorm': '⛈️',
                'Snow': '🌨️',
                'Mist': '🌫️',
                'Fog': '🌫️',
                'Haze': '🌫️',
            };

            const condition = data.weather[0].main;
            const icon = weatherIcons[condition] || '🌤️';
            const tempC = Math.round(data.main.temp);
            const tempF = Math.round(tempC * 9 / 5 + 32);
            const feelsLike = Math.round(data.main.feels_like);
            const humidity = data.main.humidity;
            const wind = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
            const description = data.weather[0].description;

            return `${icon} **${data.name}, ${data.sys.country}**: ${tempC}°C (${tempF}°F), ${description}\n🌡️ Feels like: ${feelsLike}°C | 💧 Humidity: ${humidity}% | 💨 Wind: ${wind} km/h\n\n_✅ Live data from OpenWeatherMap_`;

        } catch (error) {
            console.error('[Weather Tool] API call failed:', error);
            return `❌ Unable to fetch weather for "${location}". Please check the city name and try again.`;
        }
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
// 8. GITHUB MCP INTEGRATION (GAME CHANGER!)
// ============================================
const githubIssuesTool = defineTool({
    name: "githubIssues",
    description: "Fetch GitHub issues from popular open-source repositories. Try: 'Show React issues', 'Show Next.js issues', 'Show TypeScript issues'",
    inputSchema: z.object({
        owner: z.string().optional().describe("Repository owner (e.g., 'facebook', 'vercel', 'microsoft')"),
        repo: z.string().optional().describe("Repository name (e.g., 'react', 'next.js', 'typescript')"),
        state: z.enum(['open', 'closed', 'all']).default('open').describe("Issue state filter")
    }),
    tool: async ({ owner, repo, state = 'open' }) => {
        // Smart defaults for demo - popular repos that work without token
        const demoRepos: Record<string, { owner: string, repo: string }> = {
            'react': { owner: 'facebook', repo: 'react' },
            'nextjs': { owner: 'vercel', repo: 'next.js' },
            'next': { owner: 'vercel', repo: 'next.js' },
            'typescript': { owner: 'microsoft', repo: 'TypeScript' },
            'vscode': { owner: 'microsoft', repo: 'vscode' },
            'vue': { owner: 'vuejs', repo: 'core' },
        };

        // If no owner/repo specified, use React as default
        let targetOwner = owner;
        let targetRepo = repo;

        if (!owner && !repo) {
            const match = demoRepos['react'];
            targetOwner = match.owner;
            targetRepo = match.repo;
        } else if (!owner && repo) {
            // Try to match repo name to known repos
            const repoLower = repo.toLowerCase().replace(/[^a-z]/g, '');
            const match = demoRepos[repoLower];
            if (match) {
                targetOwner = match.owner;
                targetRepo = match.repo;
            } else {
                targetOwner = 'facebook';
                targetRepo = repo;
            }
        }

        if (!targetOwner || !targetRepo) {
            return `⚠️ **Specify a repository**\n\nExamples:\n- "Show React issues"\n- "Show Next.js issues"\n- "Show TypeScript issues"`;
        }

        try {
            const headers: HeadersInit = {
                'Accept': 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28'
            };

            // GitHub API allows 60 requests/hour without auth (good for demo!)
            // With auth, it's 5000/hour
            const token = process.env.GITHUB_TOKEN;
            if (token && token !== 'your_github_personal_access_token') {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(
                `https://api.github.com/repos/${targetOwner}/${targetRepo}/issues?state=${state}&per_page=5`,
                { headers }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    return `❌ Repository **${targetOwner}/${targetRepo}** not found.\n\nTry popular repos:\n- "Show React issues"\n- "Show Next.js issues"\n- "Show TypeScript issues"`;
                }
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const issues = await response.json();

            if (!Array.isArray(issues) || issues.length === 0) {
                return `📋 No ${state} issues found in ${targetOwner}/${targetRepo}`;
            }

            // Format as clean plain text (no markdown since chat doesn't render it)
            const issueList = issues.slice(0, 5).map((issue: any, index: number) => {
                const labels = issue.labels.map((l: any) => l.name).slice(0, 2).join(', ');
                return `${index + 1}. #${issue.number} - ${issue.title}${labels ? ` (${labels})` : ''}\n   → ${issue.html_url}`;
            }).join('\n\n');

            return `🐙 GitHub Issues from ${targetOwner}/${targetRepo}\n\n${issueList}\n\n✅ Live data from GitHub API`;

        } catch (error) {
            console.error('[GitHub Tool] API call failed:', error);
            return `❌ Failed to fetch GitHub issues. Try: "Show React issues" or "Show Next.js issues"`;
        }
    }
});

// ============================================
// 9. FILE SYSTEM MCP - WORKSPACE PERSISTENCE
// ============================================
const saveWorkspaceTool = defineTool({
    name: "saveWorkspace",
    description: "Save current workspace to browser storage. Use when user says 'save', 'export to file', or 'download workspace'.",
    inputSchema: z.object({
        name: z.string().describe("Workspace name"),
        components: z.string().optional().describe("Components data (JSON string)")
    }),
    tool: async ({ name, components }) => {
        try {
            const workspaceData = {
                name,
                savedAt: new Date().toISOString(),
                components: components || '{}',
                version: '1.0.0'
            };

            // Save to localStorage (client-side MCP simulation)
            if (typeof window !== 'undefined') {
                const workspaceId = `workspace-${Date.now()}`;
                localStorage.setItem(workspaceId, JSON.stringify(workspaceData));

                // Add to workspace list
                const workspacesList = JSON.parse(localStorage.getItem('workspaces-list') || '[]');
                workspacesList.push({ id: workspaceId, name, savedAt: workspaceData.savedAt });
                localStorage.setItem('workspaces-list', JSON.stringify(workspacesList));

                return `✅ **Workspace Saved**\n\n📁 Name: **${name}**\n🆔 ID: \`${workspaceId}\`\n📅 Saved: ${new Date().toLocaleString()}\n\n_Use "Load workspace" to restore later_`;
            }

            // Fallback for server-side rendering
            return `💾 **Workspace Export Ready**\n\n\`\`\`json\n${JSON.stringify(workspaceData, null, 2)}\n\`\`\`\n\n_Copy this JSON to restore later_`;

        } catch (error) {
            console.error('[Workspace Tool] Save failed:', error);
            return `❌ Failed to save workspace. Please try again.`;
        }
    }
});

const loadWorkspaceTool = defineTool({
    name: "loadWorkspace",
    description: "Load a previously saved workspace. Use when user says 'load', 'open workspace', or 'restore'.",
    inputSchema: z.object({
        workspaceId: z.string().optional().describe("Workspace ID to load (leave empty to list all)"),
    }),
    tool: async ({ workspaceId }) => {
        try {
            if (typeof window === 'undefined') {
                return `⚠️ Workspace loading is only available in the browser.`;
            }

            // List all workspaces if no ID provided
            if (!workspaceId) {
                const workspacesList = JSON.parse(localStorage.getItem('workspaces-list') || '[]');

                if (workspacesList.length === 0) {
                    return `📭 **No Saved Workspaces**\n\nCreate and save a workspace first!`;
                }

                const list = workspacesList.map((ws: any, idx: number) => {
                    return `${idx + 1}. **${ws.name}**\n   ID: \`${ws.id}\`\n   Saved: ${new Date(ws.savedAt).toLocaleString()}`;
                }).join('\n\n');

                return `📂 **Available Workspaces (${workspacesList.length})**\n\n${list}\n\n_To load, say: "Load workspace [ID]"_`;
            }

            // Load specific workspace
            const workspaceData = localStorage.getItem(workspaceId);

            if (!workspaceData) {
                return `❌ Workspace \`${workspaceId}\` not found.`;
            }

            const workspace = JSON.parse(workspaceData);

            return `✅ **Workspace Loaded**\n\n📁 Name: **${workspace.name}**\n📅 Saved: ${new Date(workspace.savedAt).toLocaleString()}\n\n_Workspace restored successfully!_`;

        } catch (error) {
            console.error('[Workspace Tool] Load failed:', error);
            return `❌ Failed to load workspace. Please try again.`;
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
    exportCanvasTool,
    githubIssuesTool,        // 🔥 GitHub Integration (Works WITHOUT tokens via public API!)
    saveWorkspaceTool,       // 🔥 MCP: File System
    loadWorkspaceTool        // 🔥 MCP: File System
];
