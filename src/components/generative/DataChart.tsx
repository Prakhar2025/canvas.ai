'use client';

import { useState, useMemo, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    LineChart as LineChartIcon,
    PieChart as PieChartIcon,
    TrendingUp,
    TrendingDown,
    Minus,
    Download,
    Maximize2
} from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';
import { GlassCard } from '@/components/ui';
import { cn } from '@/lib/utils';
import { z } from 'zod';

/* ============================================
   DATA CHART COMPONENT
   
   A professional data visualization component with:
   - Bar, Line, Area, Pie chart types
   - Interactive tooltips
   - Responsive design
   - Custom color themes
   - Data summary stats
   ============================================ */

/** Chart color palette - Premium dark theme */
const CHART_COLORS = [
    '#6366f1', // Indigo
    '#8b5cf6', // Violet
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#14b8a6', // Teal
    '#06b6d4', // Cyan
];

/** Zod schema for data point */
const DataPointSchema = z.object({
    name: z.string(),
    value: z.number(),
    category: z.string().optional(),
});

/** Zod schema for type validation */
export const DataChartSchema = z.object({
    title: z.string().default('Data Chart'),
    chartType: z.enum(['bar', 'line', 'area', 'pie']).default('bar'),
    data: z.array(DataPointSchema).default([]),
    xAxisLabel: z.string().optional(),
    yAxisLabel: z.string().optional(),
    showLegend: z.boolean().default(true),
    showGrid: z.boolean().default(true),
});

/** Props type inferred from Zod schema */
export type DataChartProps = z.infer<typeof DataChartSchema>;
export type DataPoint = z.infer<typeof DataPointSchema>;
export type ChartType = 'bar' | 'line' | 'area' | 'pie';

const chartTypeConfig: Record<ChartType, { label: string; icon: typeof BarChart3 }> = {
    bar: { label: 'Bar', icon: BarChart3 },
    line: { label: 'Line', icon: LineChartIcon },
    area: { label: 'Area', icon: TrendingUp },
    pie: { label: 'Pie', icon: PieChartIcon },
};

/**
 * DataChart - A professional data visualization component
 * 
 * @description Renders interactive charts with multiple types (bar, line, area, pie),
 * summary statistics, and responsive design.
 * 
 * @param {string} title - The chart title
 * @param {'bar' | 'line' | 'area' | 'pie'} chartType - Type of chart
 * @param {DataPoint[]} data - Array of data points
 * @param {string} xAxisLabel - Optional X-axis label
 * @param {string} yAxisLabel - Optional Y-axis label
 * @param {boolean} showLegend - Whether to show legend
 * @param {boolean} showGrid - Whether to show grid lines
 * 
 * @example
 * <DataChart
 *   title="Monthly Sales"
 *   chartType="bar"
 *   data={[{ name: 'Jan', value: 100 }, { name: 'Feb', value: 200 }]}
 * />
 */
export function DataChart({
    title = 'Data Chart',
    chartType: initialChartType = 'bar',
    data = [],
    xAxisLabel,
    yAxisLabel,
    showLegend = true,
    showGrid = true,
}: DataChartProps) {
    const [chartType, setChartType] = useState<ChartType>(initialChartType);
    const [isExpanded, setIsExpanded] = useState(false);
    const instanceId = useId();

    // Calculate statistics
    const stats = useMemo(() => {
        if (data.length === 0) return { total: 0, average: 0, max: 0, min: 0, trend: 'neutral' as const };

        const values = data.map(d => d.value);
        const total = values.reduce((sum, v) => sum + v, 0);
        const average = total / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);

        // Calculate trend (compare first half vs second half)
        const midpoint = Math.floor(values.length / 2);
        const firstHalf = values.slice(0, midpoint).reduce((s, v) => s + v, 0) / midpoint || 0;
        const secondHalf = values.slice(midpoint).reduce((s, v) => s + v, 0) / (values.length - midpoint) || 0;
        const trend = secondHalf > firstHalf * 1.05 ? 'up' as const : secondHalf < firstHalf * 0.95 ? 'down' as const : 'neutral' as const;

        return { total, average, max, min, trend };
    }, [data]);

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
        if (active && payload && payload.length) {
            return (
                <div className="px-3 py-2 bg-gray-900/95 border border-[rgba(255,255,255,0.1)] rounded-lg shadow-xl backdrop-blur-sm">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-white">
                        {payload[0].value.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Format number for display
    const formatNumber = (num: number): string => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toFixed(0);
    };

    // Render chart based on type
    const renderChart = () => {
        const chartHeight = isExpanded ? 400 : 280;

        if (data.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <BarChart3 className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm">No data available</p>
                    <p className="text-xs mt-1">Add data points to visualize</p>
                </div>
            );
        }

        const commonProps = {
            data,
            margin: { top: 20, right: 30, left: 20, bottom: 20 },
        };

        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <BarChart {...commonProps}>
                            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />}
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                label={xAxisLabel ? { value: xAxisLabel, position: 'bottom', fill: '#94a3b8' } : undefined}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickFormatter={formatNumber}
                                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'left', fill: '#94a3b8' } : undefined}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {showLegend && <Legend wrapperStyle={{ paddingTop: 20 }} />}
                            <Bar
                                dataKey="value"
                                fill="#6366f1"
                                radius={[4, 4, 0, 0]}
                                name="Value"
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <LineChart {...commonProps}>
                            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />}
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickFormatter={formatNumber}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {showLegend && <Legend wrapperStyle={{ paddingTop: 20 }} />}
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#6366f1"
                                strokeWidth={2}
                                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, fill: '#818cf8' }}
                                name="Value"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <AreaChart {...commonProps}>
                            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />}
                            <XAxis
                                dataKey="name"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickFormatter={formatNumber}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {showLegend && <Legend wrapperStyle={{ paddingTop: 20 }} />}
                            <defs>
                                <linearGradient id={`gradient-${instanceId}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill={`url(#gradient-${instanceId})`}
                                name="Value"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                );

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={chartHeight}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={isExpanded ? 80 : 60}
                                outerRadius={isExpanded ? 120 : 100}
                                paddingAngle={2}
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                        stroke="rgba(0,0,0,0.3)"
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            {showLegend && <Legend wrapperStyle={{ paddingTop: 20 }} />}
                        </PieChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };

    return (
        <GlassCard
            className={cn("w-full transition-all", isExpanded && "max-w-4xl")}
            padding="none"
            role="figure"
            aria-label={`${title} - ${chartTypeConfig[chartType].label} chart`}
        >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <BarChart3 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                {stats.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />}
                                {stats.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-rose-400" />}
                                {stats.trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-gray-400" />}
                                <span className={cn(
                                    "text-xs",
                                    stats.trend === 'up' ? 'text-emerald-400' : stats.trend === 'down' ? 'text-rose-400' : 'text-gray-400'
                                )}>
                                    {stats.trend === 'up' ? 'Trending up' : stats.trend === 'down' ? 'Trending down' : 'Stable'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[rgba(255,255,255,0.05)]"
                            aria-label={isExpanded ? 'Collapse chart' : 'Expand chart'}
                        >
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Chart Type Selector */}
                <div className="flex gap-2">
                    {(Object.keys(chartTypeConfig) as ChartType[]).map((type) => {
                        const Icon = chartTypeConfig[type].icon;
                        return (
                            <button
                                key={type}
                                onClick={() => setChartType(type)}
                                className={cn(
                                    "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all",
                                    "flex items-center justify-center gap-1.5",
                                    chartType === type
                                        ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300"
                                        : "bg-[rgba(255,255,255,0.03)] text-gray-400 hover:bg-[rgba(255,255,255,0.05)] border border-transparent"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{chartTypeConfig[type].label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Stats Summary */}
            {data.length > 0 && (
                <div className="grid grid-cols-4 gap-2 px-4 sm:px-6 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.2)]">
                    <div className="text-center">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-sm font-semibold text-white">{formatNumber(stats.total)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500">Average</p>
                        <p className="text-sm font-semibold text-white">{formatNumber(stats.average)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500">Max</p>
                        <p className="text-sm font-semibold text-emerald-400">{formatNumber(stats.max)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500">Min</p>
                        <p className="text-sm font-semibold text-rose-400">{formatNumber(stats.min)}</p>
                    </div>
                </div>
            )}

            {/* Chart Area */}
            <div className="p-4 sm:p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={chartType}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderChart()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </GlassCard>
    );
}

export default DataChart;
