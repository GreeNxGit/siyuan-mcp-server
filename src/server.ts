import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerCommandTool } from './tools/commands.js';
import { registerQueryTool } from './tools/queries.js';
import { registerHelpTool } from './tools/help.js';
import { registerNotebookHandlers } from './tools/commands/notebook.js';
import { registerFiletreeHandlers } from './tools/commands/filetree.js';
import { registerBlockHandlers } from './tools/commands/block.js';
import { registerAttrHandlers } from './tools/commands/attr.js';
import { registerSqlHandlers } from './tools/commands/sql.js';
import { registerQueryHandlers } from './tools/commands/query.js';
import { registerSearchHandlers } from './tools/commands/search.js';
import { registerAssetsHandlers } from './tools/commands/assets.js';
import { registerFileHandlers } from './tools/commands/file.js';
import { registerExportHandlers } from './tools/commands/export.js';
import { registerTemplateHandlers } from './tools/commands/template.js';
import { registerNotificationHandlers } from './tools/commands/notification.js';
import { registerSystemHandlers } from './tools/commands/system.js';
import { registerConvertHandlers } from './tools/commands/convert.js';
import { registerNetworkHandlers } from './tools/commands/network.js';

// Create an MCP server instance
const server = new McpServer({
    name: "siyuan-mcp-server",
    version: "1.0.0",
    capabilities: {
        tools: {},
    },
});

// Create a transport layer instance
const transport = new StdioServerTransport();

// Register command handlers
registerNotebookHandlers();
registerFiletreeHandlers();
registerBlockHandlers();
registerAttrHandlers();
registerSqlHandlers();
registerQueryHandlers();
registerSearchHandlers();
registerAssetsHandlers();
registerFileHandlers();
registerExportHandlers();
registerTemplateHandlers();
registerNotificationHandlers();
registerSystemHandlers();
registerConvertHandlers();
registerNetworkHandlers();

// Register tools
registerCommandTool(server);
registerQueryTool(server);
registerHelpTool(server);

// Start the server
server.connect(transport);

export { server };