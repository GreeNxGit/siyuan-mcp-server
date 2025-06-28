import { z } from 'zod';
import { createHandler } from '../../utils/client.js';
import { registry } from '../../utils/registry.js';
import { CommandHandler } from '../../utils/registry.js';

// Define parameter types
const notebookSchema = z.object({
    notebook: z.string().describe('Notebook ID')
});

const notebookAndNameSchema = z.object({
    notebook: z.string().describe('Notebook ID'),
    name: z.string().describe('New name')
});

const nameSchema = z.object({
    name: z.string().describe('Notebook name')
});

const notebookAndConfSchema = z.object({
    notebook: z.string().describe('Notebook ID'),
    conf: z.object({
        name: z.string().optional().describe('Notebook name'),
        closed: z.boolean().optional().describe('Whether it is closed'),
        refCreateSavePath: z.string().optional().describe('Save path for new documents'),
        createDocNameTemplate: z.string().optional().describe('New document name template'),
        dailyNoteSavePath: z.string().optional().describe('Daily note save path'),
        dailyNoteTemplate: z.string().optional().describe('Daily note template')
    }).describe('Notebook configuration')
});

const namespace = 'notebook';

// List notebooks
const lsNotebooksHandler: CommandHandler = {
    namespace,
    name: 'lsNotebooks',
    description: 'List all notebooks',
    params: z.object({}),
    handler: createHandler('/api/notebook/lsNotebooks'),
    documentation: {
        description: 'List all notebooks',
        params: {},
        returns: {
            type: 'array',
            description: 'List of notebooks',
            properties: {
                id: 'Notebook ID',
                name: 'Notebook name',
                icon: 'Notebook icon',
                sort: 'Sort weight',
                closed: 'Whether it is closed'
            }
        },
        examples: [
            {
                description: 'This example retrieves a list of all notebooks in the system, including their IDs, names, icons, sort order, and current status.',
                params: {},
                response: {
                    notebooks: [
                        {
                            id: "20210817205410-2kvfpfn",
                            name: "Test Notebook",
                            icon: "1f4d4",
                            sort: 0,
                            closed: false
                        }
                    ]
                }
            }
        ],
        apiLink: 'https://github.com/siyuan-note/siyuan/blob/master/API.md#list-notebooks'
    }
};

// Open notebook
const openNotebookHandler: CommandHandler = {
    namespace,
    name: 'openNotebook',
    description: 'Open notebook',
    params: notebookSchema,
    handler: createHandler('/api/notebook/openNotebook'),
    documentation: {
        description: 'Open notebook',
        params: {
            notebook: {
                type: 'string',
                description: 'Notebook ID',
                required: true
            }
        },
        returns: {
            type: 'object',
            description: 'Operation result',
            properties: {}
        },
        examples: [
            {
                description: 'This example demonstrates opening a previously closed notebook using its unique identifier, making it available for access and editing.',
                params: {
                    notebook: "20210817205410-2kvfpfn"
                },
                response: {}
            }
        ],
        apiLink: 'https://github.com/siyuan-note/siyuan/blob/master/API.md#open-a-notebook'
    }
};

// Close notebook
const closeNotebookHandler: CommandHandler = {
    namespace,
    name: 'closeNotebook',
    description: 'Close notebook',
    params: notebookSchema,
    handler: createHandler('/api/notebook/closeNotebook'),
    documentation: {
        description: 'Close notebook',
        params: {
            notebook: {
                type: 'string',
                description: 'Notebook ID',
                required: true
            }
        },
        returns: {
            type: 'object',
            description: 'Operation result',
            properties: {}
        },
        examples: [
            {
                description: 'This example shows how to close a notebook temporarily, preventing access to its contents while preserving all data.',
                params: {
                    notebook: "20210817205410-2kvfpfn"
                },
                response: {}
            }
        ],
        apiLink: 'https://github.com/siyuan-note/siyuan/blob/master/API.md#close-a-notebook'
    }
};

// Rename notebook
const renameNotebookHandler: CommandHandler = {
    namespace,
    name: 'renameNotebook',
    description: 'Rename notebook',
    params: notebookAndNameSchema,
    handler: createHandler('/api/notebook/renameNotebook'),
    documentation: {
        description: 'Rename notebook',
        params: {
            notebook: {
                type: 'string',
                description: 'Notebook ID',
                required: true
            },
            name: {
                type: 'string',
                description: 'New name',
                required: true
            }
        },
        returns: {
            type: 'object',
            description: 'Operation result',
            properties: {}
        },
        examples: [
            {
                description: 'This example demonstrates changing the display name of an existing notebook while maintaining all its contents and settings.',
                params: {
                    notebook: "20210817205410-2kvfpfn",
                    name: "New Notebook Name"
                },
                response: {}
            }
        ],
        apiLink: 'https://github.com/siyuan-note/siyuan/blob/master/API.md#rename-a-notebook'
    }
};

// Create notebook
const createNotebookHandler: CommandHandler = {
    namespace,
    name: 'createNotebook',
    description: 'Create notebook',
    params: nameSchema,
    handler: createHandler('/api/notebook/createNotebook'),
    documentation: {
        description: 'Create notebook',
        params: {
            name: {
                type: 'string',
                description: 'Notebook name',
                required: true
            }
        },
        returns: {
            type: 'object',
            description: 'Operation result',
            properties: {
                notebook: 'ID of the newly created notebook'
            }
        },
        examples: [
            {
                description: 'This example shows how to create a new notebook with a specified name, which will be initialized with default settings and structure.',
                params: {
                    name: "New Notebook"
                },
                response: {
                    notebook: "20210817205410-2kvfpfn"
                }
            }
        ],
        apiLink: 'https://github.com/siyuan-note/siyuan/blob/master/API.md#create-a-notebook'
    }
};

// Delete notebook
const removeNotebookHandler: CommandHandler = {
    namespace,
    name: 'removeNotebook',
    description: 'Delete notebook',
    params: notebookSchema,
    handler: createHandler('/api/notebook/removeNotebook'),
    documentation: {
        description: 'Delete notebook',
        params: {
            notebook: {
                type: 'string',
                description: 'Notebook ID',
                required: true
            }
        },
        returns: {
            type: 'object',
            description: 'Operation result',
            properties: {}
        },
        examples: [
            {
                description: 'This example demonstrates permanently removing a notebook and all its contents from the system using its unique identifier.',
                params: {
                    notebook: "20210817205410-2kvfpfn"
                },
                response: {}
            }
        ],
        apiLink: 'https://github.com/siyuan-note/siyuan/blob/master/API.md#remove-a-notebook'
    }
};

// Get notebook configuration
const getNotebookConfHandler: CommandHandler = {
    namespace,
    name: 'getNotebookConf',
    description: 'Get notebook configuration',
    params: notebookSchema,
    handler: createHandler('/api/notebook/getNotebookConf'),
    documentation: {
        description: 'Get notebook configuration',
        params: {
            notebook: {
                type: 'string',
                description: 'Notebook ID',
                required: true
            }
        },
        returns: {
            type: 'object',
            description: 'Notebook configuration',
            properties: {
                name: 'Notebook name',
                closed: 'Whether it is closed',
                refCreateSavePath: 'Save path for new documents',
                createDocNameTemplate: 'New document name template',
                dailyNoteSavePath: 'Daily note save path',
                dailyNoteTemplate: 'Daily note template'
            }
        },
        examples: [
            {
                description: 'This example retrieves the complete configuration of a notebook, including its name, status, and various path and template settings.',
                params: {
                    notebook: "20210817205410-2kvfpfn"
                },
                response: {
                    name: "Test Notebook",
                    closed: false,
                    refCreateSavePath: "/",
                    createDocNameTemplate: "${title}",
                    dailyNoteSavePath: "/daily note/",
                    dailyNoteTemplate: ""
                }
            }
        ],
        apiLink: 'https://github.com/siyuan-note/siyuan/blob/master/API.md#get-notebook-configuration'
    }
};

// Set notebook configuration
const setNotebookConfHandler: CommandHandler = {
    namespace,
    name: 'setNotebookConf',
    description: 'Set notebook configuration',
    params: notebookAndConfSchema,
    handler: createHandler('/api/notebook/setNotebookConf'),
    documentation: {
        description: 'Set notebook configuration',
        params: {
            notebook: {
                type: 'string',
                description: 'Notebook ID',
                required: true
            },
            conf: {
                type: 'object',
                description: 'Notebook configuration',
                required: true
            }
        },
        returns: {
            type: 'object',
            description: 'Operation result',
            properties: {}
        },
        examples: [
            {
                description: 'Set notebook configuration',
                params: {
                    notebook: "20210817205410-2kvfpfn",
                    conf: {
                        name: "Test Notebook",
                        closed: false,
                        refCreateSavePath: "/",
                        createDocNameTemplate: "${title}",
                        dailyNoteSavePath: "/daily note/",
                        dailyNoteTemplate: ""
                    }
                },
                response: {}
            }
        ],
        apiLink: 'https://github.com/siyuan-note/siyuan/blob/master/API.md#save-notebook-configuration'
    }
};

// Register all notebook related commands
export function registerNotebookHandlers() {
    registry.registerCommand(lsNotebooksHandler);
    registry.registerCommand(openNotebookHandler);
    registry.registerCommand(closeNotebookHandler);
    registry.registerCommand(renameNotebookHandler);
    registry.registerCommand(createNotebookHandler);
    registry.registerCommand(removeNotebookHandler);
    registry.registerCommand(getNotebookConfHandler);
    registry.registerCommand(setNotebookConfHandler);
}
