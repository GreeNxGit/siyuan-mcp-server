import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registry } from '../utils/registry.js';

// Register command query tool
export function registerQueryTool(server: McpServer) {
    server.tool(
        'queryCommands',
        'Query the list of available commands',
        {
            namespace: z.string().optional().describe('Command namespace filter'),
            type: z.string().optional().describe('Command name filter')
        },
        async ({ namespace, type }) => {
            try {
                const result = registry.listCommands(namespace, type);
                const commands = (result._meta || []).map(cmd => ({
                    type: cmd.namespace ? `${cmd.namespace}.${cmd.name}` : cmd.name,
                    description: cmd.description,
                    params: Object.entries(cmd.params)
                        .map(([name, info]) => `${name}: ${info.type}${info.required ? ' (required)' : ' (optional)'} - ${info.description}`)
                        .join('\n    ') || 'No parameters'
                }));
                
                const commandList = commands.map(cmd => 
                    `${cmd.type}: ${cmd.description}\n  Parameters: ${cmd.params}`
                ).join('\n');
                
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: `Available command list:\n${commandList}`
                        }
                    ],
                    _meta: {
                        commands: commands
                    },
                    isError: false
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: error instanceof Error ? error.message : 'Query failed'
                        }
                    ],
                    isError: true
                };
            }
        }
    );
} 