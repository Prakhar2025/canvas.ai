'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { GlassCard } from '@/components/ui';

/* ============================================
   ERROR BOUNDARY COMPONENT
   
   A React Error Boundary for catching and
   gracefully handling runtime errors in
   generative components.
   ============================================ */

interface ErrorBoundaryProps {
    /** Child components to wrap */
    children: ReactNode;
    /** Optional fallback UI to render on error */
    fallback?: ReactNode;
    /** Optional callback when error occurs */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * ErrorBoundary - Catches JavaScript errors in child components
 * 
 * @description A React Error Boundary that catches runtime errors
 * in its child component tree and displays a fallback UI instead
 * of crashing the entire application.
 * 
 * @param {ReactNode} children - Child components to wrap
 * @param {ReactNode} fallback - Optional custom fallback UI
 * @param {Function} onError - Optional error callback for logging
 * 
 * @example
 * <ErrorBoundary onError={(error) => console.error(error)}>
 *   <RiskyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to console in development
        console.error('[ErrorBoundary] Caught error:', error);
        console.error('[ErrorBoundary] Error info:', errorInfo);

        // Call optional error callback
        this.props.onError?.(error, errorInfo);
    }

    handleReset = (): void => {
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            // Custom fallback if provided
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <GlassCard className="w-full" padding="md">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 mb-4 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Something went wrong
                        </h3>
                        <p className="text-sm text-gray-400 mb-4 max-w-sm">
                            An error occurred while rendering this component.
                            {this.state.error && (
                                <span className="block mt-2 text-xs text-gray-500 font-mono">
                                    {this.state.error.message}
                                </span>
                            )}
                        </p>
                        <button
                            onClick={this.handleReset}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-sm font-medium rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </button>
                    </div>
                </GlassCard>
            );
        }

        return this.props.children;
    }
}

/**
 * withErrorBoundary - HOC to wrap a component with an error boundary
 * 
 * @description Higher-order component that wraps any component
 * with an ErrorBoundary for automatic error handling.
 * 
 * @param {React.ComponentType} WrappedComponent - Component to wrap
 * @param {ErrorBoundaryProps} errorBoundaryProps - Props for the ErrorBoundary
 * 
 * @example
 * const SafeComponent = withErrorBoundary(RiskyComponent);
 */
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    const ComponentWithErrorBoundary: React.FC<P> = (props) => (
        <ErrorBoundary {...errorBoundaryProps}>
            <WrappedComponent {...props} />
        </ErrorBoundary>
    );

    ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

    return ComponentWithErrorBoundary;
}

export default ErrorBoundary;
