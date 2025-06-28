import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registry } from '../utils/registry.js';

// Register help tool
export function registerHelpTool(server: McpServer) {
    server.tool(
        'help',
        'Get help information for a command',
        {
            type: z.string().describe('Command type')
        },
        async ({ type }) => {
            try {
                const result = registry.getCommandHelp(type);
                if (result.isError) {
                    return {
                        content: [
                            {
                                type: 'text' as const,
                                text: result.content[0].text
                            }
                        ],
                        isError: true
                    };
                }

                const doc = result._meta;
                if (!doc) {
                    return {
                        content: [
                            {
                                type: 'text' as const,
                                text: `Command ${type} has no help information`
                            }
                        ],
                        isError: true
                    };
                }

                // Build help text
                const helpText = [
                    `Command: ${type}`,
                    `Description: ${doc.description}`,
                    '',
                    'Parameters:',
                    ...Object.entries(doc.params).map(([key, value]) => 
                        `  ${key}: ${value.type}${value.required ? ' (required)' : ' (optional)'}\n    ${value.description}`
                    ),
                    '',
                    'Return Value:',
                    `  Type: ${doc.returns.type}`,
                    `  Description: ${doc.returns.description}`,
                    '  Properties:',
                    ...Object.entries(doc.returns.properties).map(([key, desc]) => 
                        `    ${key}: ${String(desc)}`
                    ),
                    '',
                    'Examples:',
                    ...doc.examples.map(example => [
                        `  ${example.description}:`,
                        '    Parameters:',
                        `      ${JSON.stringify(example.params, null, 2).replace(/\n/g, '\n      ')}`,
                        '    Response:',
                        `      ${JSON.stringify(example.response, null, 2).replace(/\n/g, '\n      ')}`
                    ]).flat(),
                    '',
                    doc.apiLink ? `API Documentation: ${doc.apiLink}` : ''
                ].filter(Boolean).join('\n');

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: helpText
                        }
                    ],
                    _meta: {
                        documentation: doc
                    },
                    isError: false
                };
            } catch (error) {
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: error instanceof Error ? error.message : 'Failed to get help'
                        }
                    ],
                    isError: true
                };
            }
        }
    );
} 