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
 * Mathematical operations toolkit for MCP
 */
class MathToolkit {
  
  /**
   * Basic arithmetic operations
   */
  static add(a: number, b: number): number {
    return a + b;
  }

  static subtract(a: number, b: number): number {
    return a - b;
  }

  static multiply(a: number, b: number): number {
    return a * b;
  }

  static divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Division by zero is not allowed");
    }
    return a / b;
  }

  /**
   * Advanced mathematical operations
   */
  static power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }

  static sqrt(n: number): number {
    if (n < 0) {
      throw new Error("Square root of negative number is not supported");
    }
    return Math.sqrt(n);
  }

  static factorial(n: number): number {
    if (n < 0 || !Number.isInteger(n)) {
      throw new Error("Factorial is only defined for non-negative integers");
    }
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  /**
   * Trigonometric functions (angles in radians)
   */
  static sin(angle: number): number {
    return Math.sin(angle);
  }

  static cos(angle: number): number {
    return Math.cos(angle);
  }

  static tan(angle: number): number {
    return Math.tan(angle);
  }

  /**
   * Logarithmic functions
   */
  static log(n: number): number {
    if (n <= 0) {
      throw new Error("Logarithm is only defined for positive numbers");
    }
    return Math.log(n);
  }

  static log10(n: number): number {
    if (n <= 0) {
      throw new Error("Logarithm is only defined for positive numbers");
    }
    return Math.log10(n);
  }

  /**
   * Statistical functions
   */
  static mean(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error("Cannot calculate mean of empty array");
    }
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }

  static median(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error("Cannot calculate median of empty array");
    }
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  static standardDeviation(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error("Cannot calculate standard deviation of empty array");
    }
    const mean = this.mean(numbers);
    const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
    return Math.sqrt(variance);
  }

  /**
   * Utility functions
   */
  static round(n: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals);
    return Math.round(n * factor) / factor;
  }

  static abs(n: number): number {
    return Math.abs(n);
  }

  static min(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error("Cannot find minimum of empty array");
    }
    return Math.min(...numbers);
  }

  static max(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error("Cannot find maximum of empty array");
    }
    return Math.max(...numbers);
  }
}

/**
 * Define the available tools for the MCP server
 */
const tools: Tool[] = [
  {
    name: "add",
    description: "Add two numbers",
    inputSchema: {
      type: "object",
      properties: {
        a: { type: "number", description: "First number" },
        b: { type: "number", description: "Second number" }
      },
      required: ["a", "b"]
    }
  },
  {
    name: "subtract",
    description: "Subtract second number from first number",
    inputSchema: {
      type: "object",
      properties: {
        a: { type: "number", description: "First number" },
        b: { type: "number", description: "Second number" }
      },
      required: ["a", "b"]
    }
  },
  {
    name: "multiply",
    description: "Multiply two numbers",
    inputSchema: {
      type: "object",
      properties: {
        a: { type: "number", description: "First number" },
        b: { type: "number", description: "Second number" }
      },
      required: ["a", "b"]
    }
  },
  {
    name: "divide",
    description: "Divide first number by second number",
    inputSchema: {
      type: "object",
      properties: {
        a: { type: "number", description: "Dividend" },
        b: { type: "number", description: "Divisor" }
      },
      required: ["a", "b"]
    }
  },
  {
    name: "power",
    description: "Raise base to the power of exponent",
    inputSchema: {
      type: "object",
      properties: {
        base: { type: "number", description: "Base number" },
        exponent: { type: "number", description: "Exponent" }
      },
      required: ["base", "exponent"]
    }
  },
  {
    name: "sqrt",
    description: "Calculate square root of a number",
    inputSchema: {
      type: "object",
      properties: {
        n: { type: "number", description: "Number to calculate square root of" }
      },
      required: ["n"]
    }
  },
  {
    name: "factorial",
    description: "Calculate factorial of a non-negative integer",
    inputSchema: {
      type: "object",
      properties: {
        n: { type: "number", description: "Non-negative integer" }
      },
      required: ["n"]
    }
  },
  {
    name: "sin",
    description: "Calculate sine of angle in radians",
    inputSchema: {
      type: "object",
      properties: {
        angle: { type: "number", description: "Angle in radians" }
      },
      required: ["angle"]
    }
  },
  {
    name: "cos",
    description: "Calculate cosine of angle in radians",
    inputSchema: {
      type: "object",
      properties: {
        angle: { type: "number", description: "Angle in radians" }
      },
      required: ["angle"]
    }
  },
  {
    name: "tan",
    description: "Calculate tangent of angle in radians",
    inputSchema: {
      type: "object",
      properties: {
        angle: { type: "number", description: "Angle in radians" }
      },
      required: ["angle"]
    }
  },
  {
    name: "log",
    description: "Calculate natural logarithm of a positive number",
    inputSchema: {
      type: "object",
      properties: {
        n: { type: "number", description: "Positive number" }
      },
      required: ["n"]
    }
  },
  {
    name: "log10",
    description: "Calculate base-10 logarithm of a positive number",
    inputSchema: {
      type: "object",
      properties: {
        n: { type: "number", description: "Positive number" }
      },
      required: ["n"]
    }
  },
  {
    name: "mean",
    description: "Calculate arithmetic mean of an array of numbers",
    inputSchema: {
      type: "object",
      properties: {
        numbers: { 
          type: "array", 
          items: { type: "number" },
          description: "Array of numbers" 
        }
      },
      required: ["numbers"]
    }
  },
  {
    name: "median",
    description: "Calculate median of an array of numbers",
    inputSchema: {
      type: "object",
      properties: {
        numbers: { 
          type: "array", 
          items: { type: "number" },
          description: "Array of numbers" 
        }
      },
      required: ["numbers"]
    }
  },
  {
    name: "standard_deviation",
    description: "Calculate standard deviation of an array of numbers",
    inputSchema: {
      type: "object",
      properties: {
        numbers: { 
          type: "array", 
          items: { type: "number" },
          description: "Array of numbers" 
        }
      },
      required: ["numbers"]
    }
  },
  {
    name: "round",
    description: "Round a number to specified decimal places",
    inputSchema: {
      type: "object",
      properties: {
        n: { type: "number", description: "Number to round" },
        decimals: { type: "number", description: "Number of decimal places", default: 0 }
      },
      required: ["n"]
    }
  },
  {
    name: "abs",
    description: "Calculate absolute value of a number",
    inputSchema: {
      type: "object",
      properties: {
        n: { type: "number", description: "Number" }
      },
      required: ["n"]
    }
  },
  {
    name: "min",
    description: "Find minimum value in an array of numbers",
    inputSchema: {
      type: "object",
      properties: {
        numbers: { 
          type: "array", 
          items: { type: "number" },
          description: "Array of numbers" 
        }
      },
      required: ["numbers"]
    }
  },
  {
    name: "max",
    description: "Find maximum value in an array of numbers",
    inputSchema: {
      type: "object",
      properties: {
        numbers: { 
          type: "array", 
          items: { type: "number" },
          description: "Array of numbers" 
        }
      },
      required: ["numbers"]
    }
  }
];

/**
 * Create and configure the MCP server
 */
const server = new Server(
  {
    name: "mcp-math-toolkit",
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
      case "add":
        result = MathToolkit.add(args.a as number, args.b as number);
        break;
      case "subtract":
        result = MathToolkit.subtract(args.a as number, args.b as number);
        break;
      case "multiply":
        result = MathToolkit.multiply(args.a as number, args.b as number);
        break;
      case "divide":
        result = MathToolkit.divide(args.a as number, args.b as number);
        break;
      case "power":
        result = MathToolkit.power(args.base as number, args.exponent as number);
        break;
      case "sqrt":
        result = MathToolkit.sqrt(args.n as number);
        break;
      case "factorial":
        result = MathToolkit.factorial(args.n as number);
        break;
      case "sin":
        result = MathToolkit.sin(args.angle as number);
        break;
      case "cos":
        result = MathToolkit.cos(args.angle as number);
        break;
      case "tan":
        result = MathToolkit.tan(args.angle as number);
        break;
      case "log":
        result = MathToolkit.log(args.n as number);
        break;
      case "log10":
        result = MathToolkit.log10(args.n as number);
        break;
      case "mean":
        result = MathToolkit.mean(args.numbers as number[]);
        break;
      case "median":
        result = MathToolkit.median(args.numbers as number[]);
        break;
      case "standard_deviation":
        result = MathToolkit.standardDeviation(args.numbers as number[]);
        break;
      case "round":
        result = MathToolkit.round(args.n as number, (args.decimals as number) || 0);
        break;
      case "abs":
        result = MathToolkit.abs(args.n as number);
        break;
      case "min":
        result = MathToolkit.min(args.numbers as number[]);
        break;
      case "max":
        result = MathToolkit.max(args.numbers as number[]);
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
  console.error("MCP Math Toolkit server running on stdio");
}

// Handle cleanup on exit
process.on('SIGINT', async () => {
  console.error("Shutting down MCP Math Toolkit server");
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.error("Shutting down MCP Math Toolkit server");
  process.exit(0);
});

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
