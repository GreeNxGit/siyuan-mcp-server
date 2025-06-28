# SiYuan Note MCP Server
[![smithery badge](https://smithery.ai/badge/@onigeya/siyuan-mcp-server)](https://smithery.ai/server/@onigeya/siyuan-mcp-server)

An MCP server implementation that provides integration with the SiYuan Note system, enabling AI models to access and manipulate note data.

## Features

* Notebook Management
* Document Operations
* Block Control
* File and Asset Management
* SQL Query Support
* Attribute Management
* Export and Conversion
* System Functions

## Command List

All commands support detailed documentation via the `help` command. For example:

```json
{
  "type": "help",
  "params": {
    "type": "block.insertBlock"
  }
}
```

### Asset Management

* `assets.uploadAssets` - Upload assets

### Attribute Management

* `attr.setBlockAttrs` - Set block attributes
* `attr.getBlockAttrs` - Get block attributes

### Block Operations

* `block.insertBlock` - Insert a block
* `block.updateBlock` - Update block content
* `block.deleteBlock` - Delete a block
* `block.moveBlock` - Move a block
* `block.getBlockKramdown` - Get block Kramdown content

### Format Conversion

* `convert.pandoc` - Convert content using Pandoc

### Export Functions

* `export.exportNotebook` - Export notebook
* `export.exportDoc` - Export document

### File Operations

* `file.getFile` - Get file content
* `file.putFile` - Put file content
* `file.removeFile` - Remove file
* `file.readDir` - List files in directory

### File Tree Operations

* `filetree.createDocWithMd` - Create document with Markdown
* `filetree.renameDoc` - Rename document
* `filetree.removeDoc` - Remove document
* `filetree.moveDocs` - Move documents
* `filetree.getHPathByPath` - Get document HPath by path
* `filetree.getHPathByID` - Get document HPath by ID

### Network Proxy

* `network.forwardProxy` - Forward proxy request

### Notebook Management

* `notebook.lsNotebooks` - List all notebooks
* `notebook.openNotebook` - Open notebook
* `notebook.closeNotebook` - Close notebook
* `notebook.renameNotebook` - Rename notebook
* `notebook.createNotebook` - Create notebook
* `notebook.removeNotebook` - Remove notebook
* `notebook.getNotebookConf` - Get notebook configuration
* `notebook.setNotebookConf` - Set notebook configuration

### Notifications

* `notification.pushMsg` - Push message notification
* `notification.pushErrMsg` - Push error message notification

### Query Functions

* `query.sql` - Execute SQL query
* `query.block` - Query block by ID

### Search Functions

* `search.fullTextSearch` - Full text search

### SQL Query

* `sql.sql` - Execute SQL query

### System Functions

* `system.getBootProgress` - Get boot progress
* `system.getVersion` - Get system version
* `system.getCurrentTime` - Get current time

### Template Functions

* `template.renderTemplate` - Render template
* `template.renderSprig` - Render Sprig template

## Usage

### Environment Variables

The server requires the following environment variables:

* `SIYUAN_TOKEN` - SiYuan Note API token (required)
  * Check in SiYuan Note Settings - About
  * Used for API authentication

### Using in Claude Desktop

Add the following configuration to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "siyuan": {
      "command": "npx",
      "args": [
        "-y",
        "@onigeya/siyuan-mcp-server"
      ],
      "env": {
        "SIYUAN_TOKEN": "your-siyuan-token"
      }
    }
  }
}
```

### Local Run

1. Install dependencies:
```bash
pnpm install
```

2. Set environment variables:
```bash
# Windows
set SIYUAN_TOKEN=your-siyuan-token

# Linux/macOS
export SIYUAN_TOKEN=your-siyuan-token
```

3. Start service:
```bash
pnpm start
```

### Docker Run

```bash
docker run --rm -i \
  -e SIYUAN_TOKEN=your-siyuan-token \
  mcp/siyuan
```

## Build

### Requirements

* Node.js >= 23.10.0
* pnpm

### Local Build

```bash
pnpm build
```

### Docker Build

```bash
docker build -t mcp/siyuan .
```

## License

This project is released under the ISC License. This means you can freely use, modify, and distribute this software, subject to the terms and conditions of the ISC License. For detailed information, please refer to the LICENSE file in the project repository.

## Related Resources

- [SiYuan Note](https://github.com/siyuan-note/siyuan)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [SiYuan Note API Documentation](https://github.com/siyuan-note/siyuan/blob/master/API.md)
