import { z } from 'zod';

/**
 * MCP Response Format
 */
export interface McpResponse<T = any> {
    content: Array<{
        type: string;
        text: string;
    }>;
    _meta?: T;
    isError?: boolean;
}

/**
 * Command Handler Interface
 */
export interface CommandHandler<P = unknown> {
    /** Command namespace */
    namespace: string;
    /** Command name */
    name: string;
    /** Command description */
    description: string;
    /** Parameter validation schema */
    params: z.ZodSchema<P>;
    /** Command handler function */
    handler: (params: P) => Promise<McpResponse>;
    /** Command documentation */
    documentation?: {
        /** Detailed description */
        description: string;
        /** Parameter description */
        params: Record<string, {
            type: string;
            description: string;
            required: boolean;
        }>;
        /** Return value description */
        returns: {
            type: string;
            description: string;
            properties: Record<string, unknown>;
        };
        /** Usage examples */
        examples: Array<{
            description: string;
            params: Record<string, unknown>;
            response: Record<string, unknown>;
        }>;
        /** API documentation link */
        apiLink?: string;
    };
}

/**
 * Command Registry Class
 * Used to manage and execute commands
 */
class CommandRegistry {
    private static instance: CommandRegistry | null = null;
    private commands: Map<string, CommandHandler<any>>;

    private constructor() {
        this.commands = new Map();
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): CommandRegistry {
        if (!CommandRegistry.instance) {
            CommandRegistry.instance = new CommandRegistry();
        }
        return CommandRegistry.instance;
    }

    /**
     * Get full command name
     * @param namespace Namespace
     * @param name Command name
     * @returns Full command name
     */
    private getFullCommandName(namespace: string, name: string): string {
        return `${namespace}.${name}`;
    }

    /**
     * Parse full command name
     * @param fullName Full command name
     * @returns [namespace, command name]
     */
    private parseFullCommandName(fullName: string): [string, string] {
        const parts = fullName.split('.');
        if (parts.length === 1) {
            return ['', parts[0]];
        }
        return [parts[0], parts[1]];
    }

    /**
     * Register command
     * @param command Command handler
     * @throws {Error} Throws a warning if the command already exists
     */
    public registerCommand<P>(command: CommandHandler<P>): void {
        const fullName = this.getFullCommandName(command.namespace, command.name);
        if (this.commands.has(fullName)) {
            console.warn(`Warning: Command ${fullName} already exists and will be overwritten`);
        }
        this.commands.set(fullName, command);
    }

    /**
     * Get command list
     * @returns MCP response for the command list
     */
    public listCommands(namespace?: string, type?: string): McpResponse<Array<{
        namespace: string;
        name: string;
        description: string;
        params: Record<string, {
            type: string;
            description: string;
            required: boolean;
        }>;
    }>> {
        const commands = Array.from(this.commands.entries()).filter(([fullName, cmd]) => {
            const [cmdNamespace] = this.parseFullCommandName(fullName);
            if (namespace && !cmdNamespace.includes(namespace)) return false;
            if (type && !cmd.name.includes(type)) return false;
            return true;
        }).map(([fullName, cmd]) => {
            // Get parameter descriptions
            const params: Record<string, {
                type: string;
                description: string;
                required: boolean;
            }> = {};

            try {
                if (cmd.params instanceof z.ZodObject) {
                    const shape = cmd.params._def.shape();
                    Object.entries(shape).forEach(([key, value]) => {
                        if (value instanceof z.ZodType) {
                            const isOptional = value instanceof z.ZodOptional;
                            params[key] = {
                                type: value._def.typeName || 'unknown',
                                description: value.description || 'No description',
                                required: !isOptional
                            };
                        }
                    });
                }
            } catch {
                // If shape cannot be obtained, return an empty object
            }

            const [cmdNamespace, cmdName] = this.parseFullCommandName(fullName);
            return {
                namespace: cmdNamespace,
                name: cmdName,
                description: cmd.description,
                params
            };
        });

        const commandList = commands.map(cmd => {
            const fullName = cmd.namespace ? `${cmd.namespace}.${cmd.name}` : cmd.name;
            const paramsList = Object.entries(cmd.params).map(([name, info]) => 
                `    ${name}: ${info.type}${info.required ? ' (required)' : ' (optional)'} - ${info.description}`
            ).join('\n');
            
            return `${fullName}: ${cmd.description}\n${paramsList ? `  Parameters:\n${paramsList}` : '  Parameters: No parameters'}`;
        }).join('\n\n');

        return {
            content: [
                {
                    type: 'text',
                    text: `Available command list:\n${commandList}`
                }
            ],
            _meta: commands
        };
    }

    /**
     * Get command help information
     * @param commandName Command name
     * @returns MCP response for the command help information
     */
    public getCommandHelp(commandName: string): McpResponse<CommandHandler['documentation']> {
        // Try to find the full command name directly
        let command = this.commands.get(commandName);
        
        if (!command) {
            // If not found, try to parse the namespace
            const [namespace, name] = this.parseFullCommandName(commandName);
            const fullName = this.getFullCommandName(namespace, name);
            command = this.commands.get(fullName);
        }

        if (!command) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Command ${commandName} does not exist`
                    }
                ],
                isError: true
            };
        }

        // Get parameter descriptions
        const params: Record<string, {
            type: string;
            description: string;
            required: boolean;
        }> = {};

        try {
            if (command.params instanceof z.ZodObject) {
                const shape = command.params._def.shape();
                Object.entries(shape).forEach(([key, value]) => {
                    if (value instanceof z.ZodType) {
                        const isOptional = value instanceof z.ZodOptional;
                        params[key] = {
                            type: value._def.typeName || 'unknown',
                            description: value.description || 'No description',
                            required: !isOptional
                        };
                    }
                });
            }
        } catch {
            // If shape cannot be obtained, return an empty object
        }

        const help = command.documentation || {
            description: command.description,
            params,
            returns: {
                type: 'object',
                description: 'Command execution result',
                properties: {}
            },
            examples: []
        };

        // Format help information
        const fullName = this.getFullCommandName(command.namespace, command.name);
        const paramsList = Object.entries(params).map(([name, info]) => 
            `  ${name}: ${info.type}${info.required ? ' (required)' : ' (optional)'}\n    ${info.description}`
        ).join('\n');

        const returnInfo = help.returns;
        const propertiesList = Object.entries(returnInfo.properties).map(([name, desc]) => 
            `  ${name}: ${desc}`
        ).join('\n');

        const examplesList = help.examples.map(example => 
            `Example: ${example.description}\n` +
            `  Parameters: ${JSON.stringify(example.params, null, 2)}\n` +
            `  Response: ${JSON.stringify(example.response, null, 2)}`
        ).join('\n\n');

        const helpText = [
            `Command: ${fullName}`,
            `Description: ${help.description}`,
            '',
            'Parameters:',
            paramsList || '  No parameters',
            '',
            'Return Value:',
            `  Type: ${returnInfo.type}`,
            `  Description: ${returnInfo.description}`,
            '  Properties:',
            propertiesList || '    No properties',
            '',
            examplesList ? 'Examples:\n' + examplesList : 'Examples: No examples',
            '',
            help.apiLink ? `API Documentation: ${help.apiLink}` : ''
        ].filter(Boolean).join('\n');

        return {
            content: [
                {
                    type: 'text',
                    text: helpText
                }
            ],
            _meta: help
        };
    }

    /**
     * Execute command
     * @param commandName Command name
     * @param params Command parameters
     * @returns MCP response for the command execution result
     * @throws {Error} Throws an error if the command does not exist or parameter validation fails
     */
    public async executeCommand(commandName: string, params: unknown = {}): Promise<McpResponse> {
        // Try to find the full command name directly
        let command = this.commands.get(commandName);
        
        if (!command) {
            // If not found, try to parse the namespace
            const [namespace, name] = this.parseFullCommandName(commandName);
            const fullName = this.getFullCommandName(namespace, name);
            command = this.commands.get(fullName);
        }

        if (!command) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Command ${commandName} does not exist`
                    }
                ],
                isError: true
            };
        }

        try {
            const validatedParams = command.params.parse(params);
            return await command.handler(validatedParams);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const issues = error.issues.map(issue => 
                    `  - ${issue.path.join('.')}: ${issue.message}`
                ).join('\n');
                
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Parameter validation failed:\n${issues}`
                        }
                    ],
                    isError: true
                };
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: `Command execution failed: ${error instanceof Error ? error.message : String(error)}`
                    }
                ],
                isError: true
            };
        }
    }
}

export const registry = CommandRegistry.getInstance(); 