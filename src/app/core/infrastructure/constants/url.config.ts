/**
 * Global API URL Configuration
 * Centralizes all endpoint definitions to avoid hardcoding in adapters.
 */
export const URLConfig = {
    CHAT: {
        HISTORY: '/rest/dark/v1/history',
        SESSIONS: '/rest/dark/v1/history/sessions',
        AGENT_CHAT: '/rest/dark/v1/agent/chat'
    },
    KNOWLEDGE: {
        BASE: '/rest/dark/v1/knowledge',
        UPLOAD: '/rest/dark/v1/upload/knowledge'
    },
    EVENTS: {
        BASE: '/rest/dark/v1/time-limit-events'
    },
    PROMPT: {
        TEMPLATES: '/rest/biz/v1/prompts/templates',
        VERSIONS: '/rest/biz/v1/prompts/versions'
    },
    MCP: {
        PLUGINS: '/rest/biz/v1/mcp-plugins',
        TOGGLE: (id: string) => `/rest/biz/v1/mcp-plugins/${id}/toggle`,
        REFRESH: (id: string) => `/rest/biz/v1/mcp-plugins/${id}/refresh`
    },
    DEVICES: {
        // Future placeholders
    },
    EXTERNAL: {
        CASDOOR_ACCOUNT: '/account?application=ai-agent'
    }
};
