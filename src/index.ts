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

  /**
   * Generate a true random number using quantum random number generator
   */
  static async generateTrueRandomInteger(min: number = 0, max: number = 1): Promise<number> {
    if (min > max) {
      throw new Error("Minimum value cannot be greater than maximum value");
    }

    try {
      // Fetch quantum random bytes from the API
      const response = await fetch('https://lfdr.de/qrng_api/qrng?length=8&format=HEX');
      
      if (!response.ok) {
        throw new Error(`Quantum RNG API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as { qrn: string; length: number };
      
      if (!data.qrn || typeof data.qrn !== 'string') {
        throw new Error('Invalid response from quantum RNG API');
      }

      // Convert the full hex string directly to a decimal value
      const hexValue = data.qrn;
      const quantumNumber = parseInt(hexValue, 16);
      
      // Maximum possible value for 8 bytes (16 hex chars)
      const maxHexValue = Math.pow(2, 64) - 1; // 0xFFFFFFFFFFFFFFFF
      
      // Convert to decimal between 0 and 1
      const normalizedValue = quantumNumber / maxHexValue;
      
      // Scale to the desired range
      return Math.floor(normalizedValue * (max - min + 1)) + min;
      
    } catch (error) {
      throw new Error(`Failed to generate true random number: ${error instanceof Error ? error.message : String(error)}`);
    }
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
  },
  {
    name: "true_random_integer",
    description: "Generate a truly random integer using quantum random number generator between min and max values (inclusive). Uses quantum entropy from https://lfdr.de/QRNG/ to seed the random number generator.",
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
      case "true_random_integer":
        const tmin = (args.min as number) || 0;
        const tmax = (args.max as number) || 1;
        result = await RandomToolkit.generateTrueRandomInteger(tmin, tmax);
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
