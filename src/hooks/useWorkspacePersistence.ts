'use client';

import { useState, useEffect, useCallback } from 'react';

/* ============================================
   WORKSPACE PERSISTENCE HOOK
   
   Professional localStorage-based persistence for:
   - Canvas components state
   - User preferences
   - Session data
   ============================================ */

const STORAGE_PREFIX = 'canvas-ai';

interface WorkspaceData {
    /** Unique workspace ID */
    id: string;
    /** Workspace name */
    name: string;
    /** Last saved timestamp */
    lastSaved: string;
    /** Component states (serialized) */
    components?: Record<string, unknown>;
    /** User preferences */
    preferences?: {
        theme?: 'dark' | 'light';
        voiceEnabled?: boolean;
        soundEffects?: boolean;
    };
}

interface UseWorkspacePersistenceOptions {
    /** Auto-save interval in milliseconds (default: 30000 = 30s) */
    autoSaveInterval?: number;
    /** Whether to enable auto-save */
    enableAutoSave?: boolean;
}

/**
 * useWorkspacePersistence - Persist workspace state to localStorage
 * 
 * @example
 * const { workspace, saveWorkspace, loadWorkspace, clearWorkspace } = useWorkspacePersistence();
 */
export function useWorkspacePersistence(options: UseWorkspacePersistenceOptions = {}) {
    const { autoSaveInterval = 30000, enableAutoSave = true } = options;

    const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    /** Get storage key */
    const getStorageKey = useCallback((key: string) => `${STORAGE_PREFIX}:${key}`, []);

    /** Save workspace to localStorage */
    const saveWorkspace = useCallback((data: Partial<WorkspaceData>) => {
        try {
            setIsSaving(true);
            const workspaceId = data.id || workspace?.id || `workspace-${Date.now()}`;

            const workspaceData: WorkspaceData = {
                id: workspaceId,
                name: data.name || workspace?.name || 'My Workspace',
                lastSaved: new Date().toISOString(),
                components: data.components || workspace?.components,
                preferences: { ...workspace?.preferences, ...data.preferences },
            };

            localStorage.setItem(getStorageKey('current'), JSON.stringify(workspaceData));

            // Also save to workspace history
            const historyKey = getStorageKey('history');
            const history: string[] = JSON.parse(localStorage.getItem(historyKey) || '[]');
            if (!history.includes(workspaceId)) {
                history.unshift(workspaceId);
                localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 10))); // Keep last 10
            }

            setWorkspace(workspaceData);
            setLastSaved(new Date());
            setIsSaving(false);

            return { success: true, workspace: workspaceData };
        } catch (error) {
            console.error('Failed to save workspace:', error);
            setIsSaving(false);
            return { success: false, error };
        }
    }, [workspace, getStorageKey]);

    /** Load workspace from localStorage */
    const loadWorkspace = useCallback((workspaceId?: string) => {
        try {
            const key = workspaceId
                ? getStorageKey(`workspace:${workspaceId}`)
                : getStorageKey('current');

            const data = localStorage.getItem(key);
            if (data) {
                const parsed = JSON.parse(data) as WorkspaceData;
                setWorkspace(parsed);
                setLastSaved(new Date(parsed.lastSaved));
                return { success: true, workspace: parsed };
            }
            return { success: false, error: 'No workspace found' };
        } catch (error) {
            console.error('Failed to load workspace:', error);
            return { success: false, error };
        }
    }, [getStorageKey]);

    /** Clear current workspace */
    const clearWorkspace = useCallback(() => {
        try {
            localStorage.removeItem(getStorageKey('current'));
            setWorkspace(null);
            setLastSaved(null);
            return { success: true };
        } catch (error) {
            console.error('Failed to clear workspace:', error);
            return { success: false, error };
        }
    }, [getStorageKey]);

    /** Get workspace history */
    const getWorkspaceHistory = useCallback((): string[] => {
        try {
            return JSON.parse(localStorage.getItem(getStorageKey('history')) || '[]');
        } catch {
            return [];
        }
    }, [getStorageKey]);

    /** Save user preference */
    const savePreference = useCallback(<K extends keyof NonNullable<WorkspaceData['preferences']>>(
        key: K,
        value: NonNullable<WorkspaceData['preferences']>[K]
    ) => {
        const newPreferences = { ...workspace?.preferences, [key]: value };
        saveWorkspace({ preferences: newPreferences });
    }, [workspace, saveWorkspace]);

    /** Get user preference */
    const getPreference = useCallback(<K extends keyof NonNullable<WorkspaceData['preferences']>>(
        key: K
    ): NonNullable<WorkspaceData['preferences']>[K] | undefined => {
        return workspace?.preferences?.[key];
    }, [workspace]);

    // Load workspace on mount
    useEffect(() => {
        loadWorkspace();
    }, [loadWorkspace]);

    // Auto-save interval
    useEffect(() => {
        if (!enableAutoSave || !workspace) return;

        const interval = setInterval(() => {
            saveWorkspace({});
        }, autoSaveInterval);

        return () => clearInterval(interval);
    }, [enableAutoSave, autoSaveInterval, workspace, saveWorkspace]);

    return {
        /** Current workspace data */
        workspace,
        /** Whether currently saving */
        isSaving,
        /** Last saved timestamp */
        lastSaved,
        /** Save workspace to localStorage */
        saveWorkspace,
        /** Load workspace from localStorage */
        loadWorkspace,
        /** Clear current workspace */
        clearWorkspace,
        /** Get workspace history (IDs) */
        getWorkspaceHistory,
        /** Save a user preference */
        savePreference,
        /** Get a user preference */
        getPreference,
    };
}

/**
 * Quick storage utilities for simple key-value persistence
 */
export const storage = {
    get: <T>(key: string, defaultValue?: T): T | undefined => {
        try {
            const item = localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },

    set: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value));
        } catch (error) {
            console.error('Storage set failed:', error);
        }
    },

    remove: (key: string): void => {
        try {
            localStorage.removeItem(`${STORAGE_PREFIX}:${key}`);
        } catch (error) {
            console.error('Storage remove failed:', error);
        }
    },

    clear: (): void => {
        try {
            Object.keys(localStorage)
                .filter(key => key.startsWith(STORAGE_PREFIX))
                .forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('Storage clear failed:', error);
        }
    },
};

export default useWorkspacePersistence;
