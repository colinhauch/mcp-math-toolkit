#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Random number generator toolkit for MCP
 */
class RandomToolkit {
  
  /**
   * Generate a pseudo random integer between min and max (inclusive)
   */
  static generatePseudoRandomInteger(min: number = 0, max: number = 1): number {
    if (min > max) {
      throw new Error("Minimum value cannot be greater than maximum value");
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

/**
 * Define the available tools for the MCP server
 */
const tools: Tool[] = [
  {
    name: "pseudo_random_integer",
    description: "Generate a pseudo random integer between min and max values (inclusive)",
    inputSchema: {
      type: "object",
      properties: {
        min: { type: "number", description: "Minimum value (default: 0)", default: 0 },
        max: { type: "number", description: "Maximum value (default: 1)", default: 1 }
      },
      required: []
    }
  }
];

/**
 * Create and configure the MCP server
 */
const server = new Server(
  {
    name: "mcp-random-toolkit",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

/**
 * Handle tool listing requests
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

/**
 * Handle tool execution requests
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Validate arguments exist
    if (!args) {
      throw new Error("Missing arguments");
    }

    let result: any;

    switch (name) {
      case "pseudo_random_integer":
        const min = (args.min as number) || 0;
        const max = (args.max as number) || 1;
        result = RandomToolkit.generatePseudoRandomInteger(min, max);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: `Result: ${result}`
        }
      ]
    } as CallToolResult;

  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error instanceof Error ? error.message : String(error)}`
        }
      ],
      isError: true
    } as CallToolResult;
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Random Toolkit server running on stdio");
}

// Handle cleanup on exit
process.on('SIGINT', async () => {
  console.error("Shutting down MCP Random Toolkit server");
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error("Shutting down MCP Random Toolkit server");
  process.exit(0);
});

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
