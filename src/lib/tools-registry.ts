import { defineTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * TOOLS REGISTRY
 * 
 * Defines client-side tools (MCP) that the AI can use to interact with the environment.
 * These give the AI "superpowers" like accessing time, searching (mock), or calculating.
 */

// 1. Get Current Time Tool
// Essential for time-aware responses
const getCurrentTimeTool = defineTool({
    name: "getCurrentTime",
    description: "Get the current user's local time and date in ISO format. Use this when the user asks 'what time is it' or 'what is the date'.",
    inputSchema: z.object({}),
    tool: async () => {
        return {
            iso: new Date().toISOString(),
            locale: new Date().toLocaleString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }
});

// 2. Web Search Tool (Mock)
// Simulates web search for demo/hackathon purposes.
// In a production app, this would bridge to an MCP Server or Google Search API.
const webSearchTool = defineTool({
    name: "webSearch",
    description: "Search the web for real-time information. Use this when you do not know the answer or need up-to-date info. Returns a list of simulated search results.",
    inputSchema: z.object({
        query: z.string().describe("The search query keywords")
    }),
    tool: async ({ query }) => {
        // Simulate network delay for "Agent Thinking" effect
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Return structured results pretending to be from a search engine
        return {
            query,
            results: [
                {
                    title: `${query} - Official Documentation`,
                    url: `https://docs.example.com/${query.replace(/\s+/g, '-').toLowerCase()}`,
                    snippet: `Comprehensive guide and API reference for ${query}. Learn how to integrate and use ${query} in your projects.`
                },
                {
                    title: `How to use ${query} (2025 Guide)`,
                    url: `https://dev.to/guides/${query.replace(/\s+/g, '-')}`,
                    snippet: `Best practices for implementing ${query}. Includes code examples, performance tips, and common pitfalls.`
                },
                {
                    title: `${query} vs Alternatives - Comparison`,
                    url: `https://tech-blog.io/compare/${query.replace(/\s+/g, '-')}`,
                    snippet: `Detailed comparison of ${query} against industry standards. Pros, cons, and performance benchmarks.`
                }
            ],
            source: "Simulated Web Search (Canvas AI)"
        };
    }
});

// Registry Array
export const toolsRegistry = [
    getCurrentTimeTool,
    webSearchTool
];
