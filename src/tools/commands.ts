import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registry } from '../utils/registry.js';

// Register command execution tool
export function registerCommandTool(server: McpServer) {
    server.tool(
        'executeCommand',
        'Execute the specified command',
        {
            type: z.string().describe('Command type'),
            params: z.record(z.any()).optional().describe('Command parameters')
        },
        async ({ type, params = {} }) => {
            try {
                const result = await registry.executeCommand(type, params);
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: result.content[0].text
                        }
                    ],
                    _meta: {
                        result: result._meta || {}
                    },
                    isError: result.isError
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: error instanceof Error ? error.message : 'Command execution failed'
                        }
                    ],
                    isError: true
                };
            }
        }
    );
} 